# Server Upload — `onImageUpload` Hook + Orator Backend

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/server%5Fupload/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

The reference integration of `pict-section-markdowneditor` with a live
server-side image upload pipeline. By default, images pasted or dropped
into the editor become base64 data URIs embedded directly in the
markdown — fine for sketches and quick screenshots, terrible for
documents with more than a handful of large images. This example
overrides the `onImageUpload(file, segmentIndex, callback)` hook to
POST the raw image bytes to a local Orator server, save them to a
`dist/uploads/` directory, and insert the resulting URL back into the
markdown.

The full upload flow is exercised end to end: clipboard paste,
drag-and-drop, and the file-picker button all funnel through the same
hook. A status pill in the right sidebar shows pending / success /
error state per upload. A live "Uploaded Files" panel below it refreshes
from `GET /api/uploads` every time a new file lands.

Use this as the recipe for every server-backed editor integration —
the client-side hook and the server-side endpoint are independently
swappable. The same client code works against a multipart endpoint,
a presigned S3 URL, or any other URL-returning upload service with no
changes to the editor itself.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| `onImageUpload(pFile, pSegmentIndex, fCallback)` override | `ServerUploadMarkdownEditorView.onImageUpload()` in `ServerUpload-Example-Application.js` |
| Raw binary `fetch` upload with custom headers | `Content-Type: <image-mime>` + `x-filename: <original-name>` |
| Asynchronous callback contract — `fCallback(null, pURL)` | The editor inserts `![alt](pURL)` only after the callback fires |
| Per-upload status feedback in the host UI | `_showUploadStatus(message, type)` with success / error / pending styles |
| Live upload-list refresh via `GET /api/uploads` | `_refreshUploadList()` rebuilds the right-rail panel after each success |
| Orator service-server setup with body parsing | `tmpServiceServer.server.use(tmpServiceServer.bodyParser())` |
| Filename sanitisation against path traversal | `sanitizeFilename(pName)` strips dir separators + unsafe characters |
| Content-type-aware extension fallback | If the filename has no extension, derive one from MIME (`image/png → .png`) |
| Static file serving of uploaded images | `_Orator.addStaticRoute(__dirname + '/dist/', 'index.html')` makes `/uploads/*` reachable |

## Key files

- `ServerUpload-Example-Application.js` — client-side application. Subclasses
  `PictSectionMarkdownEditor` to override `onImageUpload`, adds host
  helpers `_showUploadStatus()`, `_refreshUploadList()`, and `_formatBytes()`.
- `server.js` — Orator backend. Stands up a Fable instance, instantiates
  the Restify service server, registers `POST /api/upload-image` and
  `GET /api/uploads`, serves `dist/` as static files.
- `html/index.html` — page shell with two columns: the editor on the
  left and a sidebar with the "How It Works" info panel + the "Uploaded
  Files" list on the right.

## Two state owners — the editor and the upload list

The client tracks two pieces of state. The editor's content lives in
`AppData.Document.Segments` like every other example. The host helpers
do *not* mirror the upload list into `AppData`; they fetch it on demand
from `GET /api/uploads`. This is deliberate — the server is the source
of truth for uploaded files, and the host should not be tempted to
cache that list (or it has to invalidate it).

The two seed segments tee up the demo:

```js
"Document":
{
    "Segments":
    [
        { "Content": "# Server Upload Example\n\nThis editor uploads images to the server instead of embedding them as base64 data URIs.\n\nTry pasting, dragging, or using the image button (▣) to add an image." },
        { "Content": "## How It Works\n\n1. Paste or drag an image into any segment\n2. The image is uploaded to `POST /api/upload-image`\n3. The server saves it to `dist/uploads/`\n4. A URL like `/uploads/1234567890-photo.png` is inserted\n\nThis keeps your markdown clean and your document lightweight." }
    ]
}
```

---

## Feature 1 — Overriding the `onImageUpload` hook

