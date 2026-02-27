const libPictViewClass = require('pict-view');
const libPictSectionContent = require('pict-section-content');
const _DefaultConfiguration = require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');

// Helper modules
const libFormatting = require('./Pict-MDE-Formatting.js');
const libImageHandling = require('./Pict-MDE-ImageHandling.js');
const libDragAndReorder = require('./Pict-MDE-DragAndReorder.js');
const libRichPreview = require('./Pict-MDE-RichPreview.js');
const libCodeMirror = require('./Pict-MDE-CodeMirror.js');

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

		// Whether controls (line numbers + right sidebar) are currently visible
		this._controlsVisible = true;

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

		// Attach helper modules
		libFormatting.attach(this);
		libImageHandling.attach(this);
		libDragAndReorder.attach(this);
		libRichPreview.attach(this);
		libCodeMirror.attach(this);
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
		if (!this.initialRenderComplete)
		{
			this.onAfterInitialRender();
			this.initialRenderComplete = true;
		}

		// Inject CSS from all registered views (after onAfterInitialRender so
		// that pict-section-content's CSS is registered before injection)
		this.pict.CSSMap.injectCSS();

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
		if (this._controlsVisible)
		{
			tmpContainer.classList.add('pict-mde-controls-on');
		}
		else
		{
			tmpContainer.classList.add('pict-mde-controls-hidden');
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

		// Build quadrant buttons from configuration arrays
		this._buildQuadrantButtons(tmpSegmentElement, tmpSegmentIndex);

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
	 * Build buttons in all four quadrants (TL, BL, TR, BR) from the
	 * configuration arrays.  Each button config has:
	 *   HTML   — innerHTML
	 *   Action — "methodName" or "methodName:arg"
	 *   Class  — additional CSS class(es)
	 *   Title  — tooltip text
	 *
	 * Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
	 * Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.
	 *
	 * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	_buildQuadrantButtons(pSegmentElement, pSegmentIndex)
	{
		let tmpQuadrants =
		[
			{ key: 'ButtonsTL', selector: '.pict-mde-quadrant-tl', baseClass: 'pict-mde-left-btn' },
			{ key: 'ButtonsBL', selector: '.pict-mde-quadrant-bl', baseClass: 'pict-mde-left-btn' },
			{ key: 'ButtonsTR', selector: '.pict-mde-quadrant-tr', baseClass: 'pict-mde-sidebar-btn' },
			{ key: 'ButtonsBR', selector: '.pict-mde-quadrant-br', baseClass: 'pict-mde-sidebar-btn' }
		];

		let tmpSelf = this;

		for (let q = 0; q < tmpQuadrants.length; q++)
		{
			let tmpQuadrant = tmpQuadrants[q];
			let tmpContainer = pSegmentElement.querySelector(tmpQuadrant.selector);
			if (!tmpContainer)
			{
				continue;
			}

			let tmpButtons = this.options[tmpQuadrant.key];
			if (!Array.isArray(tmpButtons))
			{
				continue;
			}

			for (let b = 0; b < tmpButtons.length; b++)
			{
				let tmpBtnConfig = tmpButtons[b];

				let tmpButton = document.createElement('button');
				tmpButton.type = 'button';
				tmpButton.className = tmpQuadrant.baseClass;
				if (tmpBtnConfig.Class)
				{
					tmpButton.className += ' ' + tmpBtnConfig.Class;
				}
				tmpButton.innerHTML = tmpBtnConfig.HTML || '';
				tmpButton.title = tmpBtnConfig.Title || '';

				// Parse the action string: "methodName" or "methodName:arg"
				let tmpAction = tmpBtnConfig.Action || '';
				let tmpMethod = tmpAction;
				let tmpArg = null;
				let tmpColonIndex = tmpAction.indexOf(':');
				if (tmpColonIndex >= 0)
				{
					tmpMethod = tmpAction.substring(0, tmpColonIndex);
					tmpArg = tmpAction.substring(tmpColonIndex + 1);
				}

				// Build the click handler
				(function (pMethod, pArg, pSegIdx)
				{
					tmpButton.addEventListener('click', () =>
					{
						if (typeof (tmpSelf[pMethod]) === 'function')
						{
							if (pArg !== null)
							{
								tmpSelf[pMethod](pSegIdx, pArg);
							}
							else
							{
								tmpSelf[pMethod](pSegIdx);
							}
						}
						else
						{
							tmpSelf.log.warn(`PICT-MarkdownEditor _buildQuadrantButtons: method "${pMethod}" not found.`);
						}
					});
				})(tmpMethod, tmpArg, pSegmentIndex);

				tmpContainer.appendChild(tmpButton);
			}
		}
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

	// -- Controls Toggle (line numbers + right sidebar) --

	/**
	 * Toggle controls (line number gutters and right sidebar formatting
	 * buttons) on or off for all segments.
	 *
	 * When controls are hidden the right-side quadrants (TR, BR) appear
	 * faintly on hover but are otherwise invisible, and CodeMirror line
	 * number gutters are hidden.
	 *
	 * This method is called by the quadrant button system with the segment
	 * index as the first argument — it ignores that argument and uses only
	 * the optional boolean.
	 *
	 * @param {number|boolean} [pSegmentIndexOrVisible] - Segment index (ignored) or boolean
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */
	toggleControls(pSegmentIndexOrVisible, pVisible)
	{
		// When called from a quadrant button, first arg is segment index (number).
		// When called programmatically, first arg may be a boolean.
		let tmpVisible = pVisible;
		if (typeof (pSegmentIndexOrVisible) === 'boolean')
		{
			tmpVisible = pSegmentIndexOrVisible;
		}

		if (typeof (tmpVisible) === 'boolean')
		{
			this._controlsVisible = tmpVisible;
		}
		else
		{
			this._controlsVisible = !this._controlsVisible;
		}

		let tmpContainer = this._getContainerElement();
		if (tmpContainer)
		{
			if (this._controlsVisible)
			{
				tmpContainer.classList.add('pict-mde-controls-on');
				tmpContainer.classList.remove('pict-mde-controls-hidden');
			}
			else
			{
				tmpContainer.classList.remove('pict-mde-controls-on');
				tmpContainer.classList.add('pict-mde-controls-hidden');
			}
		}
	}

	/**
	 * Toggle line numbers on or off for all segments.
	 * Backward-compatible alias for toggleControls().
	 *
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */
	toggleLineNumbers(pVisible)
	{
		this.toggleControls(pVisible);
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
				// Render preview content when making it visible
				this._updateRichPreviews(pSegmentIndex);
				this._updateImagePreviews(pSegmentIndex);
			}
		}
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
