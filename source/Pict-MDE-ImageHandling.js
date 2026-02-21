/**
 * Pict-MDE-ImageHandling: Helper module for PictSectionMarkdownEditor
 *
 * Handles image operations: file picker, file processing (hook or base64
 * fallback), markdown insertion, preview thumbnail rendering, and
 * drag-and-drop for image files onto the editor.
 */

/**
 * Attach image handling methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */
module.exports.attach = function attach(pView)
{
	/**
	 * Open a file picker to select an image for insertion into a segment.
	 * Called by the sidebar image button onclick handler.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView.openImagePicker = function openImagePicker(pSegmentIndex)
	{
		let tmpFileInput = document.getElementById(`PictMDE-ImageInput-${pSegmentIndex}`);
		if (!tmpFileInput)
		{
			pView.log.warn(`PICT-MarkdownEditor openImagePicker: file input not found for segment ${pSegmentIndex}.`);
			return;
		}

		// Wire the change handler fresh each time (in case it was already used)
		tmpFileInput.onchange = () =>
		{
			if (tmpFileInput.files && tmpFileInput.files.length > 0)
			{
				pView._processImageFile(tmpFileInput.files[0], pSegmentIndex);
			}
			// Reset the input so the same file can be re-selected
			tmpFileInput.value = '';
		};

		tmpFileInput.click();
	};

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
	pView._processImageFile = function _processImageFile(pFile, pSegmentIndex)
	{
		if (!pFile || !pFile.type || !pFile.type.startsWith('image/'))
		{
			pView.log.warn(`PICT-MarkdownEditor _processImageFile: not an image file (type: ${pFile ? pFile.type : 'null'}).`);
			return;
		}

		let tmpAltText = pFile.name ? pFile.name.replace(/\.[^.]+$/, '') : 'image';

		// Check if the consumer wants to handle the upload
		let tmpCallback = (pError, pURL) =>
		{
			if (pError)
			{
				pView.log.error(`PICT-MarkdownEditor image upload error: ${pError}`);
				return;
			}
			if (pURL)
			{
				pView._insertImageMarkdown(pSegmentIndex, pURL, tmpAltText);
			}
		};

		let tmpHandled = pView.onImageUpload(pFile, pSegmentIndex, tmpCallback);

		if (tmpHandled)
		{
			// Consumer is handling the upload asynchronously
			return;
		}

		// Default: convert to base64 data URI
		if (typeof (FileReader) === 'undefined')
		{
			pView.log.error(`PICT-MarkdownEditor _processImageFile: FileReader not available in this environment.`);
			return;
		}

		let tmpReader = new FileReader();
		tmpReader.onload = () =>
		{
			pView._insertImageMarkdown(pSegmentIndex, tmpReader.result, tmpAltText);
		};
		tmpReader.onerror = () =>
		{
			pView.log.error(`PICT-MarkdownEditor _processImageFile: FileReader error.`);
		};
		tmpReader.readAsDataURL(pFile);
	};

	/**
	 * Insert markdown image syntax at the cursor position in a segment editor.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pURL - The image URL (data URI or remote URL)
	 * @param {string} [pAltText] - The alt text (default: 'image')
	 */
	pView._insertImageMarkdown = function _insertImageMarkdown(pSegmentIndex, pURL, pAltText)
	{
		let tmpEditor = pView._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			pView.log.warn(`PICT-MarkdownEditor _insertImageMarkdown: no editor for segment ${pSegmentIndex}.`);
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
		pView._updateImagePreviews(pSegmentIndex);
	};

	/**
	 * Scan the content of a segment for markdown image references and render
	 * preview thumbnails in the preview area below the editor.
	 *
	 * Matches the pattern ![alt](url) and creates <img> elements for each.
	 * The preview area is hidden when there are no images.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._updateImagePreviews = function _updateImagePreviews(pSegmentIndex)
	{
		let tmpPreviewEl = document.getElementById(`PictMDE-ImagePreview-${pSegmentIndex}`);
		if (!tmpPreviewEl)
		{
			return;
		}

		let tmpEditor = pView._segmentEditors[pSegmentIndex];
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
	};

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
	pView._wireImageDragEvents = function _wireImageDragEvents(pEditorContainer, pSegmentIndex)
	{
		pEditorContainer.addEventListener('dragover', (pEvent) =>
		{
			// Only handle file drags, not segment-reorder drags
			if (pView._dragSourceIndex >= 0)
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
			if (pView._dragSourceIndex >= 0)
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
				pView._processImageFile(tmpFile, pSegmentIndex);
			}
		});
	};
};
