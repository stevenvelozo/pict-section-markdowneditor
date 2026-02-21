const libPictViewClass = require('pict-view');
const _DefaultConfiguration = require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');

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
		// Walk the pict.views to find our hash
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
		// Walk the pict.views to find our identifier
		let tmpViews = this.pict.views;
		for (let tmpViewHash in tmpViews)
		{
			if (tmpViews[tmpViewHash] === this)
			{
				return `_Pict.views.${tmpViewHash}`;
			}
		}
		// Fallback: use the service hash
		return `_Pict.servicesMap.PictView['${this.Hash}']`;
	}

	/**
	 * Build the full editor UI: render existing segments from data and the add-segment button.
	 */
	_buildEditorUI()
	{
		// Get the container element rendered by the template
		let tmpContainerID = `PictMDE-${this.Hash}`;
		let tmpContainerElements = this.services.ContentAssignment.getElement('#' + tmpContainerID);
		let tmpContainer = null;
		if (tmpContainerElements && tmpContainerElements.length > 0)
		{
			tmpContainer = tmpContainerElements[0];
		}
		if (!tmpContainer)
		{
			// Fallback: use the target element directly
			tmpContainer = this.targetElement;
		}

		// Clear any existing content
		tmpContainer.innerHTML = '';

		// Load existing segments from data address, or start with one empty segment
		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments || tmpSegments.length === 0)
		{
			tmpSegments = [{ Content: '' }];
			this._setSegmentsToData(tmpSegments);
		}

		// Render each segment
		this._segmentCounter = 0;
		this._segmentEditors = {};

		for (let i = 0; i < tmpSegments.length; i++)
		{
			this._renderSegment(tmpContainer, i, tmpSegments[i].Content || '');
		}

		// Render the add-segment button
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

		// Parse the segment template
		let tmpRecord =
		{
			SegmentIndex: tmpSegmentIndex,
			SegmentDisplayIndex: pIndex + 1,
			ViewIdentifier: this._viewCallIdentifier
		};

		let tmpHTML = this.pict.parseTemplateByHash('MarkdownEditor-Segment', tmpRecord);

		// Create a temporary element to parse the HTML
		let tmpTempDiv = document.createElement('div');
		tmpTempDiv.innerHTML = tmpHTML;
		let tmpSegmentElement = tmpTempDiv.firstElementChild;
		pContainer.appendChild(tmpSegmentElement);

		// Create the CodeMirror editor in the segment editor container
		let tmpEditorContainer = document.getElementById(`PictMDE-SegmentEditor-${tmpSegmentIndex}`);
		if (tmpEditorContainer)
		{
			this._createEditorInContainer(tmpEditorContainer, tmpSegmentIndex, pContent);
		}
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

		// Build the extensions array
		let tmpExtensions = [];

		// Add consumer-provided extensions (e.g. basicSetup, markdown())
		if (tmpCM.extensions && Array.isArray(tmpCM.extensions))
		{
			tmpExtensions = tmpExtensions.concat(tmpCM.extensions);
		}

		// Add our update listener
		let tmpSelf = this;
		tmpExtensions.push(
			tmpCM.EditorView.updateListener.of((pUpdate) =>
			{
				if (pUpdate.docChanged)
				{
					tmpSelf._onSegmentContentChange(pSegmentIndex, pUpdate.state.doc.toString());
				}
			})
		);

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
		// Find the logical index for this segment index
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
			// No need to re-set; the array is a reference
		}

		// Fire the custom change hook
		this.onContentChange(tmpLogicalIndex, pContent);
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
		// Walk the DOM to find the order of segments
		let tmpContainerID = `PictMDE-${this.Hash}`;
		let tmpContainer = document.getElementById(tmpContainerID);
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
		let tmpContainerID = `PictMDE-${this.Hash}`;
		let tmpContainer = document.getElementById(tmpContainerID);
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

		// Update data
		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			tmpSegments = [];
		}
		tmpSegments.push({ Content: tmpContent });
		this._setSegmentsToData(tmpSegments);

		// Re-render the full editor UI
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

		// Destroy the editor
		if (this._segmentEditors[pSegmentIndex])
		{
			this._segmentEditors[pSegmentIndex].destroy();
			delete this._segmentEditors[pSegmentIndex];
		}

		tmpSegments.splice(tmpLogicalIndex, 1);
		this._setSegmentsToData(tmpSegments);

		// Re-render
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

		// Marshal current editor content to data before moving
		this._marshalAllEditorsToData();

		let tmpSegments = this._getSegmentsFromData();
		if (!tmpSegments)
		{
			return;
		}

		// Swap
		let tmpTemp = tmpSegments[tmpLogicalIndex];
		tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex - 1];
		tmpSegments[tmpLogicalIndex - 1] = tmpTemp;

		// Re-render
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

		// Marshal current editor content to data before moving
		this._marshalAllEditorsToData();

		// Swap
		let tmpTemp = tmpSegments[tmpLogicalIndex];
		tmpSegments[tmpLogicalIndex] = tmpSegments[tmpLogicalIndex + 1];
		tmpSegments[tmpLogicalIndex + 1] = tmpTemp;

		// Re-render
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
			let tmpCM = this._codeMirrorModules;
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
		// Re-render to apply the readOnly compartment
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
	}
}

module.exports = PictSectionMarkdownEditor;

module.exports.default_configuration = _DefaultConfiguration;
