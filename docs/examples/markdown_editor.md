# Markdown Editor Example

The full-featured example demonstrating all core capabilities of the segmented markdown editor: rich previews, formatting toolbar, drag-and-drop reorder, mermaid diagrams, KaTeX math, and code highlighting.

**Path:** `example_applications/markdown_editor/`

## What It Demonstrates

- Four pre-populated segments with headings, formatting, diagrams, math, and code
- All quadrant buttons enabled (remove, move, controls, preview, formatting, image)
- Rich preview with syntax-highlighted code blocks
- Mermaid diagram rendering in preview
- KaTeX inline and display math in preview
- Toolbar buttons for toggling read-only, previews, and rendered view
- "Get All Content" button to combine segments into a single markdown string

## Running the Example

```bash
cd example_applications/markdown_editor
npm install
node build-codemirror-bundle.js
npx quack build && npx quack copy
```

Open `dist/index.html` in a browser, or use the hub page at `example_applications/index.html`.

## How It Works

The application defines a minimal subclass with no custom behavior -- all features come from configuration and defaults:

```javascript
const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('pict-section-markdowneditor');

class ExampleMarkdownEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _EditorConfig = (
{
	"ViewIdentifier": "ExampleMarkdownEditor",
	"TargetElementAddress": "#MarkdownEditorContainer",
	"ContentDataAddress": "AppData.Document.Segments",
	"ReadOnly": false
});
```

The initial document segments are defined in `DefaultAppData` and include examples of headings, mermaid diagrams, KaTeX math, and syntax-highlighted code blocks.

## CodeMirror Bundle

This example includes a separate CodeMirror build step using esbuild. The entry point `codemirror-entry.js` imports the required modules and exports them as `window.CodeMirrorModules`:

```javascript
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';

export { EditorView, EditorState, Decoration, ViewPlugin, WidgetType, basicSetup, markdown };
export const extensions = [basicSetup, markdown()];
```

Built with: `node build-codemirror-bundle.js`

This produces `html/codemirror-bundle.js` which is copied to `dist/` by quackage.

## HTML Page

The HTML page includes a toolbar with four buttons that call editor methods:

- **Get All Content** -- Calls `getAllContent()` and displays the combined markdown
- **Toggle Read-Only** -- Calls `setReadOnly(!view.options.ReadOnly)`
- **Toggle All Previews** -- Calls `togglePreview()` to show/hide rich previews
- **Toggle Rendered View** -- Calls `toggleRenderedView()` to switch between editing and full-document preview

## Key Files

| File | Purpose |
|------|---------|
| `MarkdownEditor-Example-Application.js` | Application class with editor view and default segments |
| `codemirror-entry.js` | ES module entry point for CodeMirror bundling |
| `build-codemirror-bundle.js` | esbuild script to create the browser bundle |
| `dist/index.html` | HTML page with toolbar and editor container |