The default implementation in the base class returns `false`, causing
the editor to fall back to `FileReader.readAsDataURL` for base64
embedding. Returning `true` is the contract for "I'm handling this
asynchronously":

```js
class ServerUploadMarkdownEditorView extends libPictSectionMarkdownEditor
{
    onImageUpload(pFile, pSegmentIndex, fCallback)
    {
        let tmpSelf = this;
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
}
```

Three contract obligations:
- Return `true` synchronously so the editor *does not* trigger the
  base64 fallback.
- Call `fCallback(null, pURL)` exactly once on success — the editor
  uses `pURL` to build `![alt](pURL)` and inserts it at the cursor.
- Call `fCallback(pErrorMessage)` exactly once on failure — the
  editor logs the error and inserts nothing.

The raw `File` object is sent as the request body with two headers —
`Content-Type` carries the image MIME, `x-filename` carries the
original filename. No multipart wrapper; the server reads the body
directly.

## Feature 2 — All three image ingestion paths funnel through the hook

Clipboard paste, drag-and-drop onto the segment, and the file-picker
button each end up calling the same internal method,
`_processImageFile(file, segmentIndex)`, which then calls
`onImageUpload`. From the editor's perspective there is one
ingestion point regardless of how the file arrived:

```js
// Pict-MDE-ImageHandling.js
pView._processImageFile = function _processImageFile(pFile, pSegmentIndex)
{
    if (!pFile || !pFile.type || !pFile.type.startsWith('image/')) { return; }

    let tmpAltText = pFile.name ? pFile.name.replace(/\.[^.]+$/, '') : 'image';

    let tmpCallback = (pError, pURL) =>
    {
        if (pError) { pView.log.error(...); return; }
        if (pURL)   { pView._insertImageMarkdown(pSegmentIndex, pURL, tmpAltText); }
    };

    let tmpHandled = pView.onImageUpload(pFile, pSegmentIndex, tmpCallback);

    if (tmpHandled)
    {
        // Consumer is handling the upload asynchronously
        return;
    }

    // Default: convert to base64 data URI
    let tmpReader = new FileReader();
    tmpReader.onload = () => { pView._insertImageMarkdown(pSegmentIndex, tmpReader.result, tmpAltText); };
    tmpReader.onerror = () => { pView.log.error(...); };
    tmpReader.readAsDataURL(pFile);
};
```

Overriding `onImageUpload` in one place catches all three paths. The
alt text is derived from the filename (with the extension stripped) and
becomes the `![alt]` portion of the inserted markdown.

## Feature 3 — Host-side status feedback

Because the upload is asynchronous, the user benefits from immediate
"started" / "finished" feedback. The view exposes a small helper that
writes into `#UploadStatus`:

```js
_showUploadStatus(pMessage, pType)
{
    let tmpStatusEl = document.getElementById('UploadStatus');
    if (!tmpStatusEl) { return; }

    tmpStatusEl.textContent = pMessage;
    tmpStatusEl.className = 'upload-status';
    if (pType === 'success')      { tmpStatusEl.classList.add('upload-status-success'); }
    else if (pType === 'error')   { tmpStatusEl.classList.add('upload-status-error'); }
    else                           { tmpStatusEl.classList.add('upload-status-pending'); }

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
```

The element is owned by the host page (it lives in the right sidebar's
`.info-panel`), so the editor stays decoupled from the surrounding
layout. The auto-clear is keyed by message equality — if a new upload
fires before the previous message would clear, the new message stays
until *its* clear timer fires.

## Feature 4 — Live upload list refresh

After every successful upload, the view re-fetches the file list and
rebuilds the sidebar panel:

```js
_refreshUploadList()
{
    let tmpListEl = document.getElementById('UploadsList');
    if (!tmpListEl) { return; }

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
                let tmpFiles = pData.Files.reverse(); // Show most recent first
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
```

The application also calls `_refreshUploadList()` on a 500ms delay
after initial render, so the panel is populated on first load even if
the user has previously uploaded files.

