/**
 * Server Upload Example Application
 *
 * Demonstrates how to use the onImageUpload hook to upload images to a
 * server instead of embedding them as base64 data URIs in the markdown.
 *
 * The upload flow:
 *   1. User pastes, drags, or picks an image in the editor
 *   2. onImageUpload sends the raw File to POST /api/upload-image
 *   3. Server saves the file and returns a URL
 *   4. The URL is inserted into the markdown as ![alt](/uploads/filename.png)
 */

const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');

// ---- Subclassed editor view with server-side image upload ----

class ServerUploadMarkdownEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Override the image upload hook to send images to the server.
	 *
	 * @param {File} pFile - The image File object
	 * @param {number} pSegmentIndex - The segment index
	 * @param {function} fCallback - Callback: fCallback(pError, pURL)
	 * @returns {boolean} true — we handle it asynchronously
	 */
	onImageUpload(pFile, pSegmentIndex, fCallback)
	{
		let tmpSelf = this;

		// Show uploading status
		this._showUploadStatus('Uploading...');

		fetch('/api/upload-image',
			{
				method: 'POST',
				body: pFile,
				headers:
				{
					'Content-Type': pFile.type,
					'x-filename': pFile.name
				}
			})
			.then(
				(pResponse) =>
				{
					if (!pResponse.ok)
					{
						throw new Error(`Server responded with ${pResponse.status}`);
					}
					return pResponse.json();
				})
			.then(
				(pData) =>
				{
					if (pData.Success && pData.URL)
					{
						tmpSelf._showUploadStatus(`Uploaded: ${pData.Filename} (${tmpSelf._formatBytes(pData.Size)})`, 'success');
						tmpSelf._refreshUploadList();
						fCallback(null, pData.URL);
					}
					else
					{
						tmpSelf._showUploadStatus(`Upload failed: ${pData.Error || 'Unknown error'}`, 'error');
						fCallback(pData.Error || 'Upload failed');
					}
				})
			.catch(
				(pError) =>
				{
					tmpSelf._showUploadStatus(`Upload error: ${pError.message}`, 'error');
					tmpSelf.log.error(`PICT-MarkdownEditor server upload error: ${pError.message}`);
					fCallback(pError.message);
				});

		return true;
	}

	/**
	 * Show a brief status message in the upload status area.
	 *
	 * @param {string} pMessage - The status message
	 * @param {string} [pType] - 'success', 'error', or undefined (neutral)
	 */
	_showUploadStatus(pMessage, pType)
	{
		let tmpStatusEl = document.getElementById('UploadStatus');
		if (!tmpStatusEl)
		{
			return;
		}

		tmpStatusEl.textContent = pMessage;
		tmpStatusEl.className = 'upload-status';
		if (pType === 'success')
		{
			tmpStatusEl.classList.add('upload-status-success');
		}
		else if (pType === 'error')
		{
			tmpStatusEl.classList.add('upload-status-error');
		}
		else
		{
			tmpStatusEl.classList.add('upload-status-pending');
		}

		// Auto-clear after 5 seconds for success/error
		if (pType === 'success' || pType === 'error')
		{
			setTimeout(
				() =>
				{
					if (tmpStatusEl.textContent === pMessage)
					{
						tmpStatusEl.textContent = '';
						tmpStatusEl.className = 'upload-status';
					}
				}, 5000);
		}
	}

	/**
	 * Refresh the uploads list panel.
	 */
	_refreshUploadList()
	{
		let tmpListEl = document.getElementById('UploadsList');
		if (!tmpListEl)
		{
			return;
		}

		fetch('/api/uploads')
			.then((pResponse) => pResponse.json())
			.then(
				(pData) =>
				{
					if (!pData.Success || !pData.Files || pData.Files.length === 0)
					{
						tmpListEl.innerHTML = '<em class="upload-list-empty">No uploads yet</em>';
						return;
					}

					let tmpHTML = '';
					// Show most recent first
					let tmpFiles = pData.Files.reverse();
					for (let i = 0; i < tmpFiles.length; i++)
					{
						let tmpFile = tmpFiles[i];
						tmpHTML += `<div class="upload-list-item">`;
						tmpHTML += `<img src="${tmpFile.URL}" class="upload-list-thumb" alt="${tmpFile.Filename}" />`;
						tmpHTML += `<div class="upload-list-info">`;
						tmpHTML += `<span class="upload-list-name" title="${tmpFile.Filename}">${tmpFile.Filename}</span>`;
						tmpHTML += `<span class="upload-list-size">${this._formatBytes(tmpFile.Size)}</span>`;
						tmpHTML += `</div>`;
						tmpHTML += `</div>`;
					}
					tmpListEl.innerHTML = tmpHTML;
				})
			.catch(
				() =>
				{
					tmpListEl.innerHTML = '<em class="upload-list-empty">Could not load uploads</em>';
				});
	}

	/**
	 * Format a byte count into a human-readable string.
	 *
	 * @param {number} pBytes
	 * @returns {string}
	 */
	_formatBytes(pBytes)
	{
		if (!pBytes || pBytes === 0)
		{
			return '0 B';
		}
		let tmpUnits = ['B', 'KB', 'MB', 'GB'];
		let tmpIndex = Math.floor(Math.log(pBytes) / Math.log(1024));
		if (tmpIndex >= tmpUnits.length)
		{
			tmpIndex = tmpUnits.length - 1;
		}
		let tmpValue = pBytes / Math.pow(1024, tmpIndex);
		return `${tmpValue.toFixed(tmpIndex === 0 ? 0 : 1)} ${tmpUnits[tmpIndex]}`;
	}
}

// ---- View configuration ----

const _EditorViewConfiguration = (
{
	"ViewIdentifier": "ServerUploadEditorView",

	"TargetElementAddress": "#MarkdownEditorContainer",

	"ContentDataAddress": "AppData.Document.Segments",

	"ReadOnly": false,

	"EnableRichPreview": true
});

// ---- Application class ----

class ServerUploadExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('ServerUploadEditorView', _EditorViewConfiguration, ServerUploadMarkdownEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();

		let tmpView = this.pict.views.ServerUploadEditorView;
		if (tmpView)
		{
			tmpView.render();
		}

		// Load the initial uploads list
		if (typeof (window) !== 'undefined')
		{
			setTimeout(
				() =>
				{
					if (tmpView && tmpView._refreshUploadList)
					{
						tmpView._refreshUploadList();
					}
				}, 500);
		}
	}
}

module.exports = ServerUploadExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Server Upload Example",
	"Hash": "ServerUploadExample",

	"MainViewportViewIdentifier": "ServerUploadEditorView",

	"pict_configuration":
	{
		"Product": "ServerUpload-Example",

		"DefaultAppData":
		{
			"Document":
			{
				"Segments":
				[
					{
						"Content": "# Server Upload Example\n\nThis editor uploads images to the server instead of embedding them as base64 data URIs.\n\nTry pasting, dragging, or using the image button (▣) to add an image."
					},
					{
						"Content": "## How It Works\n\n1. Paste or drag an image into any segment\n2. The image is uploaded to `POST /api/upload-image`\n3. The server saves it to `dist/uploads/`\n4. A URL like `/uploads/1234567890-photo.png` is inserted\n\nThis keeps your markdown clean and your document lightweight."
					}
				]
			}
		}
	}
});
