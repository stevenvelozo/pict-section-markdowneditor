# Pict Section MarkdownEditor

A Pict view that provides a segmented markdown editor built on [CodeMirror v6](https://codemirror.net/). Break documents into independently editable segments, reorder them with drag-and-drop, and get live rich previews with syntax highlighting, mermaid diagrams, and KaTeX math rendering.

## Quick Start

```bash
npm install pict-section-markdowneditor
```

### 1. Define an Editor View

```javascript
const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('pict-section-markdowneditor');

class MyEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _EditorConfig = (
{
	"ViewIdentifier": "MyEditor",
	"TargetElementAddress": "#EditorContainer",
	"ContentDataAddress": "AppData.Document.Segments",
	"ReadOnly": false,
	"EnableRichPreview": true
});

class MyApp extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
		this.pict.addView('MyEditorView', _EditorConfig, MyEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();
		this.pict.views.MyEditorView.render();
	}
}

module.exports = MyApp;

module.exports.default_configuration = (
{
	"Name": "My Editor App",
	"Hash": "MyEditorApp",
	"MainViewportViewIdentifier": "MyEditorView",
	"pict_configuration":
	{
		"Product": "MyEditor-App",
		"DefaultAppData":
		{
			"Document":
			{
				"Segments":
				[
					{ "Content": "# Hello\n\nStart writing here." }
				]
			}
		}
	}
});
```

### 2. Create the HTML Page

The editor requires CodeMirror v6 modules to be available as a window global. Build a CodeMirror bundle using esbuild:

```javascript
// codemirror-entry.js
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';

export { EditorView, EditorState, Decoration, ViewPlugin, WidgetType, basicSetup, markdown };
export const extensions = [basicSetup, markdown()];
```

```bash
npx esbuild codemirror-entry.js --bundle --outfile=html/codemirror-bundle.js \
  --format=iife --global-name=CodeMirrorModules --platform=browser --target=es2018
```

Then reference it in your HTML:

```html
<!doctype html>
<html>
<head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
	<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
	<script>mermaid.initialize({ startOnLoad: false, theme: 'default' });</script>
	<style id="PICT-CSS"></style>
	<script src="./codemirror-bundle.js"></script>
	<script src="./pict.min.js"></script>
	<script>
		Pict.safeOnDocumentReady(() => { Pict.safeLoadPictApplication(MyApp, 1) });
	</script>
</head>
<body>
	<div id="EditorContainer"></div>
	<script src="./my_app.min.js"></script>
</body>
</html>
```

### 3. Build and Run

```bash
npx quack build && npx quack copy
```

## How It Works

1. Your Pict application initializes and renders the editor view
2. The view reads `ContentDataAddress` from AppData to load an array of segment objects (each with a `Content` string property)
3. Each segment gets its own CodeMirror editor instance inside a four-quadrant layout with a drag handle, left controls, editor body, and right sidebar
4. Formatting buttons (bold, italic, code, heading, link, image) appear in the sidebar and follow the cursor when a segment is active
5. Content changes are debounced at 500ms and marshaled back to AppData automatically
6. Rich previews render the markdown to HTML via `pict-section-content`, with post-processing for mermaid diagrams and KaTeX math

## Architecture

The editor uses a segment-based architecture where each segment is an independent editing unit:

```
+-------+--------+---------------------------+---------+
| Left  | Drag   |      Segment Body         | Right   |
| Ctrl  | Handle |                           | Sidebar |
|       |        | +---------------------+   |         |
| [x]   | ::::   | | CodeMirror Editor  |   | [B]     |
|       | ::::   | +---------------------+   | [I]     |
| [^]   |        | | Image Preview      |   | [<>]    |
| [v]   |        | +---------------------+   | [#]     |
| [1]   |        | | Rich Preview       |   | [link]  |
| [o]   |        | +---------------------+   | [img]   |
+-------+--------+---------------------------+---------+
```

**Quadrant Buttons:**

| Quadrant | Position | Default Buttons |
|----------|----------|-----------------|
| `ButtonsTL` | Top-left, sticky | Remove segment (x) |
| `ButtonsBL` | Bottom-left, sticky | Move up, Move down, Toggle controls, Toggle preview |
| `ButtonsTR` | Top-right, follows cursor | Bold, Italic, Code, Heading, Link, Image |
| `ButtonsBR` | Bottom-right | Empty by default |

**Segment Indexing:**

The editor maintains two types of indices:
- **Internal index** -- A monotonically increasing unique ID assigned when a segment is created (never reused)
- **Logical index** -- The segment's current position in the array (0-based, changes on reorder)

## Rich Preview Content

When `EnableRichPreview` is `true`, each segment displays a rendered preview below the editor. The preview supports:

- Headings, paragraphs, lists, blockquotes, and tables
- Fenced code blocks with syntax highlighting via pict-section-content
- Mermaid diagram blocks (rendered asynchronously with stale-render protection)
- KaTeX math in both inline (`$...$`) and display (`$$...$$`) modes
- Images with preview thumbnails

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle bold on selection |
| `Ctrl/Cmd + I` | Toggle italic on selection |
| `Ctrl/Cmd + E` | Toggle inline code on selection |

## Documentation

- [Configuration](configuration.md) -- View options, button quadrants, and template customization
- [API Reference](api.md) -- Complete class method and property documentation
- [Image Upload](image_upload.md) -- Server-side image upload integration guide

## Example Applications

- [Markdown Editor](examples/markdown_editor.md) -- Full-featured segmented editor with previews, formatting, and drag reorder
- [Embedded Editor](examples/embedded_editor.md) -- Small bordered widget for notes, comments, or form fields
- [Book Viewer](examples/book_viewer.md) -- Multi-chapter book with click-to-edit sections
- [Server Upload](examples/server_upload.md) -- Orator server with image upload endpoint and the `onImageUpload` hook

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - Core MVC application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) - View base class
- [pict-section-content](https://github.com/stevenvelozo/pict-section-content) - Markdown rendering with code highlighting, mermaid, and KaTeX
- [pict-application](https://github.com/stevenvelozo/pict-application) - Application base class
- [fable](https://github.com/stevenvelozo/fable) - Service provider framework
