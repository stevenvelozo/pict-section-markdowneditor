/**
 * Pict-MDE-RichPreview: Helper module for PictSectionMarkdownEditor
 *
 * Handles rich content preview rendering via pict-section-content:
 * markdown-to-HTML parsing, mermaid diagram rendering, KaTeX math
 * rendering, and the full rendered-view toggle.
 */

const libPictSectionContent = require('pict-section-content');
const libPictContentProvider = libPictSectionContent.PictContentProvider;

/**
 * Attach rich preview methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */
module.exports.attach = function attach(pView)
{
	/**
	 * Get the pict-section-content provider instance for markdown parsing.
	 * Lazily instantiated on first use.
	 *
	 * @returns {object} The PictContentProvider instance
	 */
	pView._getContentProvider = function _getContentProvider()
	{
		if (!pView._contentProvider)
		{
			pView._contentProvider = new libPictContentProvider(pView.fable, {}, 'Pict-Content-Provider-MDE');
		}
		return pView._contentProvider;
	};

	/**
	 * Render the raw markdown content of a segment into the rich preview area
	 * using pict-section-content's parseMarkdown() provider method.
	 *
	 * The rendered HTML includes syntax-highlighted code blocks, mermaid diagram
	 * placeholders, KaTeX math placeholders, headings, lists, tables, etc.
	 *
	 * After setting innerHTML, post-render hooks call mermaid.run() and
	 * katex.render() to activate diagrams and equations (if those libraries
	 * are available on window -- loaded by the consumer via CDN).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._updateRichPreviews = function _updateRichPreviews(pSegmentIndex)
	{
		if (!pView.options.EnableRichPreview)
		{
			return;
		}

		let tmpPreviewEl = document.getElementById(`PictMDE-RichPreview-${pSegmentIndex}`);
		if (!tmpPreviewEl)
		{
			return;
		}

		let tmpEditor = pView._segmentEditors[pSegmentIndex];
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
		let tmpProvider = pView._getContentProvider();
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
		let tmpGeneration = (pView._richPreviewGenerations[pSegmentIndex] || 0) + 1;
		pView._richPreviewGenerations[pSegmentIndex] = tmpGeneration;

		// Post-render: call mermaid.run() for mermaid diagram elements
		pView._postRenderMermaid(tmpPreviewID, pSegmentIndex, tmpGeneration);

		// Post-render: call katex.render() for KaTeX math elements
		pView._postRenderKaTeX(tmpPreviewID);
	};

	/**
	 * Post-render hook: render Mermaid diagrams in the preview container.
	 * Uses the same approach as pict-section-content's renderMermaidDiagrams().
	 *
	 * @param {string} pContainerID - The container element ID
	 * @param {number} pSegmentIndex - The segment index (for stale-render protection)
	 * @param {number} pGeneration - The generation counter value
	 */
	pView._postRenderMermaid = function _postRenderMermaid(pContainerID, pSegmentIndex, pGeneration)
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
						? pView._renderedViewGeneration
						: pView._richPreviewGenerations[pSegmentIndex];
					if (tmpCurrentGen !== pGeneration)
					{
						return; // stale render -- a newer update has replaced us
					}
					pView.log.warn(`PICT-MarkdownEditor mermaid render error: ${pError.message || pError}`);
				});
			}
		}
		catch (pError)
		{
			pView.log.warn(`PICT-MarkdownEditor mermaid render error: ${pError.message || pError}`);
		}
	};

	/**
	 * Post-render hook: render KaTeX inline and display math in the preview container.
	 * Uses the same approach as pict-section-content's renderKaTeXEquations().
	 *
	 * @param {string} pContainerID - The container element ID
	 */
	pView._postRenderKaTeX = function _postRenderKaTeX(pContainerID)
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
				pView.log.warn(`PICT-MarkdownEditor KaTeX inline error: ${pError.message || pError}`);
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
				pView.log.warn(`PICT-MarkdownEditor KaTeX display error: ${pError.message || pError}`);
			}
		}
	};

	/**
	 * Simple HTML escape for error messages in the rich preview.
	 *
	 * @param {string} pText - The text to escape
	 * @returns {string}
	 */
	pView._escapeHTMLForPreview = function _escapeHTMLForPreview(pText)
	{
		return pText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	// -- Rendered View (full document preview) --

	/**
	 * Toggle between the editing view (CodeMirror segments) and a fully rendered
	 * view of the combined markdown output using pict-section-content.
	 *
	 * @param {boolean} [pRendered] - If provided, set to this value; otherwise toggle
	 */
	pView.toggleRenderedView = function toggleRenderedView(pRendered)
	{
		if (typeof (pRendered) === 'boolean')
		{
			pView._renderedViewActive = pRendered;
		}
		else
		{
			pView._renderedViewActive = !pView._renderedViewActive;
		}

		if (pView._renderedViewActive)
		{
			pView._renderRenderedView();
		}
		else
		{
			pView._restoreEditingView();
		}
	};

	/**
	 * Switch to the rendered view: marshal all editors, combine all segment
	 * content, render to HTML via pict-section-content, and replace the
	 * container contents with the rendered output.
	 */
	pView._renderRenderedView = function _renderRenderedView()
	{
		let tmpContainer = pView._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}

		// Marshal current editor content back to data before switching
		pView._marshalAllEditorsToData();

		// Combine all segments into a single markdown document
		let tmpSegments = pView._getSegmentsFromData();
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
		for (let tmpIdx in pView._segmentEditors)
		{
			if (pView._segmentEditors[tmpIdx])
			{
				pView._segmentEditors[tmpIdx].destroy();
			}
		}
		pView._segmentEditors = {};

		// Render the combined markdown via pict-section-content
		let tmpProvider = pView._getContentProvider();
		let tmpRenderedHTML = tmpProvider.parseMarkdown(tmpCombinedContent);

		// Build the rendered view container
		let tmpRenderedViewID = 'PictMDE-RenderedView';
		tmpContainer.innerHTML = `<div class="pict-mde-rendered-view" id="${tmpRenderedViewID}"><div class="pict-content">${tmpRenderedHTML || ''}</div></div>`;
		tmpContainer.classList.add('pict-mde-rendered-mode');

		// Bump generation for stale-render protection
		pView._renderedViewGeneration++;
		let tmpGeneration = pView._renderedViewGeneration;

		// Post-render hooks for mermaid diagrams and KaTeX equations
		let tmpContentContainer = tmpContainer.querySelector(`#${tmpRenderedViewID} .pict-content`);
		if (tmpContentContainer)
		{
			let tmpContentID = 'PictMDE-RenderedViewContent';
			tmpContentContainer.id = tmpContentID;

			pView._postRenderMermaid(tmpContentID, -1, tmpGeneration);
			pView._postRenderKaTeX(tmpContentID);
		}
	};

	/**
	 * Switch back from rendered view to the editing view: rebuild the
	 * full editor UI from the data.
	 */
	pView._restoreEditingView = function _restoreEditingView()
	{
		let tmpContainer = pView._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}

		tmpContainer.classList.remove('pict-mde-rendered-mode');
		pView._buildEditorUI();
	};
};
