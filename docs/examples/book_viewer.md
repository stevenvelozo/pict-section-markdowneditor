# Book Viewer Example

A multi-chapter book rendered as read-only content using `pict-section-content`, with the ability to click any section to edit it inline using the markdown editor.

**Path:** `example_applications/book_viewer/`

## What It Demonstrates

- Rendering long-form markdown documents with pict-section-content
- Click-to-edit: switch any section from rendered HTML to a live markdown editor
- Automatic splitting of a markdown document on `## ` headings into sections
- Mermaid diagram rendering (data flow, microservices, sequence diagrams, compilation pipeline)
- KaTeX math rendering (scaling formulas, network diameter, Bloom filter probabilities, Shannon entropy)
- Code blocks with syntax highlighting
- Tables with structured data
- Marshaling edited content back to the document when the user clicks "Done"

## Running the Example

```bash
cd example_applications/book_viewer
npm install
npx quack build && npx quack copy
```

Open `dist/index.html` in a browser, or use the hub page at `example_applications/index.html`.

## How It Works

### Document Structure

The book content ("De Architectura Digitalis") is defined as a single markdown string with 10 chapters. The application splits it on `## ` headings to produce an array of sections:

```javascript
function splitOnHeadings(pMarkdown)
{
	let tmpLines = pMarkdown.split('\n');
	let tmpSegments = [];
	let tmpCurrent = [];

	for (let i = 0; i < tmpLines.length; i++)
	{
		if (tmpLines[i].startsWith('## ') && tmpCurrent.length > 0)
		{
			tmpSegments.push(tmpCurrent.join('\n').trim());
			tmpCurrent = [];
		}
		tmpCurrent.push(tmpLines[i]);
	}
	if (tmpCurrent.length > 0)
	{
		tmpSegments.push(tmpCurrent.join('\n').trim());
	}

	return tmpSegments;
}
```

### Rendered View

Each section is rendered to HTML using the `PictContentProvider` from pict-section-content, with post-rendering for mermaid diagrams and KaTeX math. An "Edit" button appears on each section.

### Edit Mode

When the user clicks "Edit" on a section:

1. The rendered HTML is replaced with a markdown editor container
2. A new `BookViewerSectionEditorView` (extending `PictSectionMarkdownEditor`) is created
3. The section's markdown content is loaded as a single segment in the editor
4. The "Edit" button changes to "Done"

### Finishing Edits

When the user clicks "Done":

1. The editor marshals its content back (`marshalFromView()`)
2. If the user added multiple segments in the editor, they are joined with `\n\n`
3. The updated markdown is stored back in the sections array
4. The editor view is destroyed and the section re-renders as HTML

### Key Architecture Pattern

This example shows how to combine read-mode rendering (pict-section-content) with on-demand editing (pict-section-markdowneditor):

```javascript
// Content provider for rendering
this.pict.addProvider(
	'Content-Provider',
	libPictSectionContent.PictContentProvider.default_configuration,
	libPictSectionContent.PictContentProvider
);

// Create an editor view on demand
editSection(pIndex)
{
	let tmpEditorConfig =
	{
		ViewIdentifier: 'BookSectionEditorView',
		TargetElementAddress: `#BookSectionEditor-${pIndex}`,
		ContentDataAddress: 'AppData.EditingSection.Segments',
		ReadOnly: false,
		EnableRichPreview: true
	};

	this._editorView = this.pict.addView(
		'BookSectionEditorView', tmpEditorConfig, BookViewerSectionEditorView);
	this._editorView.render();
}
```

## Key Files

| File | Purpose |
|------|---------|
| `BookViewer-Example-Application.js` | Application with book content, section splitting, edit/done toggling, and mermaid/KaTeX post-rendering |
| `dist/index.html` | HTML page with KaTeX and mermaid CDN includes |
