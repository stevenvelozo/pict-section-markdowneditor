# Embedded Editor Example

A compact markdown editor widget sized for embedding in forms, sidebars, or comment areas. Uses two segments for meeting notes and action items.

**Path:** `example_applications/embedded_editor/`

## What It Demonstrates

- Compact editor suitable for embedding in larger applications
- Rich preview enabled for inline markdown rendering
- Two segments with practical content (meeting notes + action items)
- No custom subclass behavior -- pure configuration

## Running the Example

```bash
cd example_applications/embedded_editor
npm install
npx quack build && npx quack copy
```

Open `dist/index.html` in a browser, or use the hub page at `example_applications/index.html`.

## How It Works

The application creates a simple editor view with rich previews enabled:

```javascript
const _EmbeddedEditorConfiguration = (
{
	"ViewIdentifier": "EmbeddedEditor",
	"TargetElementAddress": "#EmbeddedEditorContainer",
	"ContentDataAddress": "AppData.Note.Segments",
	"ReadOnly": false,
	"EnableRichPreview": true
});
```

The initial content includes formatted meeting notes with a date, attendee list, and an action items segment with a task checklist.

## Use Case

This pattern is useful when you need a markdown editor as one component within a larger page -- for example:

- Note-taking fields in a form
- Comment editors in a review interface
- Description editors in a project management tool
- Inline documentation editors

The segmented nature lets users break their content into logical sections (like notes vs. action items) without needing the full toolbar of the main editor example.

## Key Files

| File | Purpose |
|------|---------|
| `EmbeddedEditor-Example-Application.js` | Application class with editor view and default note segments |
| `dist/index.html` | HTML page with a bordered editor container |
