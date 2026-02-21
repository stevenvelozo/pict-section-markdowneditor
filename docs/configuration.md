# Configuration

The markdown editor is configured through a view options object passed to `pict.addView()`. All options have sensible defaults and can be overridden individually.

## Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ViewIdentifier` | string | -- | Unique identifier for this view instance |
| `TargetElementAddress` | string | `"#MarkdownEditor-Container-Div"` | CSS selector for the container element |
| `ContentDataAddress` | string/false | `false` | Fable manifest path to the segments array (e.g., `"AppData.Document.Segments"`) |
| `ReadOnly` | boolean | `false` | Disable editing when true |
| `EnableRichPreview` | boolean | `true` | Show rendered markdown preview below each segment |

### ContentDataAddress

The `ContentDataAddress` must point to an array of objects in AppData, where each object has a `Content` property containing the markdown string:

```javascript
// In your application's DefaultAppData:
{
	"Document":
	{
		"Segments":
		[
			{ "Content": "# First Segment\n\nHello world." },
			{ "Content": "## Second Segment\n\nMore content here." }
		]
	}
}

// View config:
{
	"ContentDataAddress": "AppData.Document.Segments"
}
```

## Rendering Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DefaultRenderable` | string | `"MarkdownEditor-Wrap"` | Template name for the outer container |
| `DefaultDestinationAddress` | string | `"#MarkdownEditor-Container-Div"` | Where the outer container renders |

## Button Quadrants

Each segment has four button quadrants that can be customized. Each quadrant is an array of button objects.

### Button Object Structure

```javascript
{
	"HTML": "<b>B</b>",           // innerHTML for the button
	"Action": "applyFormatting:bold",  // Method name, with optional :argument
	"Class": "my-custom-class",   // Additional CSS class(es)
	"Title": "Bold (Ctrl+B)"     // Tooltip text
}
```

When the `Action` string contains a colon, the part after the colon is passed as a second argument. For example, `"applyFormatting:bold"` calls `applyFormatting(segmentIndex, 'bold')`.

### Default Button Configuration

**ButtonsTL** (top-left -- segment removal):
```javascript
[
	{ "HTML": "&times;", "Action": "removeSegment", "Class": "", "Title": "Remove segment" }
]
```

**ButtonsBL** (bottom-left -- navigation and toggles):
```javascript
[
	{ "HTML": "&uarr;",  "Action": "moveSegmentUp",     "Class": "", "Title": "Move up" },
	{ "HTML": "&darr;",  "Action": "moveSegmentDown",   "Class": "", "Title": "Move down" },
	{ "HTML": "1",       "Action": "toggleControls",    "Class": "", "Title": "Toggle line numbers" },
	{ "HTML": "&#9711;", "Action": "toggleSegmentPreview", "Class": "", "Title": "Toggle preview" }
]
```

**ButtonsTR** (top-right -- formatting, follows cursor):
```javascript
[
	{ "HTML": "<b>B</b>", "Action": "applyFormatting:bold",    "Class": "", "Title": "Bold" },
	{ "HTML": "<i>I</i>", "Action": "applyFormatting:italic",  "Class": "", "Title": "Italic" },
	{ "HTML": "&lt;&gt;", "Action": "applyFormatting:code",    "Class": "", "Title": "Inline code" },
	{ "HTML": "#",         "Action": "applyFormatting:heading", "Class": "", "Title": "Heading" },
	{ "HTML": "[&middot;]","Action": "applyFormatting:link",   "Class": "", "Title": "Link" },
	{ "HTML": "&#9635;",   "Action": "openImagePicker",       "Class": "", "Title": "Insert image" }
]
```

**ButtonsBR** (bottom-right -- empty by default):
```javascript
[]
```

### Custom Buttons

To add a custom button, define the action method on your subclass and include the button in the configuration:

```javascript
class MyEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	insertTimestamp(pSegmentIndex)
	{
		let tmpTimestamp = new Date().toISOString();
		this.setSegmentContent(pSegmentIndex,
			this.getSegmentContent(pSegmentIndex) + '\n\n' + tmpTimestamp);
	}
}

const _Config = (
{
	"ViewIdentifier": "MyEditor",
	"TargetElementAddress": "#EditorContainer",
	"ContentDataAddress": "AppData.Document.Segments",
	"ButtonsBR":
	[
		{ "HTML": "&#128339;", "Action": "insertTimestamp", "Class": "", "Title": "Insert timestamp" }
	]
});
```

## Templates

The editor uses three templates that can be overridden in the `Templates` array:

| Template Hash | Purpose |
|---------------|---------|
| `MarkdownEditor-Container` | Outer container for all segments |
| `MarkdownEditor-Segment` | Individual segment layout (drag handle, quadrants, editor, previews) |
| `MarkdownEditor-AddSegment` | The "Add Segment" button at the bottom |

To override a template, provide a `Templates` array in your view configuration with objects matching the hash you want to replace.

## CSS

The editor injects its own CSS (approximately 575 lines) covering the full segment layout, quadrant positioning, drag indicators, preview areas, and CodeMirror integration. The CSS is injected via `pict.CSSMap.addCSS()` during initialization.

Key CSS classes you can override:

| Class | Purpose |
|-------|---------|
| `.pict-mde` | Main editor container |
| `.pict-mde-segment` | Individual segment row |
| `.pict-mde-active` | Active (focused) segment |
| `.pict-mde-drag-over-top` | Drop indicator above a segment |
| `.pict-mde-drag-over-bottom` | Drop indicator below a segment |
| `.pict-mde-image-dragover` | Image drag-over highlight |
| `.pict-mde-preview-hidden` | Per-segment preview hidden |
| `.pict-mde-previews-hidden` | Global preview hidden |
| `.pict-mde-controls-on` | Line numbers visible |
| `.pict-mde-rendered-mode` | Full-document preview mode |