## Feature 5 — The Orator endpoint

The server side is an Orator service server with two routes.
`POST /api/upload-image` consumes the raw body, sanitises the filename,
derives an extension from MIME if needed, and writes the buffer to
`dist/uploads/`:

```js
tmpServiceServer.post('/api/upload-image',
    (pRequest, pResponse, fNext) =>
    {
        try
        {
            let tmpBody = pRequest.body;
            if (!tmpBody)
            {
                pResponse.send(400, { Success: false, Error: 'No image data received.' });
                return fNext();
            }

            let tmpOriginalName = sanitizeFilename(pRequest.headers['x-filename']);
            let tmpContentType = pRequest.headers['content-type'] || 'application/octet-stream';

            let tmpExt = libPath.extname(tmpOriginalName);
            if (!tmpExt)
            {
                let tmpMimeMap =
                {
                    'image/png': '.png',
                    'image/jpeg': '.jpg',
                    'image/gif': '.gif',
                    'image/webp': '.webp',
                    'image/svg+xml': '.svg',
                    'image/bmp': '.bmp'
                };
                tmpExt = tmpMimeMap[tmpContentType] || '.bin';
                tmpOriginalName += tmpExt;
            }

            let tmpUniqueFilename = `${Date.now()}-${tmpOriginalName}`;
            let tmpFilePath = libPath.join(_UploadsFolder, tmpUniqueFilename);

            let tmpBuffer = Buffer.isBuffer(tmpBody) ? tmpBody : Buffer.from(tmpBody);
            libFs.writeFileSync(tmpFilePath, tmpBuffer);

            let tmpURL = `/uploads/${tmpUniqueFilename}`;
            _Fable.log.info(`Image uploaded: ${tmpURL} (${tmpBuffer.length} bytes)`);

            pResponse.send(
                {
                    Success: true,
                    URL: tmpURL,
                    Filename: tmpUniqueFilename,
                    Size: tmpBuffer.length
                });
        }
        catch (pError)
        {
            _Fable.log.error(`Image upload failed: ${pError.message}`);
            pResponse.send(500, { Success: false, Error: pError.message });
        }

        return fNext();
    });
```

The route prepends `Date.now()` to the sanitised filename to guarantee
uniqueness, then returns `Success`, `URL`, `Filename`, and `Size`. The
client reads `pData.URL` and passes it back through `fCallback(null,
pData.URL)` — that single field is what gets inserted into the
markdown.

## Feature 6 — Filename sanitisation

Three steps, each defending against a different class of attack:

```js
function sanitizeFilename(pName)
{
    if (!pName || typeof (pName) !== 'string')
    {
        return 'upload';
    }
    // Strip directory components
    let tmpName = libPath.basename(pName);
    // Remove dangerous characters
    tmpName = tmpName.replace(/[\/\\:*?"<>|]/g, '_');
    // Limit length
    if (tmpName.length > 200)
    {
        tmpName = tmpName.substring(0, 200);
    }
    return tmpName || 'upload';
}
```

- `libPath.basename` defeats path traversal — `../../../etc/passwd`
  becomes `passwd` before any further processing.
- The regex strips characters that some filesystems reject and that
  shell-quoting bugs can mishandle.
- The length cap defends against denial-of-service via 100MB filenames.

The fallback `'upload'` ensures every upload has a stable name even
when the client sends nothing or sends an empty string.

## Feature 7 — Body parsing for raw binary

Restify's default body parser handles JSON, URL-encoded forms, and
multipart. Raw binary requires an explicit middleware registration:

```js
_Orator.initialize(
    function ()
    {
        let tmpServiceServer = _Orator.serviceServer;
        tmpServiceServer.server.use(tmpServiceServer.bodyParser());

        tmpServiceServer.post('/api/upload-image', /* ... */);
        // ...
    });
```

