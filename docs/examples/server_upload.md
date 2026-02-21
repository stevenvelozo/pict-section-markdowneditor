# Server Upload Example

Demonstrates server-side image upload by overriding the `onImageUpload` hook. Images are uploaded to an Orator server endpoint instead of being embedded as base64 data URIs.

**Path:** `example_applications/server_upload/`

## What It Demonstrates

- Custom `onImageUpload` hook that sends images to a server via `fetch`
- Orator server with `POST /api/upload-image` and `GET /api/uploads` endpoints
- Filename sanitization and unique timestamped naming
- Upload status display and file list panel
- Clean markdown with URL references instead of bloated base64 strings

## Running the Example

```bash
cd example_applications/server_upload
npm install
npx quack build && npx quack copy
node server.js
```

Open [http://localhost:8089](http://localhost:8089) in a browser.

The server must be running for image uploads to work. Static examples (markdown_editor, embedded_editor, book_viewer) do not require a server.

## Architecture Overview

```
Browser                              Server (port 8089)
+----------------------------+       +----------------------------+
| PictSectionMarkdownEditor  |       | Orator + Restify           |
|                            |       |                            |
| User pastes/drags image    |       |                            |
|         |                  |       |                            |
| onImageUpload() fires      |       |                            |
|         |                  |       |                            |
| fetch POST /api/upload     | ----> | Receive raw binary         |
|   Content-Type: image/png  |       | Sanitize filename          |
|   x-filename: photo.png   |       | Save to dist/uploads/      |
|                            |       | Return { URL, Filename }   |
|                            | <---- |                            |
| callback(null, URL)        |       |                            |
|         |                  |       |                            |
| Insert ![alt](/uploads/..)|       | Serve /uploads/* static    |
+----------------------------+       +----------------------------+
```

## Client Side: `onImageUpload` Hook

The editor view subclass overrides `onImageUpload` to send the file to the server:

```javascript
class ServerUploadEditorView extends libPictSectionMarkdownEditor
{
	onImageUpload(pFile, pSegmentIndex, fCallback)
	{
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
			.then((pResponse) =>
			{
				if (!pResponse.ok) throw new Error(`Server responded with ${pResponse.status}`);
				return pResponse.json();
			})
			.then((pData) =>
			{
				if (pData.Success && pData.URL)
				{
					this._showUploadStatus(
						`Uploaded: ${pData.Filename} (${this._formatBytes(pData.Size)})`, 'success');
					this._refreshUploadList();
					fCallback(null, pData.URL);
				}
				else
				{
					this._showUploadStatus(`Upload failed: ${pData.Error}`, 'error');
					fCallback(pData.Error || 'Upload failed');
				}
			})
			.catch((pError) =>
			{
				this._showUploadStatus(`Upload error: ${pError.message}`, 'error');
				fCallback(pError.message);
			});

		return true;
	}
}
```

The subclass also adds UI helper methods:
- `_showUploadStatus(message, type)` -- Shows a status message that auto-clears after 5 seconds
- `_refreshUploadList()` -- Fetches `GET /api/uploads` and renders thumbnails in the sidebar
- `_formatBytes(bytes)` -- Converts byte counts to human-readable strings (e.g., "25.0 KB")

## Server Side: Orator Endpoints

### POST `/api/upload-image`

Accepts raw image binary in the request body.

**Request headers:**
- `Content-Type` -- Image MIME type (e.g., `image/png`, `image/jpeg`)
- `x-filename` -- Original filename from the client

**Response (success):**
```json
{
	"Success": true,
	"URL": "/uploads/1708529890-photo.png",
	"Filename": "1708529890-photo.png",
	"Size": 25000
}
```

**Response (error):**
```json
{
	"Success": false,
	"Error": "No image data received."
}
```

**Server processing:**
1. Reads the raw binary from `pRequest.body`
2. Sanitizes the filename (strips path separators, removes dangerous characters, limits length)
3. Determines file extension from Content-Type if the filename lacks one
4. Prepends a timestamp for uniqueness: `${Date.now()}-${originalName}`
5. Writes the file to `dist/uploads/`
6. Returns the URL path for the saved file

### GET `/api/uploads`

Lists all files in the uploads directory.

**Response:**
```json
{
	"Success": true,
	"Files": [
		{
			"Filename": "1708529890-photo.png",
			"URL": "/uploads/1708529890-photo.png",
			"Size": 25000,
			"Modified": "2026-02-21T12:00:00.000Z"
		}
	]
}
```

## HTML Layout

The page uses a two-column layout:
- **Left column** -- The markdown editor
- **Right column** -- An info panel explaining how it works, an upload status area, and a list of uploaded files with thumbnails

## Key Files

| File | Purpose |
|------|---------|
| `ServerUpload-Example-Application.js` | Client app with `onImageUpload` hook, upload status, and file list |
| `server.js` | Orator server with upload endpoint, static file serving, and filename sanitization |
| `dist/index.html` | Two-column HTML layout with editor and uploads sidebar |

## Adapting for Production

For a production deployment, consider:

- **Persistent storage** -- Replace `fs.writeFileSync` with S3, cloud storage, or a database
- **Authentication** -- Add auth middleware to the upload endpoint
- **File validation** -- Check MIME type against an allowlist, enforce size limits
- **Unique naming** -- Use UUIDs instead of timestamps to avoid collisions under load
- **CDN serving** -- Serve uploaded images from a CDN rather than the application server
- **Cleanup** -- Implement retention policies for uploaded images

For alternative upload patterns (FormData, presigned URLs), see the [Image Upload Guide](image_upload.md).
