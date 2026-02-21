/**
 * Server Upload Example — Orator server with image upload endpoint
 *
 * This server:
 *   1. Serves the built Pict application from dist/
 *   2. Accepts image uploads via POST /api/upload-image
 *   3. Saves uploaded images to dist/uploads/
 *   4. Returns the URL for the saved image
 *
 * Usage:
 *   npm run build   (build the client-side bundle first)
 *   npm start       (start this server)
 *   Open http://localhost:8089
 */

const libFs = require('fs');
const libPath = require('path');

// Require from the retold module tree (no need to npm install separately)
const libFable = require('../../node_modules/fable');
const libOrator = require('../../../../orator/orator');
const libOratorServiceServerRestify = require('../../../../orator/orator-serviceserver-restify');

let _DistFolder = libPath.join(__dirname, 'dist');
let _UploadsFolder = libPath.join(_DistFolder, 'uploads');

// Ensure the uploads directory exists
if (!libFs.existsSync(_UploadsFolder))
{
	libFs.mkdirSync(_UploadsFolder, { recursive: true });
}

let _Fable = new libFable(
	{
		Product: 'MarkdownEditor-ServerUpload',
		ProductVersion: '0.0.1',
		APIServerPort: 8089
	});

_Fable.serviceManager.addServiceType('OratorServiceServer', libOratorServiceServerRestify);
_Fable.serviceManager.instantiateServiceProvider('OratorServiceServer');
_Fable.serviceManager.addServiceType('Orator', libOrator);
let _Orator = _Fable.serviceManager.instantiateServiceProvider('Orator');

/**
 * Sanitize a filename — strip path separators and dangerous characters.
 *
 * @param {string} pName - The raw filename from the client
 * @returns {string} A safe filename
 */
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

_Orator.initialize(
	function ()
	{
		let tmpServiceServer = _Orator.serviceServer;

		// Enable body parsing for POST requests
		// The bodyParser handles raw binary bodies when Content-Type is an image type
		tmpServiceServer.server.use(tmpServiceServer.bodyParser());

		// --- POST /api/upload-image ---
		// Receives raw image binary in the request body.
		// Headers: Content-Type (image/*), x-filename (original filename)
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

					// Get the original filename from a custom header
					let tmpOriginalName = sanitizeFilename(pRequest.headers['x-filename']);
					let tmpContentType = pRequest.headers['content-type'] || 'application/octet-stream';

					// Determine file extension from content-type if the filename lacks one
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

					// Generate a unique filename: timestamp-originalname
					let tmpUniqueFilename = `${Date.now()}-${tmpOriginalName}`;
					let tmpFilePath = libPath.join(_UploadsFolder, tmpUniqueFilename);

					// Write the file — tmpBody may be a Buffer or a string
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

		// --- GET /api/uploads ---
		// List uploaded files (for debugging / demo purposes)
		tmpServiceServer.get('/api/uploads',
			(pRequest, pResponse, fNext) =>
			{
				try
				{
					let tmpFiles = libFs.readdirSync(_UploadsFolder);
					let tmpFileList = tmpFiles.map(
						(pFilename) =>
						{
							let tmpStat = libFs.statSync(libPath.join(_UploadsFolder, pFilename));
							return (
								{
									Filename: pFilename,
									URL: `/uploads/${pFilename}`,
									Size: tmpStat.size,
									Modified: tmpStat.mtime
								});
						});

					pResponse.send({ Success: true, Files: tmpFileList });
				}
				catch (pError)
				{
					pResponse.send(500, { Success: false, Error: pError.message });
				}

				return fNext();
			});

		// Serve the dist/ folder as static files (the built application + uploads)
		_Orator.addStaticRoute(`${__dirname}/dist/`, 'index.html');

		// Start the server
		_Orator.startService(
			function ()
			{
				_Fable.log.info('==========================================================');
				_Fable.log.info('  Server Upload Example running on http://localhost:8089');
				_Fable.log.info('==========================================================');
				_Fable.log.info(`Uploads will be saved to: ${_UploadsFolder}`);
			});
	});