`tmpServiceServer.bodyParser()` accepts the raw image MIME types and
puts the binary buffer on `pRequest.body`. The client is responsible
for setting the `Content-Type` header to the image's actual MIME so
the parser knows to treat the body as binary, not as form data.

## Feature 8 — Static file serving of uploaded images

A single Orator call serves the entire `dist/` folder as static files,
which includes the application bundle, the CodeMirror bundle, and the
uploaded images:

```js
_Orator.addStaticRoute(`${__dirname}/dist/`, 'index.html');
```

The route is rooted at `/`, so a file at
`dist/uploads/1708529890-photo.png` is reachable at
`/uploads/1708529890-photo.png`. That URL is what the editor receives
in the upload response, what gets inserted into the markdown, and what
the browser loads when rendering the image preview.

## Running the example

```bash
cd example_applications/server_upload
npm install
node build-codemirror-bundle.js   # produces html/codemirror-bundle.js
npx quack build && npx quack copy # produces dist/...-server-upload-example.min.js
npm start                          # starts Orator on http://localhost:8089
# then open http://localhost:8089 in a browser
```

The `npm run demo` shortcut runs `build` + `start` in sequence. Stop
the server with `Ctrl-C`; uploaded files persist in `dist/uploads/`
across restarts.

## Things to try in the running app

- **Paste a screenshot** — `Cmd-Shift-4 → Cmd-V` (macOS) or
  `Win-Shift-S → Ctrl-V` (Windows) into any segment. Watch the
  "Uploading..." status pill in the right sidebar transition to
  "Uploaded: 1708... (12.4 KB)" once the server responds.
- **Drag an image file** — drag a `.png` from Finder/Explorer onto
  any segment. Editor outlines the drop target with a dashed border.
  The dropped image uploads through the same hook.
- **Click the image button** — the right-sidebar image button opens
  the native file picker. Same upload path.
- **Edit the inserted URL** — after upload, the editor's cursor sits
  at the end of `![photo](/uploads/...)`. Edit the alt text manually;
  rich-preview re-renders with the new alt.
- **Inspect the markdown** — call
  `_Pict.views.ServerUploadEditorView.getAllContent()` in the console.
  The inserted URLs are server paths, not data URIs — the document
  stays lightweight.
- **Watch `dist/uploads/`** — open the folder in a file manager and
  paste a few images. Each upload produces a `<timestamp>-<filename>`
  file.
- **Trigger an error** — kill the server (`Ctrl-C`) and try to paste
  an image. The "Upload error: ..." pill appears in red; no image is
  inserted into the segment.

## Takeaways

1. **`onImageUpload` is the only override required for server-backed
   image storage.** Return `true`, call the callback, the editor does
   the rest. Three ingestion paths funnel through one hook.
2. **The hook contract is async-callback, not async-await.** Return
   `true` synchronously, then invoke `fCallback(null, url)` exactly
   once when the upload finishes. The editor will not retry; calling
   the callback twice will double-insert the markdown.
3. **Decouple host UI from the editor.** Status pills and upload
   lists live in host-owned DOM (`#UploadStatus`, `#UploadsList`).
   The editor doesn't know they exist; the upload hook is the only
   bridge.
4. **Sanitise filenames server-side, always.** `libPath.basename`,
   character-class replacement, and a length cap together defend
   against path traversal, filesystem-character bugs, and
   denial-of-service. Never trust client-supplied filenames.
5. **The same client code works against any URL-returning service.**
   Swap the `fetch` URL and request shape (multipart, presigned
   S3 PUT, etc.) without changing the editor or the contract — as
   long as the final step is `fCallback(null, publicURL)`.

## Related documentation

- [Overview](../../README.md) — module README + Quick Start
- [Configuration](../../configuration.md) — view options, button quadrants
- [API Reference](../../api.md) — `onImageUpload` contract, `openImagePicker`
- [Image Upload](../../image_upload.md) — complete walkthrough of this example
- [Orator](https://stevenvelozo.github.io/orator/) — Restify wrapper used by `server.js`
