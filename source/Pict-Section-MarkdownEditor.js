const libPictViewClass = require('pict-view');
const libPictSectionContent = require('pict-section-content');
const libPictContentProvider = libPictSectionContent.PictContentProvider;
const _DefaultConfiguration = require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');

// Markdown formatting definitions: wrapper characters for toggle-style formatting
const _FormattingMap =
{
	bold: { wrap: '**' },
	italic: { wrap: '*' },
	code: { wrap: '`' },
	heading: { prefix: '# ' },
	link: { before: '[', after: '](url)' }
};

class PictSectionMarkdownEditor extends libPictViewClass
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DefaultConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.initialRenderComplete = false;

		// CodeMirror prototype references (injected by consumer or found on window)
		this._codeMirrorModules = null;

		// Map of segment index to CodeMirror EditorView instance
		this._segmentEditors = {};

		// Internal segment counter (monotonically increasing for unique IDs)
		this._segmentCounter = 0;

		// The view identifier used for onclick handlers in templates
		this._viewCallIdentifier = false;

		// Currently active (focused) segment index, or -1
		this._activeSegmentIndex = -1;

		// Drag state for reorder
		this._dragSourceIndex = -1;

		// Whether line numbers are currently shown
		this._lineNumbersVisible = false;

		// Whether rich previews are globally visible
		this._previewsVisible = true;

		// Set of logical segment indices where preview has been individually hidden
		this._hiddenPreviewSegments = {};

		// Debounce timers for image preview updates (keyed by segment index)
		this._imagePreviewTimers = {};

		// Debounce timers for rich content preview updates (keyed by segment index)
		this._richPreviewTimers = {};

		// Generation counters for mermaid async rendering (keyed by segment index)
		this._richPreviewGenerations = {};

		// Content provider for markdown-to-HTML rendering in rich previews
		// (pict-section-content provides parseMarkdown, code highlighting, etc.)
		this._contentProvider = null;

		// Whether the rendered (read-mode) view is currently active
		this._renderedViewActive = false;

		// Generation counter for rendered view mermaid async rendering
		this._renderedViewGeneration = 0;
	}

	onBeforeInitialize()
	{
		super.onBeforeInitialize();

		this.targetElement = false;

		return super.onBeforeInitialize();
	}

	/**
	 * Connect the CodeMirror modules.  The consumer must pass an object with:
	 *   - EditorView: the EditorView class
	 *   - EditorState: the EditorState class
	 *   - extensions: an array of extensions to use (e.g. basicSetup, markdown(), etc.)
	 *
	 * If not called explicitly, the view will attempt to find them on window.CodeMirrorModules.
	 *
	 * @param {object} [pCodeMirrorModules] - The CodeMirror modules object
	 * @returns {boolean|void}
	 */
	connectCodeMirrorModules(pCodeMirrorModules)
	{
		if (pCodeMirrorModules && typeof (pCodeMirrorModules) === 'object')
		{
			if (typeof (pCodeMirrorModules.EditorView) === 'function' && typeof (pCodeMirrorModules.EditorState) === 'function')
			{
				this._codeMirrorModules = pCodeMirrorModules;
				return;
			}
		}

		// Try to find CodeMirror modules in global scope
		if (typeof (window) !== 'undefined')
		{
			if (window.CodeMirrorModules && typeof (window.CodeMirrorModules.EditorView) === 'function')
			{
				this.log.trace(`PICT-MarkdownEditor Found CodeMirror modules on window.CodeMirrorModules.`);
				this._codeMirrorModules = window.CodeMirrorModules;
				return;
			}
		}

		this.log.error(`PICT-MarkdownEditor No CodeMirror modules found. Provide them via connectCodeMirrorModules() or set window.CodeMirrorModules.`);
		return false;
	}

	onAfterRender(pRenderable)
	{
		// Inject CSS from all registered views
		this.pict.CSSMap.injectCSS();

		if (!this.initialRenderComplete)
		{
			this.onAfterInitialRender();
			this.initialRenderComplete = true;
		}

		return super.onAfterRender(pRenderable);
	}

	onAfterInitialRender()
	{
		// Resolve CodeMirror modules if not already set
		if (!this._codeMirrorModules)
		{
			this.connectCodeMirrorModules();
		}

		if (!this._codeMirrorModules)
		{
			this.log.error(`PICT-MarkdownEditor Cannot initialize; no CodeMirror modules available.`);
			return false;
		}

		// Register pict-section-content's CSS for rich preview rendering.
		// This ensures the rendered markdown (headings, code blocks, tables, etc.)
		// is styled correctly inside the preview area.
		if (this.options.EnableRichPreview)
		{
			let tmpContentViewConfig = libPictSectionContent.default_configuration;
			if (tmpContentViewConfig && tmpContentViewConfig.CSS)
			{
				this.pict.CSSMap.addCSS('Pict-Content-View', tmpContentViewConfig.CSS);
			}
		}

		// Find the target element
		let tmpTargetElementSet = this.services.ContentAssignment.getElement(this.options.TargetElementAddress);
		if (!tmpTargetElementSet || tmpTargetElementSet.length < 1)
		{
			this.log.error(`PICT-MarkdownEditor Could not find target element [${this.options.TargetElementAddress}]!`);
			this.targetElement = false;
			return false;
		}
		this.targetElement = tmpTargetElementSet[0];

		// Determine the view call identifier for onclick handlers
		this._viewCallIdentifier = this._resolveViewCallIdentifier();

		// Build the editor UI
		this._buildEditorUI();
	}

	/**
	 * Resolve how the view can be referenced from global onclick handlers.
	 * Returns a string like "_Pict.views.MyViewHash"
	 *
	 * @returns {string}
	 */
	_resolveViewCallIdentifier()
	{
		let tmpViews = this.pict.views;
		for (let tmpViewHash in tmpViews)
		{
			if (tmpViews[tmpViewHash] === this)
			{
				return `_Pict.views.${tmpViewHash}`;
			}
		}
		return `_Pict.servicesMap.PictView['${this.Hash}']`;
	}

	/**
	 * Get the .pict-mde container element.  Always does a fresh DOM lookup
	 * because pict's async render pipeline can replace the element between calls.
	 *
	 * @returns {HTMLElement|null}
	 */
	_getContainerElement()
	{
		if (this.targetElement)
		{
			let tmpContainer = this.targetElement.querySelector('.pict-mde');
			if (tmpContainer)
			{
				return tmpContainer;
			}
		}
		return this.targetElement || null;
	}

	/**
	 * Build the full editor UI: render existing segments from data and the add-segment button.
	 */
	_buildEditorUI()
	{
		let tmpContainer = this._getContainerElement();

		// Ensure the container has the pict-mde class (the template's wrapper
		// may have been replaced by pict's async render pipeline)
		if (tmpContainer && !tmpContainer.classList.contains('pict-mde'))
		{
			tmpContainer.classList.add('pict-mde');
		}

		// Destroy existing editors before clearing
		for (let tmpIdx in this._segmentEditors)
		{
			if (this._segmentEditors[tmpIdx])
			{
				this._segmentEditors[tmpIdx].destroy();
			}
		}

		tmpContainer.innerHTML = '';

		// Restore toggle states on the container after clearing
		if (!this._previewsVisible)
		{
			tmpContainer.classList.add('pict-mde-previews-hidden');
		}
		if (this._lineNumbersVisible)
		{
			tmpContainer.classList.add('pict-mde-linenums-on');
		}

		// Load existing segments from data address, or start with one empty segment
		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments || tmpSegments.length === 0)
		{
			tmpSegments = [{ Content: '' }];
			this._setSegmentsToData(tmpSegments);
		}

		this._segmentCounter = 0;
		this._segmentEditors = {};

		for (let i = 0; i < tmpSegments.length; i++)
		{
			this._renderSegment(tmpContainer, i, tmpSegments[i].Content || '');
		}

		this._renderAddButton(tmpContainer);
	}

	/**
	 * Render a single segment into the container.
	 *
	 * @param {HTMLElement} pContainer - The container element
	 * @param {number} pIndex - The segment index
	 * @param {string} pContent - The initial content
	 */
	_renderSegment(pContainer, pIndex, pContent)
	{
		let tmpSegmentIndex = this._segmentCounter++;

		let tmpRecord =
		{
			SegmentIndex: tmpSegmentIndex,
			SegmentDisplayIndex: pIndex + 1,
			ViewIdentifier: this._viewCallIdentifier
		};

		let tmpHTML = this.pict.parseTemplateByHash('MarkdownEditor-Segment', tmpRecord);

		let tmpTempDiv = document.createElement('div');
		tmpTempDiv.innerHTML = tmpHTML;
		let tmpSegmentElement = tmpTempDiv.firstElementChild;
		pContainer.appendChild(tmpSegmentElement);

		// Restore per-segment preview hidden state (tracked by logical index)
		if (this._hiddenPreviewSegments[pIndex])
		{
			tmpSegmentElement.classList.add('pict-mde-preview-hidden');
		}

		// Wire up drag-and-drop on the drag handle
		this._wireSegmentDragEvents(tmpSegmentElement, tmpSegmentIndex);

		// Create the CodeMirror editor in the segment editor container
		let tmpEditorContainer = document.getElementById(`PictMDE-SegmentEditor-${tmpSegmentIndex}`);
		if (tmpEditorContainer)
		{
			this._createEditorInContainer(tmpEditorContainer, tmpSegmentIndex, pContent);

			// Wire image drag-and-drop on the editor container
			this._wireImageDragEvents(tmpEditorContainer, tmpSegmentIndex);

			// Render image previews for existing content
			if (pContent)
			{
				this._updateImagePreviews(tmpSegmentIndex);
				this._updateRichPreviews(tmpSegmentIndex);
			}
		}
	}

	/**
	 * Wire drag-and-drop events on a segment element for reorder via the drag handle.
	 *
	 * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_wireSegmentDragEvents(pSegmentElement, pSegmentIndex)
	{
		let tmpHandle = pSegmentElement.querySelector('.pict-mde-drag-handle');
		if (!tmpHandle)
		{
			return;
		}

		let tmpSelf = this;

		// The drag handle is the draggable element
		tmpHandle.addEventListener('dragstart', (pEvent) =>
		{
			tmpSelf._dragSourceIndex = pSegmentIndex;
			pEvent.dataTransfer.effectAllowed = 'move';
			pEvent.dataTransfer.setData('text/plain', String(pSegmentIndex));
			// Add a dragging class to the container so CSS can disable pointer-events
			// on CodeMirror editors (preventing them from intercepting the drop event)
			let tmpContainerEl = tmpSelf._getContainerElement();
			if (tmpContainerEl)
			{
				tmpContainerEl.classList.add('pict-mde-dragging');
			}
			setTimeout(() =>
			{
				pSegmentElement.style.opacity = '0.4';
			}, 0);
		});

		tmpHandle.addEventListener('dragend', () =>
		{
			pSegmentElement.style.opacity = '';
			tmpSelf._dragSourceIndex = -1;
			tmpSelf._clearAllDropIndicators();
			// Remove the dragging class from the container
			let tmpContainerEl = tmpSelf._getContainerElement();
			if (tmpContainerEl)
			{
				tmpContainerEl.classList.remove('pict-mde-dragging');
			}
		});

		// Drop target: the whole segment row. We determine above/below from mouse Y.
		pSegmentElement.addEventListener('dragover', (pEvent) =>
		{
			pEvent.preventDefault();
			pEvent.dataTransfer.dropEffect = 'move';

			// Clear all indicators first, then set the correct one
			tmpSelf._clearAllDropIndicators();

			// Determine if cursor is in the top or bottom half of this segment
			let tmpRect = pSegmentElement.getBoundingClientRect();
			let tmpMidY = tmpRect.top + (tmpRect.height / 2);
			if (pEvent.clientY < tmpMidY)
			{
				pSegmentElement.classList.add('pict-mde-drag-over-top');
			}
			else
			{
				pSegmentElement.classList.add('pict-mde-drag-over-bottom');
			}
		});

		pSegmentElement.addEventListener('dragleave', (pEvent) =>
		{
			// Only clear if we're actually leaving the element (not entering a child)
			if (!pSegmentElement.contains(pEvent.relatedTarget))
			{
				pSegmentElement.classList.remove('pict-mde-drag-over-top');
				pSegmentElement.classList.remove('pict-mde-drag-over-bottom');
			}
		});

		pSegmentElement.addEventListener('drop', (pEvent) =>
		{
			pEvent.preventDefault();

			let tmpDropBelow = pSegmentElement.classList.contains('pict-mde-drag-over-bottom');
			tmpSelf._clearAllDropIndicators();

			let tmpSourceIndex = tmpSelf._dragSourceIndex;
			if (tmpSourceIndex < 0 || tmpSourceIndex === pSegmentIndex)
			{
				return;
			}

			tmpSelf._reorderSegment(tmpSourceIndex, pSegmentIndex, tmpDropBelow);
		});
	}

	/**
	 * Clear all drop indicator classes from all segments.
	 */
	_clearAllDropIndicators()
	{
		let tmpContainer = this._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}
		let tmpAllSegments = tmpContainer.querySelectorAll('.pict-mde-segment');
		for (let i = 0; i < tmpAllSegments.length; i++)
		{
			tmpAllSegments[i].classList.remove('pict-mde-drag-over-top');
			tmpAllSegments[i].classList.remove('pict-mde-drag-over-bottom');
		}
	}

	/**
	 * Wire drag-and-drop events for image files on a segment editor container.
	 *
	 * These events are separate from the segment-reorder drag events.
	 * File drags are distinguished from segment reorder drags by checking
	 * dataTransfer.types for 'Files' and ensuring _dragSourceIndex is -1.
	 *
	 * @param {HTMLElement} pEditorContainer - The .pict-mde-segment-editor element
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_wireImageDragEvents(pEditorContainer, pSegmentIndex)
	{
		let tmpSelf = this;

		pEditorContainer.addEventListener('dragover', (pEvent) =>
		{
			// Only handle file drags, not segment-reorder drags
			if (tmpSelf._dragSourceIndex >= 0)
			{
				return;
			}
			if (!pEvent.dataTransfer || !pEvent.dataTransfer.types || pEvent.dataTransfer.types.indexOf('Files') < 0)
			{
				return;
			}
			pEvent.preventDefault();
			pEvent.dataTransfer.dropEffect = 'copy';
			pEditorContainer.classList.add('pict-mde-image-dragover');
		});

		pEditorContainer.addEventListener('dragleave', (pEvent) =>
		{
			// Only clear if actually leaving the element
			if (!pEditorContainer.contains(pEvent.relatedTarget))
			{
				pEditorContainer.classList.remove('pict-mde-image-dragover');
			}
		});

		pEditorContainer.addEventListener('drop', (pEvent) =>
		{
			pEditorContainer.classList.remove('pict-mde-image-dragover');

			// Only handle file drops, not segment-reorder drops
			if (tmpSelf._dragSourceIndex >= 0)
			{
				return;
			}
			if (!pEvent.dataTransfer || !pEvent.dataTransfer.files || pEvent.dataTransfer.files.length < 1)
			{
				return;
			}

			let tmpFile = pEvent.dataTransfer.files[0];
			if (tmpFile.type && tmpFile.type.startsWith('image/'))
			{
				pEvent.preventDefault();
				pEvent.stopPropagation();
				tmpSelf._processImageFile(tmpFile, pSegmentIndex);
			}
		});
	}

	/**
	 * Reorder a segment from one position to another via drag.
	 *
	 * @param {number} pFromInternalIndex - The internal index of the dragged segment
	 * @param {number} pToInternalIndex - The internal index of the drop target
	 * @param {boolean} pDropBelow - Whether the drop was on the bottom half of the target
	 */
	_reorderSegment(pFromInternalIndex, pToInternalIndex, pDropBelow)
	{
		let tmpFromLogical = this._getLogicalIndex(pFromInternalIndex);
		let tmpToLogical = this._getLogicalIndex(pToInternalIndex);

		if (tmpFromLogical < 0 || tmpToLogical < 0)
		{
			this.log.warn(`PICT-MarkdownEditor _reorderSegment: could not resolve logical indices (from=${tmpFromLogical}, to=${tmpToLogical}).`);
			return;
		}

		if (tmpFromLogical === tmpToLogical)
		{
			return;
		}

		// Marshal all editor content back to data before manipulating the array
		this._marshalAllEditorsToData();

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments || tmpSegments.length < 2)
		{
			return;
		}

		// Calculate the target insertion index
		let tmpInsertAt = pDropBelow ? tmpToLogical + 1 : tmpToLogical;

		// Adjust for the removal shifting indices down
		if (tmpFromLogical < tmpInsertAt)
		{
			tmpInsertAt--;
		}

		// If the insert position equals the source, no move needed
		if (tmpInsertAt === tmpFromLogical)
		{
			return;
		}

		// Perform the reorder: remove from old position, insert at new
		let tmpMoved = tmpSegments.splice(tmpFromLogical, 1)[0];
		tmpSegments.splice(tmpInsertAt, 0, tmpMoved);

		// Explicitly write the reordered array back to the data address
		this._setSegmentsToData(tmpSegments);

		// Reorder per-segment hidden preview state to follow the moved segment
		this._reorderHiddenPreviewState(tmpFromLogical, tmpInsertAt);

		this._buildEditorUI();
	}

	/**
	 * Create a CodeMirror editor instance inside a container element.
	 *
	 * @param {HTMLElement} pContainer - The DOM element to mount the editor in
	 * @param {number} pSegmentIndex - The segment index
	 * @param {string} pContent - The initial content
	 */
	_createEditorInContainer(pContainer, pSegmentIndex, pContent)
	{
		let tmpCM = this._codeMirrorModules;
		let tmpSelf = this;

		// Build the extensions array
		let tmpExtensions = [];

		// Add consumer-provided extensions (e.g. basicSetup, markdown())
		if (tmpCM.extensions && Array.isArray(tmpCM.extensions))
		{
			tmpExtensions = tmpExtensions.concat(tmpCM.extensions);
		}

		// Update listener for content changes, focus, and cursor tracking
		tmpExtensions.push(
			tmpCM.EditorView.updateListener.of((pUpdate) =>
			{
				if (pUpdate.docChanged)
				{
					tmpSelf._onSegmentContentChange(pSegmentIndex, pUpdate.state.doc.toString());
				}

				// Track focus changes to toggle the active class
				if (pUpdate.focusChanged)
				{
					if (pUpdate.view.hasFocus)
					{
						tmpSelf._setActiveSegment(pSegmentIndex);
						// Position sidebar at cursor on focus
						tmpSelf._updateSidebarPosition(pSegmentIndex);
					}
					else
					{
						// Small delay so clicking a sidebar button doesn't immediately deactivate
						setTimeout(() =>
						{
							if (tmpSelf._activeSegmentIndex === pSegmentIndex)
							{
								// Check if focus moved to another segment or truly left
								let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
								if (tmpSegEl && !tmpSegEl.contains(document.activeElement))
								{
									tmpSelf._clearActiveSegment(pSegmentIndex);
									tmpSelf._resetSidebarPosition(pSegmentIndex);
								}
							}
						}, 100);
					}
				}

				// Track cursor/selection changes to move the sidebar
				if (pUpdate.selectionSet && pUpdate.view.hasFocus)
				{
					tmpSelf._updateSidebarPosition(pSegmentIndex);
				}
			})
		);

		// Keyboard shortcuts for formatting and image paste handling
		tmpExtensions.push(
			tmpCM.EditorView.domEventHandlers(
			{
				keydown: (pEvent, pView) =>
				{
					// Ctrl/Cmd + B = bold
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'b')
					{
						pEvent.preventDefault();
						tmpSelf.applyFormatting(pSegmentIndex, 'bold');
						return true;
					}
					// Ctrl/Cmd + I = italic
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'i')
					{
						pEvent.preventDefault();
						tmpSelf.applyFormatting(pSegmentIndex, 'italic');
						return true;
					}
					// Ctrl/Cmd + E = inline code
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'e')
					{
						pEvent.preventDefault();
						tmpSelf.applyFormatting(pSegmentIndex, 'code');
						return true;
					}
				},
				paste: (pEvent, pView) =>
				{
					// Check clipboard for image data
					let tmpItems = pEvent.clipboardData && pEvent.clipboardData.items;
					if (!tmpItems)
					{
						return false;
					}
					for (let i = 0; i < tmpItems.length; i++)
					{
						if (tmpItems[i].type.startsWith('image/'))
						{
							pEvent.preventDefault();
							let tmpFile = tmpItems[i].getAsFile();
							if (tmpFile)
							{
								tmpSelf._processImageFile(tmpFile, pSegmentIndex);
							}
							return true;
						}
					}
					return false;
				}
			})
		);

		// Collapse long data URIs in image markdown so the editor is readable
		let tmpCollapseExtension = this._buildDataURICollapseExtension();
		if (tmpCollapseExtension)
		{
			tmpExtensions.push(tmpCollapseExtension);
		}

		// Make read-only if configured
		if (this.options.ReadOnly)
		{
			tmpExtensions.push(tmpCM.EditorState.readOnly.of(true));
			tmpExtensions.push(tmpCM.EditorView.editable.of(false));
		}

		// Allow consumer to customize extensions
		tmpExtensions = this.customConfigureExtensions(tmpExtensions, pSegmentIndex);

		let tmpState = tmpCM.EditorState.create(
		{
			doc: pContent || '',
			extensions: tmpExtensions
		});

		let tmpEditorView = new tmpCM.EditorView(
		{
			state: tmpState,
			parent: pContainer
		});

		this._segmentEditors[pSegmentIndex] = tmpEditorView;
	}

	/**
	 * Hook for subclasses to customize the CodeMirror extensions before editor creation.
	 *
	 * @param {Array} pExtensions - The extensions array to modify
	 * @param {number} pSegmentIndex - The segment index
	 * @returns {Array} The modified extensions array
	 */
	customConfigureExtensions(pExtensions, pSegmentIndex)
	{
		return pExtensions;
	}

	/**
	 * Build a CodeMirror extension that visually collapses long data URIs
	 * inside markdown image syntax.
	 *
	 * The extension uses Decoration.replace() to hide the long base64 portion
	 * and show a compact widget instead, e.g. "data:image/jpeg;base64…28KB".
	 * The actual document content is unchanged — only the visual display
	 * is affected.
	 *
	 * Returns null if the required CodeMirror modules (Decoration, ViewPlugin,
	 * WidgetType) are not available.
	 *
	 * @returns {object|null} A CodeMirror ViewPlugin extension, or null
	 */
	_buildDataURICollapseExtension()
	{
		let tmpCM = this._codeMirrorModules;

		// All three classes are required — degrade gracefully if not available
		if (!tmpCM || !tmpCM.Decoration || !tmpCM.ViewPlugin || !tmpCM.WidgetType)
		{
			return null;
		}

		let tmpDecoration = tmpCM.Decoration;
		let tmpViewPlugin = tmpCM.ViewPlugin;
		let tmpWidgetType = tmpCM.WidgetType;

		// Minimum data URI length before collapsing (short URIs are left alone)
		let tmpMinLength = 200;

		// Widget class: renders the collapsed placeholder inline
		class DataURIWidget extends tmpWidgetType
		{
			constructor(pLabel)
			{
				super();
				this.label = pLabel;
			}

			toDOM()
			{
				let tmpSpan = document.createElement('span');
				tmpSpan.className = 'pict-mde-data-uri-collapsed';
				tmpSpan.textContent = this.label;
				tmpSpan.title = 'Data URI (click to expand in image preview below)';
				return tmpSpan;
			}

			eq(pOther)
			{
				return this.label === pOther.label;
			}
		}

		/**
		 * Scan the visible ranges of the document for data URIs inside image
		 * markdown and build a DecorationSet that replaces the long portion.
		 *
		 * Pattern:  ![alt](data:image/TYPE;base64,LONGSTRING)
		 *
		 * We keep "![alt](data:image/TYPE;base64," visible and replace only the
		 * long base64 payload plus the closing ")" with a compact widget.
		 */
		function buildDecorations(pView)
		{
			let tmpDecorations = [];
			let tmpDoc = pView.state.doc;

			for (let tmpVisRange of pView.visibleRanges)
			{
				let tmpFrom = tmpVisRange.from;
				let tmpTo = tmpVisRange.to;
				let tmpText = tmpDoc.sliceString(tmpFrom, tmpTo);

				// Match: ![...](data:image/...;base64,...) — we need positions of the base64 payload
				let tmpRegex = /!\[[^\]]*\]\(data:([^;]+);base64,/g;
				let tmpMatch;

				while ((tmpMatch = tmpRegex.exec(tmpText)) !== null)
				{
					// tmpMatch[0] is "![alt](data:image/png;base64,"
					// tmpMatch[1] is the MIME subtype, e.g. "image/png"
					let tmpPayloadStart = tmpFrom + tmpMatch.index + tmpMatch[0].length;

					// Find the closing parenthesis — scan forward from payloadStart
					let tmpPayloadEnd = -1;
					let tmpSearchFrom = tmpPayloadStart;
					let tmpDocLength = tmpDoc.length;

					// Scan character by character in the document for the closing ')'
					// We need to handle this carefully since the payload could be huge
					// and span beyond the visible range.
					// Search up to 5MB worth of characters (way more than any realistic image).
					let tmpMaxScan = Math.min(tmpDocLength, tmpSearchFrom + 5 * 1024 * 1024);
					let tmpChunkSize = 4096;

					for (let tmpPos = tmpSearchFrom; tmpPos < tmpMaxScan; tmpPos += tmpChunkSize)
					{
						let tmpEnd = Math.min(tmpPos + tmpChunkSize, tmpMaxScan);
						let tmpChunk = tmpDoc.sliceString(tmpPos, tmpEnd);
						let tmpParenIdx = tmpChunk.indexOf(')');
						if (tmpParenIdx >= 0)
						{
							tmpPayloadEnd = tmpPos + tmpParenIdx;
							break;
						}
					}

					if (tmpPayloadEnd < 0)
					{
						// No closing paren found — skip this match
						continue;
					}

					// Calculate the payload length (base64 data between comma and closing paren)
					let tmpPayloadLength = tmpPayloadEnd - tmpPayloadStart;

					if (tmpPayloadLength < tmpMinLength)
					{
						// Too short to bother collapsing
						continue;
					}

					// Build a human-readable size label
					let tmpSizeBytes = Math.round(tmpPayloadLength * 0.75); // base64 to bytes approx
					let tmpSizeLabel;
					if (tmpSizeBytes >= 1024 * 1024)
					{
						tmpSizeLabel = (tmpSizeBytes / (1024 * 1024)).toFixed(1) + 'MB';
					}
					else if (tmpSizeBytes >= 1024)
					{
						tmpSizeLabel = Math.round(tmpSizeBytes / 1024) + 'KB';
					}
					else
					{
						tmpSizeLabel = tmpSizeBytes + 'B';
					}

					let tmpMimeType = tmpMatch[1] || 'image';
					let tmpWidgetLabel = `\u2026${tmpSizeLabel})`;

					// Replace from the start of the base64 payload to after the closing paren
					let tmpWidget = tmpDecoration.replace(
					{
						widget: new DataURIWidget(tmpWidgetLabel)
					});

					tmpDecorations.push(tmpWidget.range(tmpPayloadStart, tmpPayloadEnd + 1));
				}
			}

			return tmpDecoration.set(tmpDecorations, true);
		}

		// Create the ViewPlugin
		let tmpPlugin = tmpViewPlugin.fromClass(
			class
			{
				constructor(pView)
				{
					this.decorations = buildDecorations(pView);
				}

				update(pUpdate)
				{
					if (pUpdate.docChanged || pUpdate.viewportChanged)
					{
						this.decorations = buildDecorations(pUpdate.view);
					}
				}
			},
			{
				decorations: (pPlugin) => pPlugin.decorations
			}
		);

		return tmpPlugin;
	}

	/**
	 * Render the "Add Segment" button at the bottom of the container.
	 *
	 * @param {HTMLElement} pContainer - The container element
	 */
	_renderAddButton(pContainer)
	{
		let tmpRecord =
		{
			ViewIdentifier: this._viewCallIdentifier
		};

		let tmpHTML = this.pict.parseTemplateByHash('MarkdownEditor-AddSegment', tmpRecord);

		let tmpTempDiv = document.createElement('div');
		tmpTempDiv.innerHTML = tmpHTML;
		let tmpButtonElement = tmpTempDiv.firstElementChild;
		pContainer.appendChild(tmpButtonElement);
	}

	// -- Active Segment Management --

	/**
	 * Set a segment as the active (focused) segment.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_setActiveSegment(pSegmentIndex)
	{
		// Clear previous active
		if (this._activeSegmentIndex >= 0 && this._activeSegmentIndex !== pSegmentIndex)
		{
			let tmpPrevEl = document.getElementById(`PictMDE-Segment-${this._activeSegmentIndex}`);
			if (tmpPrevEl)
			{
				tmpPrevEl.classList.remove('pict-mde-active');
			}
		}

		this._activeSegmentIndex = pSegmentIndex;

		let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (tmpSegEl)
		{
			tmpSegEl.classList.add('pict-mde-active');
		}
	}

	/**
	 * Clear the active state from a segment (on blur).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_clearActiveSegment(pSegmentIndex)
	{
		if (this._activeSegmentIndex === pSegmentIndex)
		{
			this._activeSegmentIndex = -1;
		}

		let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (tmpSegEl)
		{
			tmpSegEl.classList.remove('pict-mde-active');
		}

		// Reset sidebar back to sticky when segment is no longer active
		this._resetSidebarPosition(pSegmentIndex);
	}

	// -- Formatting --

	/**
	 * Apply markdown formatting to the selection (or insert formatting at cursor)
	 * in a specific segment.
	 *
	 * If text is selected, wraps it.  If no selection, inserts the formatting
	 * markers and places the cursor between them.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pFormatType - One of: 'bold', 'italic', 'code', 'heading', 'link'
	 */
	applyFormatting(pSegmentIndex, pFormatType)
	{
		let tmpEditor = this._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			this.log.warn(`PICT-MarkdownEditor applyFormatting: no editor for segment ${pSegmentIndex}.`);
			return;
		}

		let tmpFormat = _FormattingMap[pFormatType];
		if (!tmpFormat)
		{
			this.log.warn(`PICT-MarkdownEditor applyFormatting: unknown format type "${pFormatType}".`);
			return;
		}

		let tmpState = tmpEditor.state;
		let tmpSelection = tmpState.selection.main;
		let tmpFrom = tmpSelection.from;
		let tmpTo = tmpSelection.to;
		let tmpHasSelection = (tmpFrom !== tmpTo);
		let tmpSelectedText = tmpHasSelection ? tmpState.sliceDoc(tmpFrom, tmpTo) : '';

		let tmpChanges;
		let tmpCursorPos;

		if (tmpFormat.wrap)
		{
			// Toggle-style: wrap selection or insert empty wrapper
			let tmpWrap = tmpFormat.wrap;
			if (tmpHasSelection)
			{
				// Check if already wrapped — if so, unwrap
				let tmpBefore = tmpState.sliceDoc(Math.max(0, tmpFrom - tmpWrap.length), tmpFrom);
				let tmpAfter = tmpState.sliceDoc(tmpTo, Math.min(tmpState.doc.length, tmpTo + tmpWrap.length));

				if (tmpBefore === tmpWrap && tmpAfter === tmpWrap)
				{
					// Unwrap
					tmpChanges = [
						{ from: tmpFrom - tmpWrap.length, to: tmpFrom, insert: '' },
						{ from: tmpTo, to: tmpTo + tmpWrap.length, insert: '' }
					];
					tmpCursorPos = tmpFrom - tmpWrap.length;
					tmpEditor.dispatch(
					{
						changes: tmpChanges,
						selection: { anchor: tmpCursorPos, head: tmpCursorPos + tmpSelectedText.length }
					});
					return;
				}

				// Wrap the selection
				let tmpInsert = tmpWrap + tmpSelectedText + tmpWrap;
				tmpChanges = { from: tmpFrom, to: tmpTo, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpWrap.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos, head: tmpCursorPos + tmpSelectedText.length }
				});
			}
			else
			{
				// No selection: insert empty wrapper and place cursor inside
				let tmpInsert = tmpWrap + tmpWrap;
				tmpChanges = { from: tmpFrom, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpWrap.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos }
				});
			}
		}
		else if (tmpFormat.prefix)
		{
			// Line-prefix style (headings)
			let tmpLine = tmpState.doc.lineAt(tmpFrom);
			let tmpLineText = tmpLine.text;

			// Toggle: if line already starts with the prefix, remove it; otherwise add
			if (tmpLineText.startsWith(tmpFormat.prefix))
			{
				tmpChanges = { from: tmpLine.from, to: tmpLine.from + tmpFormat.prefix.length, insert: '' };
			}
			else
			{
				tmpChanges = { from: tmpLine.from, insert: tmpFormat.prefix };
			}
			tmpEditor.dispatch({ changes: tmpChanges });
		}
		else if (tmpFormat.before && tmpFormat.after)
		{
			// Surround style (links)
			if (tmpHasSelection)
			{
				let tmpInsert = tmpFormat.before + tmpSelectedText + tmpFormat.after;
				tmpChanges = { from: tmpFrom, to: tmpTo, insert: tmpInsert };
				// Place cursor on the "url" part
				tmpCursorPos = tmpFrom + tmpFormat.before.length + tmpSelectedText.length + 2;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos, head: tmpCursorPos + 3 }
				});
			}
			else
			{
				let tmpInsert = tmpFormat.before + tmpFormat.after;
				tmpChanges = { from: tmpFrom, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpFormat.before.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos }
				});
			}
		}

		// Re-focus the editor after clicking a sidebar button
		tmpEditor.focus();
	}

	// -- Image Handling --

	/**
	 * Open a file picker to select an image for insertion into a segment.
	 * Called by the sidebar image button onclick handler.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	openImagePicker(pSegmentIndex)
	{
		let tmpFileInput = document.getElementById(`PictMDE-ImageInput-${pSegmentIndex}`);
		if (!tmpFileInput)
		{
			this.log.warn(`PICT-MarkdownEditor openImagePicker: file input not found for segment ${pSegmentIndex}.`);
			return;
		}

		let tmpSelf = this;

		// Wire the change handler fresh each time (in case it was already used)
		tmpFileInput.onchange = () =>
		{
			if (tmpFileInput.files && tmpFileInput.files.length > 0)
			{
				tmpSelf._processImageFile(tmpFileInput.files[0], pSegmentIndex);
			}
			// Reset the input so the same file can be re-selected
			tmpFileInput.value = '';
		};

		tmpFileInput.click();
	}

	/**
	 * Process an image File object from any input method (picker, drag, paste).
	 *
	 * If the consumer has overridden onImageUpload and it returns true, the
	 * consumer handles the upload and calls the callback with a URL.
	 * Otherwise, the image is converted to a base64 data URI inline.
	 *
	 * @param {File} pFile - The image File object
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_processImageFile(pFile, pSegmentIndex)
	{
		if (!pFile || !pFile.type || !pFile.type.startsWith('image/'))
		{
			this.log.warn(`PICT-MarkdownEditor _processImageFile: not an image file (type: ${pFile ? pFile.type : 'null'}).`);
			return;
		}

		let tmpSelf = this;
		let tmpAltText = pFile.name ? pFile.name.replace(/\.[^.]+$/, '') : 'image';

		// Check if the consumer wants to handle the upload
		let tmpCallback = (pError, pURL) =>
		{
			if (pError)
			{
				tmpSelf.log.error(`PICT-MarkdownEditor image upload error: ${pError}`);
				return;
			}
			if (pURL)
			{
				tmpSelf._insertImageMarkdown(pSegmentIndex, pURL, tmpAltText);
			}
		};

		let tmpHandled = this.onImageUpload(pFile, pSegmentIndex, tmpCallback);

		if (tmpHandled)
		{
			// Consumer is handling the upload asynchronously
			return;
		}

		// Default: convert to base64 data URI
		if (typeof (FileReader) === 'undefined')
		{
			this.log.error(`PICT-MarkdownEditor _processImageFile: FileReader not available in this environment.`);
			return;
		}

		let tmpReader = new FileReader();
		tmpReader.onload = () =>
		{
			tmpSelf._insertImageMarkdown(pSegmentIndex, tmpReader.result, tmpAltText);
		};
		tmpReader.onerror = () =>
		{
			tmpSelf.log.error(`PICT-MarkdownEditor _processImageFile: FileReader error.`);
		};
		tmpReader.readAsDataURL(pFile);
	}

	/**
	 * Insert markdown image syntax at the cursor position in a segment editor.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pURL - The image URL (data URI or remote URL)
	 * @param {string} [pAltText] - The alt text (default: 'image')
	 */
	_insertImageMarkdown(pSegmentIndex, pURL, pAltText)
	{
		let tmpEditor = this._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			this.log.warn(`PICT-MarkdownEditor _insertImageMarkdown: no editor for segment ${pSegmentIndex}.`);
			return;
		}

		let tmpAlt = pAltText || 'image';
		let tmpInsert = `![${tmpAlt}](${pURL})`;

		let tmpState = tmpEditor.state;
		let tmpCursorPos = tmpState.selection.main.head;

		tmpEditor.dispatch(
		{
			changes: { from: tmpCursorPos, insert: tmpInsert },
			selection: { anchor: tmpCursorPos + tmpInsert.length }
		});

		tmpEditor.focus();

		// Update the image preview area for this segment
		this._updateImagePreviews(pSegmentIndex);
	}

	/**
	 * Hook for consumers to handle image uploads.
	 *
	 * Override this in a subclass or consumer to upload images to a server/CDN.
	 * Return true to indicate you are handling the upload asynchronously.
	 * Call fCallback(null, url) on success, or fCallback(error) on failure.
	 * Return false/undefined to fall back to base64 data URI inline.
	 *
	 * @param {File} pFile - The image File object
	 * @param {number} pSegmentIndex - The logical segment index
	 * @param {function} fCallback - Callback: fCallback(pError, pURL)
	 * @returns {boolean} true if handling the upload, false to use base64 default
	 */
	onImageUpload(pFile, pSegmentIndex, fCallback)
	{
		// Override in subclass or consumer
		return false;
	}

	/**
	 * Scan the content of a segment for markdown image references and render
	 * preview thumbnails in the preview area below the editor.
	 *
	 * Matches the pattern ![alt](url) and creates <img> elements for each.
	 * The preview area is hidden when there are no images.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_updateImagePreviews(pSegmentIndex)
	{
		let tmpPreviewEl = document.getElementById(`PictMDE-ImagePreview-${pSegmentIndex}`);
		if (!tmpPreviewEl)
		{
			return;
		}

		let tmpEditor = this._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			tmpPreviewEl.innerHTML = '';
			tmpPreviewEl.classList.remove('pict-mde-has-images');
			return;
		}

		let tmpContent = tmpEditor.state.doc.toString();

		// Match markdown image syntax: ![alt text](url)
		let tmpImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
		let tmpMatches = [];
		let tmpMatch;
		while ((tmpMatch = tmpImageRegex.exec(tmpContent)) !== null)
		{
			tmpMatches.push(
			{
				alt: tmpMatch[1] || 'image',
				url: tmpMatch[2]
			});
		}

		if (tmpMatches.length === 0)
		{
			tmpPreviewEl.innerHTML = '';
			tmpPreviewEl.classList.remove('pict-mde-has-images');
			return;
		}

		// Build preview HTML
		let tmpHTML = '';
		for (let i = 0; i < tmpMatches.length; i++)
		{
			let tmpAlt = tmpMatches[i].alt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			let tmpURL = tmpMatches[i].url.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
			tmpHTML += `<div class="pict-mde-image-preview-item"><img src="${tmpURL}" alt="${tmpAlt}" /><span class="pict-mde-image-preview-label">${tmpAlt}</span></div>`;
		}

		tmpPreviewEl.innerHTML = tmpHTML;
		tmpPreviewEl.classList.add('pict-mde-has-images');
	}

	// -- Rich Content Preview (via pict-section-content) --

	/**
	 * Get the pict-section-content provider instance for markdown parsing.
	 * Lazily instantiated on first use.
	 *
	 * @returns {object} The PictContentProvider instance
	 */
	_getContentProvider()
	{
		if (!this._contentProvider)
		{
			this._contentProvider = new libPictContentProvider(this.fable, {}, 'Pict-Content-Provider-MDE');
		}
		return this._contentProvider;
	}

	/**
	 * Render the raw markdown content of a segment into the rich preview area
	 * using pict-section-content's parseMarkdown() provider method.
	 *
	 * The rendered HTML includes syntax-highlighted code blocks, mermaid diagram
	 * placeholders, KaTeX math placeholders, headings, lists, tables, etc.
	 *
	 * After setting innerHTML, post-render hooks call mermaid.run() and
	 * katex.render() to activate diagrams and equations (if those libraries
	 * are available on window — loaded by the consumer via CDN).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_updateRichPreviews(pSegmentIndex)
	{
		if (!this.options.EnableRichPreview)
		{
			return;
		}

		let tmpPreviewEl = document.getElementById(`PictMDE-RichPreview-${pSegmentIndex}`);
		if (!tmpPreviewEl)
		{
			return;
		}

		let tmpEditor = this._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			tmpPreviewEl.innerHTML = '';
			tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
			return;
		}

		let tmpContent = tmpEditor.state.doc.toString();

		if (!tmpContent || tmpContent.trim().length === 0)
		{
			tmpPreviewEl.innerHTML = '';
			tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
			return;
		}

		// Use pict-section-content's provider to parse the raw markdown into HTML
		let tmpProvider = this._getContentProvider();
		let tmpRenderedHTML = tmpProvider.parseMarkdown(tmpContent);

		if (!tmpRenderedHTML || tmpRenderedHTML.trim().length === 0)
		{
			tmpPreviewEl.innerHTML = '';
			tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');
			return;
		}

		// Wrap the rendered HTML in a pict-content container so that
		// pict-section-content's CSS classes take effect
		let tmpPreviewID = `PictMDE-RichPreviewBody-${pSegmentIndex}`;
		tmpPreviewEl.innerHTML = `<div class="pict-content" id="${tmpPreviewID}">${tmpRenderedHTML}</div>`;
		tmpPreviewEl.classList.add('pict-mde-has-rich-preview');

		// Bump generation counter for stale-render protection (mermaid is async)
		let tmpGeneration = (this._richPreviewGenerations[pSegmentIndex] || 0) + 1;
		this._richPreviewGenerations[pSegmentIndex] = tmpGeneration;
		let tmpSelf = this;

		// Post-render: call mermaid.run() for mermaid diagram elements
		this._postRenderMermaid(tmpPreviewID, pSegmentIndex, tmpGeneration);

		// Post-render: call katex.render() for KaTeX math elements
		this._postRenderKaTeX(tmpPreviewID);
	}

	/**
	 * Post-render hook: render Mermaid diagrams in the preview container.
	 * Uses the same approach as pict-section-content's renderMermaidDiagrams().
	 *
	 * @param {string} pContainerID - The container element ID
	 * @param {number} pSegmentIndex - The segment index (for stale-render protection)
	 * @param {number} pGeneration - The generation counter value
	 */
	_postRenderMermaid(pContainerID, pSegmentIndex, pGeneration)
	{
		if (typeof mermaid === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById(pContainerID);
		if (!tmpContainer)
		{
			return;
		}

		let tmpMermaidElements = tmpContainer.querySelectorAll('pre.mermaid');
		if (tmpMermaidElements.length < 1)
		{
			return;
		}

		let tmpSelf = this;

		try
		{
			let tmpPromise = mermaid.run({ nodes: tmpMermaidElements });
			if (tmpPromise && typeof tmpPromise.catch === 'function')
			{
				tmpPromise.catch((pError) =>
				{
					// Check stale-render: rendered view uses _renderedViewGeneration,
					// per-segment previews use _richPreviewGenerations
					let tmpCurrentGen = (pSegmentIndex === -1)
						? tmpSelf._renderedViewGeneration
						: tmpSelf._richPreviewGenerations[pSegmentIndex];
					if (tmpCurrentGen !== pGeneration)
					{
						return; // stale render — a newer update has replaced us
					}
					tmpSelf.log.warn(`PICT-MarkdownEditor mermaid render error: ${pError.message || pError}`);
				});
			}
		}
		catch (pError)
		{
			this.log.warn(`PICT-MarkdownEditor mermaid render error: ${pError.message || pError}`);
		}
	}

	/**
	 * Post-render hook: render KaTeX inline and display math in the preview container.
	 * Uses the same approach as pict-section-content's renderKaTeXEquations().
	 *
	 * @param {string} pContainerID - The container element ID
	 */
	_postRenderKaTeX(pContainerID)
	{
		if (typeof katex === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById(pContainerID);
		if (!tmpContainer)
		{
			return;
		}

		// Render inline math: <span class="pict-content-katex-inline">
		let tmpInlineElements = tmpContainer.querySelectorAll('.pict-content-katex-inline');
		for (let i = 0; i < tmpInlineElements.length; i++)
		{
			try
			{
				katex.render(tmpInlineElements[i].textContent, tmpInlineElements[i], { throwOnError: false, displayMode: false });
			}
			catch (pError)
			{
				this.log.warn(`PICT-MarkdownEditor KaTeX inline error: ${pError.message || pError}`);
			}
		}

		// Render display math: <div class="pict-content-katex-display">
		let tmpDisplayElements = tmpContainer.querySelectorAll('.pict-content-katex-display');
		for (let i = 0; i < tmpDisplayElements.length; i++)
		{
			try
			{
				katex.render(tmpDisplayElements[i].textContent, tmpDisplayElements[i], { throwOnError: false, displayMode: true });
			}
			catch (pError)
			{
				this.log.warn(`PICT-MarkdownEditor KaTeX display error: ${pError.message || pError}`);
			}
		}
	}

	/**
	 * Simple HTML escape for error messages in the rich preview.
	 *
	 * @param {string} pText - The text to escape
	 * @returns {string}
	 */
	_escapeHTMLForPreview(pText)
	{
		return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	// -- Sidebar Cursor Tracking --

	/**
	 * Update the sidebar formatting-buttons position so they float next to the
	 * cursor / selection in the active segment.
	 *
	 * When a segment is active and has a cursor, we switch the sidebar-actions
	 * from sticky positioning to absolute, offset to align with the cursor line.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_updateSidebarPosition(pSegmentIndex)
	{
		let tmpSegmentEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (!tmpSegmentEl)
		{
			return;
		}

		let tmpSidebarActions = tmpSegmentEl.querySelector('.pict-mde-sidebar-actions');
		if (!tmpSidebarActions)
		{
			return;
		}

		let tmpEditor = this._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			return;
		}

		// Get the cursor position in the editor
		let tmpCursorPos = tmpEditor.state.selection.main.head;
		let tmpCursorCoords = tmpEditor.coordsAtPos(tmpCursorPos);
		if (!tmpCursorCoords)
		{
			// If we can't get coords, revert to sticky
			this._resetSidebarPosition(pSegmentIndex);
			return;
		}

		// Calculate the offset relative to the segment element
		let tmpSegmentRect = tmpSegmentEl.getBoundingClientRect();
		let tmpOffsetTop = tmpCursorCoords.top - tmpSegmentRect.top;

		// Clamp so the sidebar buttons don't go above the segment or below it
		let tmpSidebarHeight = tmpSidebarActions.offsetHeight || 0;
		let tmpSegmentHeight = tmpSegmentEl.offsetHeight || 0;
		let tmpMaxOffset = Math.max(0, tmpSegmentHeight - tmpSidebarHeight);
		tmpOffsetTop = Math.max(0, Math.min(tmpOffsetTop, tmpMaxOffset));

		// Apply the cursor-relative positioning
		tmpSidebarActions.classList.add('pict-mde-sidebar-at-cursor');
		tmpSidebarActions.style.setProperty('--pict-mde-sidebar-top', `${tmpOffsetTop}px`);
	}

	/**
	 * Reset the sidebar back to default sticky positioning (no cursor tracking).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_resetSidebarPosition(pSegmentIndex)
	{
		let tmpSegmentEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (!tmpSegmentEl)
		{
			return;
		}

		let tmpSidebarActions = tmpSegmentEl.querySelector('.pict-mde-sidebar-actions');
		if (!tmpSidebarActions)
		{
			return;
		}

		tmpSidebarActions.classList.remove('pict-mde-sidebar-at-cursor');
		tmpSidebarActions.style.removeProperty('--pict-mde-sidebar-top');
	}

	// -- Line Numbers --

	/**
	 * Toggle line numbers on or off for all segments.
	 *
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */
	toggleLineNumbers(pVisible)
	{
		if (typeof (pVisible) === 'boolean')
		{
			this._lineNumbersVisible = pVisible;
		}
		else
		{
			this._lineNumbersVisible = !this._lineNumbersVisible;
		}

		let tmpContainer = this._getContainerElement();
		if (tmpContainer)
		{
			if (this._lineNumbersVisible)
			{
				tmpContainer.classList.add('pict-mde-linenums-on');
			}
			else
			{
				tmpContainer.classList.remove('pict-mde-linenums-on');
			}
		}
	}

	// -- Preview Toggle --

	/**
	 * Toggle rich previews on or off for all segments globally.
	 *
	 * When hidden globally, individual segment overrides are preserved
	 * so that restoring global visibility returns to the per-segment state.
	 *
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */
	togglePreview(pVisible)
	{
		if (typeof (pVisible) === 'boolean')
		{
			this._previewsVisible = pVisible;
		}
		else
		{
			this._previewsVisible = !this._previewsVisible;
		}

		let tmpContainer = this._getContainerElement();
		if (tmpContainer)
		{
			if (this._previewsVisible)
			{
				tmpContainer.classList.remove('pict-mde-previews-hidden');
			}
			else
			{
				tmpContainer.classList.add('pict-mde-previews-hidden');
			}
		}
	}

	/**
	 * Toggle the rich preview for a single segment.
	 *
	 * This adds/removes the .pict-mde-preview-hidden class on the
	 * individual segment element, independent of the global toggle.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */
	toggleSegmentPreview(pSegmentIndex, pVisible)
	{
		// Convert internal index to logical index for persistent tracking
		let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
		if (tmpLogicalIndex < 0)
		{
			return;
		}

		let tmpCurrentlyHidden = !!this._hiddenPreviewSegments[tmpLogicalIndex];

		if (typeof (pVisible) === 'boolean')
		{
			tmpCurrentlyHidden = !pVisible;
		}
		else
		{
			tmpCurrentlyHidden = !tmpCurrentlyHidden;
		}

		if (tmpCurrentlyHidden)
		{
			this._hiddenPreviewSegments[tmpLogicalIndex] = true;
		}
		else
		{
			delete this._hiddenPreviewSegments[tmpLogicalIndex];
		}

		let tmpSegmentEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (tmpSegmentEl)
		{
			if (tmpCurrentlyHidden)
			{
				tmpSegmentEl.classList.add('pict-mde-preview-hidden');
			}
			else
			{
				tmpSegmentEl.classList.remove('pict-mde-preview-hidden');
			}
		}
	}

	/**
	 * Swap the hidden preview state of two logical indices.
	 * Used when moveSegmentUp/Down swaps adjacent segments.
	 *
	 * @param {number} pIndexA - First logical index
	 * @param {number} pIndexB - Second logical index
	 */
	_swapHiddenPreviewState(pIndexA, pIndexB)
	{
		let tmpAHidden = !!this._hiddenPreviewSegments[pIndexA];
		let tmpBHidden = !!this._hiddenPreviewSegments[pIndexB];

		if (tmpBHidden) { this._hiddenPreviewSegments[pIndexA] = true; }
		else { delete this._hiddenPreviewSegments[pIndexA]; }

		if (tmpAHidden) { this._hiddenPreviewSegments[pIndexB] = true; }
		else { delete this._hiddenPreviewSegments[pIndexB]; }
	}

	/**
	 * Reorder the hidden preview state after a splice-based move
	 * (remove from pFrom, insert at pTo).
	 *
	 * @param {number} pFrom - The logical index the segment was removed from
	 * @param {number} pTo - The logical index the segment was inserted at
	 */
	_reorderHiddenPreviewState(pFrom, pTo)
	{
		if (pFrom === pTo)
		{
			return;
		}

		// Build an ordered array of hidden-state booleans
		let tmpKeys = Object.keys(this._hiddenPreviewSegments).map((k) => parseInt(k, 10));
		if (tmpKeys.length === 0)
		{
			return;
		}

		let tmpMaxIndex = Math.max(...tmpKeys, pFrom, pTo);
		let tmpStates = [];
		for (let i = 0; i <= tmpMaxIndex; i++)
		{
			tmpStates.push(!!this._hiddenPreviewSegments[i]);
		}

		// Perform the same splice on the states array
		let tmpMovedState = tmpStates.splice(pFrom, 1)[0];
		tmpStates.splice(pTo, 0, tmpMovedState);

		// Rebuild the hidden map
		this._hiddenPreviewSegments = {};
		for (let i = 0; i < tmpStates.length; i++)
		{
			if (tmpStates[i])
			{
				this._hiddenPreviewSegments[i] = true;
			}
		}
	}

	// -- Rendered View (full document preview) --

	/**
	 * Toggle between the editing view (CodeMirror segments) and a fully rendered
	 * view of the combined markdown output using pict-section-content.
	 *
	 * @param {boolean} [pRendered] - If provided, set to this value; otherwise toggle
	 */
	toggleRenderedView(pRendered)
	{
		if (typeof (pRendered) === 'boolean')
		{
			this._renderedViewActive = pRendered;
		}
		else
		{
			this._renderedViewActive = !this._renderedViewActive;
		}

		if (this._renderedViewActive)
		{
			this._renderRenderedView();
		}
		else
		{
			this._restoreEditingView();
		}
	}

	/**
	 * Switch to the rendered view: marshal all editors, combine all segment
	 * content, render to HTML via pict-section-content, and replace the
	 * container contents with the rendered output.
	 */
	_renderRenderedView()
	{
		let tmpContainer = this._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}

		// Marshal current editor content back to data before switching
		this._marshalAllEditorsToData();

		// Combine all segments into a single markdown document
		let tmpSegments = this._getSegmentsFromData();
		let tmpCombinedContent = '';
		if (tmpSegments && tmpSegments.length > 0)
		{
			let tmpParts = [];
			for (let i = 0; i < tmpSegments.length; i++)
			{
				tmpParts.push(tmpSegments[i].Content || '');
			}
			tmpCombinedContent = tmpParts.join('\n\n');
		}

		// Destroy existing CodeMirror editors
		for (let tmpIdx in this._segmentEditors)
		{
			if (this._segmentEditors[tmpIdx])
			{
				this._segmentEditors[tmpIdx].destroy();
			}
		}
		this._segmentEditors = {};

		// Render the combined markdown via pict-section-content
		let tmpProvider = this._getContentProvider();
		let tmpRenderedHTML = tmpProvider.parseMarkdown(tmpCombinedContent);

		// Build the rendered view container
		let tmpRenderedViewID = 'PictMDE-RenderedView';
		tmpContainer.innerHTML = `<div class="pict-mde-rendered-view" id="${tmpRenderedViewID}"><div class="pict-content">${tmpRenderedHTML || ''}</div></div>`;
		tmpContainer.classList.add('pict-mde-rendered-mode');

		// Bump generation for stale-render protection
		this._renderedViewGeneration++;
		let tmpGeneration = this._renderedViewGeneration;

		// Post-render hooks for mermaid diagrams and KaTeX equations
		let tmpContentContainer = tmpContainer.querySelector(`#${tmpRenderedViewID} .pict-content`);
		if (tmpContentContainer)
		{
			let tmpContentID = 'PictMDE-RenderedViewContent';
			tmpContentContainer.id = tmpContentID;

			this._postRenderMermaid(tmpContentID, -1, tmpGeneration);
			this._postRenderKaTeX(tmpContentID);
		}
	}

	/**
	 * Switch back from rendered view to the editing view: rebuild the
	 * full editor UI from the data.
	 */
	_restoreEditingView()
	{
		let tmpContainer = this._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}

		tmpContainer.classList.remove('pict-mde-rendered-mode');
		this._buildEditorUI();
	}

	// -- Segment Data Management --

	/**
	 * Get the segments array from the configured data address.
	 *
	 * @returns {Array|null}
	 */
	_getSegmentsFromData()
	{
		if (!this.options.ContentDataAddress)
		{
			return null;
		}

		const tmpAddressSpace =
		{
			Fable: this.fable,
			Pict: this.fable,
			AppData: this.AppData,
			Bundle: this.Bundle,
			Options: this.options
		};

		let tmpData = this.fable.manifest.getValueByHash(tmpAddressSpace, this.options.ContentDataAddress);

		if (Array.isArray(tmpData))
		{
			return tmpData;
		}

		return null;
	}

	/**
	 * Write the segments array to the configured data address.
	 *
	 * @param {Array} pSegments - The segments array
	 */
	_setSegmentsToData(pSegments)
	{
		if (!this.options.ContentDataAddress)
		{
			return;
		}

		const tmpAddressSpace =
		{
			Fable: this.fable,
			Pict: this.fable,
			AppData: this.AppData,
			Bundle: this.Bundle,
			Options: this.options
		};

		this.fable.manifest.setValueByHash(tmpAddressSpace, this.options.ContentDataAddress, pSegments);
	}

	/**
	 * Called when a segment's content changes in the CodeMirror editor.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pContent - The new content
	 */
	_onSegmentContentChange(pSegmentIndex, pContent)
	{
		let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
		if (tmpLogicalIndex < 0)
		{
			return;
		}

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			return;
		}

		if (tmpLogicalIndex < tmpSegments.length)
		{
			tmpSegments[tmpLogicalIndex].Content = pContent;
		}

		this.onContentChange(tmpLogicalIndex, pContent);

		// Debounce image preview updates (500ms) to avoid thrashing on every keystroke
		let tmpSelf = this;
		if (this._imagePreviewTimers[pSegmentIndex])
		{
			clearTimeout(this._imagePreviewTimers[pSegmentIndex]);
		}
		this._imagePreviewTimers[pSegmentIndex] = setTimeout(() =>
		{
			tmpSelf._updateImagePreviews(pSegmentIndex);
			delete tmpSelf._imagePreviewTimers[pSegmentIndex];
		}, 500);

		// Debounce rich content preview updates (mermaid / KaTeX) at 500ms
		if (this._richPreviewTimers[pSegmentIndex])
		{
			clearTimeout(this._richPreviewTimers[pSegmentIndex]);
		}
		this._richPreviewTimers[pSegmentIndex] = setTimeout(() =>
		{
			tmpSelf._updateRichPreviews(pSegmentIndex);
			delete tmpSelf._richPreviewTimers[pSegmentIndex];
		}, 500);
	}

	/**
	 * Hook for subclasses to respond to content changes.
	 *
	 * @param {number} pSegmentIndex - The logical segment index
	 * @param {string} pContent - The new content
	 */
	onContentChange(pSegmentIndex, pContent)
	{
		// Override in subclass
	}

	/**
	 * Get the logical (ordered) index for an internal segment index.
	 *
	 * @param {number} pInternalIndex - The internal segment index
	 * @returns {number} The logical index, or -1 if not found
	 */
	_getLogicalIndex(pInternalIndex)
	{
		let tmpContainer = this._getContainerElement();
		if (!tmpContainer)
		{
			return -1;
		}

		let tmpSegmentElements = tmpContainer.querySelectorAll('.pict-mde-segment');
		for (let i = 0; i < tmpSegmentElements.length; i++)
		{
			let tmpIndex = parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'), 10);
			if (tmpIndex === pInternalIndex)
			{
				return i;
			}
		}

		return -1;
	}

	/**
	 * Get the ordered list of internal segment indices from the DOM.
	 *
	 * @returns {Array<number>}
	 */
	_getOrderedSegmentIndices()
	{
		let tmpContainer = this._getContainerElement();
		if (!tmpContainer)
		{
			return [];
		}

		let tmpSegmentElements = tmpContainer.querySelectorAll('.pict-mde-segment');
		let tmpIndices = [];
		for (let i = 0; i < tmpSegmentElements.length; i++)
		{
			tmpIndices.push(parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'), 10));
		}
		return tmpIndices;
	}

	// -- Public API --

	/**
	 * Add a new empty segment at the end.
	 *
	 * @param {string} [pContent] - Optional initial content for the new segment
	 */
	addSegment(pContent)
	{
		let tmpContent = (typeof (pContent) === 'string') ? pContent : '';

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			tmpSegments = [];
		}
		tmpSegments.push({ Content: tmpContent });
		this._setSegmentsToData(tmpSegments);

		this._buildEditorUI();
	}

	/**
	 * Remove a segment by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	removeSegment(pSegmentIndex)
	{
		let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
		if (tmpLogicalIndex < 0)
		{
			this.log.warn(`PICT-MarkdownEditor removeSegment: segment index ${pSegmentIndex} not found.`);
			return;
		}

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments || tmpSegments.length <= 1)
		{
			this.log.warn(`PICT-MarkdownEditor removeSegment: cannot remove the last segment.`);
			return;
		}

		if (this._segmentEditors[pSegmentIndex])
		{
			this._segmentEditors[pSegmentIndex].destroy();
			delete this._segmentEditors[pSegmentIndex];
		}

		tmpSegments.splice(tmpLogicalIndex, 1);
		this._setSegmentsToData(tmpSegments);

		// Update per-segment hidden preview state after removal
		let tmpNewHidden = {};
		for (let tmpKey in this._hiddenPreviewSegments)
		{
			let tmpIdx = parseInt(tmpKey, 10);
			if (tmpIdx < tmpLogicalIndex)
			{
				tmpNewHidden[tmpIdx] = true;
			}
			else if (tmpIdx > tmpLogicalIndex)
			{
				tmpNewHidden[tmpIdx - 1] = true;
			}
			// tmpIdx === tmpLogicalIndex is the removed segment; skip it
		}
		this._hiddenPreviewSegments = tmpNewHidden;

		this._buildEditorUI();
	}

	/**
	 * Move a segment up by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	moveSegmentUp(pSegmentIndex)
	{
		let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
		if (tmpLogicalIndex <= 0)
		{
			return;
		}

		this._marshalAllEditorsToData();

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			return;
		}

		let tmpTemp = tmpSegments[tmpLogicalIndex];
		tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex - 1];
		tmpSegments[tmpLogicalIndex - 1] = tmpTemp;

		// Swap per-segment hidden preview state to follow the moved segment
		this._swapHiddenPreviewState(tmpLogicalIndex, tmpLogicalIndex - 1);

		this._buildEditorUI();
	}

	/**
	 * Move a segment down by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	moveSegmentDown(pSegmentIndex)
	{
		let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments || tmpLogicalIndex < 0 || tmpLogicalIndex >= tmpSegments.length - 1)
		{
			return;
		}

		this._marshalAllEditorsToData();

		let tmpTemp = tmpSegments[tmpLogicalIndex];
		tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex + 1];
		tmpSegments[tmpLogicalIndex + 1] = tmpTemp;

		// Swap per-segment hidden preview state to follow the moved segment
		this._swapHiddenPreviewState(tmpLogicalIndex, tmpLogicalIndex + 1);

		this._buildEditorUI();
	}

	/**
	 * Get the content of a specific segment by logical index.
	 *
	 * @param {number} pLogicalIndex - The logical (0-based) index
	 * @returns {string} The segment content
	 */
	getSegmentContent(pLogicalIndex)
	{
		let tmpOrderedIndices = this._getOrderedSegmentIndices();
		if (pLogicalIndex < 0 || pLogicalIndex >= tmpOrderedIndices.length)
		{
			return '';
		}

		let tmpInternalIndex = tmpOrderedIndices[pLogicalIndex];
		let tmpEditor = this._segmentEditors[tmpInternalIndex];
		if (tmpEditor)
		{
			return tmpEditor.state.doc.toString();
		}

		return '';
	}

	/**
	 * Set the content of a specific segment by logical index.
	 *
	 * @param {number} pLogicalIndex - The logical (0-based) index
	 * @param {string} pContent - The content to set
	 */
	setSegmentContent(pLogicalIndex, pContent)
	{
		let tmpOrderedIndices = this._getOrderedSegmentIndices();
		if (pLogicalIndex < 0 || pLogicalIndex >= tmpOrderedIndices.length)
		{
			this.log.warn(`PICT-MarkdownEditor setSegmentContent: index ${pLogicalIndex} out of range.`);
			return;
		}

		let tmpInternalIndex = tmpOrderedIndices[pLogicalIndex];
		let tmpEditor = this._segmentEditors[tmpInternalIndex];
		if (tmpEditor)
		{
			tmpEditor.dispatch(
			{
				changes:
				{
					from: 0,
					to: tmpEditor.state.doc.length,
					insert: pContent
				}
			});
		}
	}

	/**
	 * Get the total number of segments.
	 *
	 * @returns {number}
	 */
	getSegmentCount()
	{
		return this._getOrderedSegmentIndices().length;
	}

	/**
	 * Get all content from all segments joined together.
	 *
	 * @param {string} [pSeparator] - The separator between segments (default: "\n\n")
	 * @returns {string}
	 */
	getAllContent(pSeparator)
	{
		let tmpSeparator = (typeof (pSeparator) === 'string') ? pSeparator : '\n\n';
		let tmpOrderedIndices = this._getOrderedSegmentIndices();
		let tmpParts = [];

		for (let i = 0; i < tmpOrderedIndices.length; i++)
		{
			let tmpEditor = this._segmentEditors[tmpOrderedIndices[i]];
			if (tmpEditor)
			{
				tmpParts.push(tmpEditor.state.doc.toString());
			}
		}

		return tmpParts.join(tmpSeparator);
	}

	/**
	 * Marshal all editor contents back into the data address.
	 */
	_marshalAllEditorsToData()
	{
		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			return;
		}

		let tmpOrderedIndices = this._getOrderedSegmentIndices();
		for (let i = 0; i < tmpOrderedIndices.length; i++)
		{
			let tmpEditor = this._segmentEditors[tmpOrderedIndices[i]];
			if (tmpEditor && i < tmpSegments.length)
			{
				tmpSegments[i].Content = tmpEditor.state.doc.toString();
			}
		}
	}

	/**
	 * Set the read-only state of all editors.
	 *
	 * @param {boolean} pReadOnly - Whether editors should be read-only
	 */
	setReadOnly(pReadOnly)
	{
		this.options.ReadOnly = pReadOnly;
		if (this.initialRenderComplete)
		{
			this._marshalAllEditorsToData();
			this._buildEditorUI();
		}
	}

	/**
	 * Marshal content from the data address into the view.
	 */
	marshalToView()
	{
		super.marshalToView();
		if (this.initialRenderComplete && this.options.ContentDataAddress)
		{
			this._buildEditorUI();
		}
	}

	/**
	 * Marshal the current editor content back to the data address.
	 */
	marshalFromView()
	{
		super.marshalFromView();
		this._marshalAllEditorsToData();
	}

	/**
	 * Destroy all editors and clean up.
	 */
	destroy()
	{
		for (let tmpIndex in this._segmentEditors)
		{
			if (this._segmentEditors[tmpIndex])
			{
				this._segmentEditors[tmpIndex].destroy();
			}
		}
		this._segmentEditors = {};

		// Clear rich preview debounce timers
		for (let tmpIndex in this._richPreviewTimers)
		{
			clearTimeout(this._richPreviewTimers[tmpIndex]);
		}
		this._richPreviewTimers = {};
		this._richPreviewGenerations = {};
	}
}

module.exports = PictSectionMarkdownEditor;

module.exports.default_configuration = _DefaultConfiguration;
