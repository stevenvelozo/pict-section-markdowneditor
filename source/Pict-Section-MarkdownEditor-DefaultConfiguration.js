module.exports = (
{
	"DefaultRenderable": "MarkdownEditor-Wrap",
	"DefaultDestinationAddress": "#MarkdownEditor-Container-Div",

	"Templates":
	[
		{
			"Hash": "MarkdownEditor-Container",
			"Template": /*html*/`<div class="pict-mde" id="PictMDE-Container"></div>`
		},
		{
			"Hash": "MarkdownEditor-Segment",
			"Template": /*html*/`<div class="pict-mde-segment" id="PictMDE-Segment-{~D:Record.SegmentIndex~}" data-segment-index="{~D:Record.SegmentIndex~}">
	<div class="pict-mde-left-controls">
		<button type="button" class="pict-mde-left-btn pict-mde-left-btn-remove" onclick="{~D:Record.ViewIdentifier~}.removeSegment({~D:Record.SegmentIndex~})" title="Remove Segment">&times;</button>
		<div class="pict-mde-left-controls-bottom">
			<button type="button" class="pict-mde-left-btn pict-mde-left-btn-move" onclick="{~D:Record.ViewIdentifier~}.moveSegmentUp({~D:Record.SegmentIndex~})" title="Move Up">&uarr;</button>
			<button type="button" class="pict-mde-left-btn pict-mde-left-btn-linenums" onclick="{~D:Record.ViewIdentifier~}.toggleLineNumbers()" title="Toggle Line Numbers">1</button>
			<button type="button" class="pict-mde-left-btn pict-mde-left-btn-preview" onclick="{~D:Record.ViewIdentifier~}.toggleSegmentPreview({~D:Record.SegmentIndex~})" title="Toggle Preview">&#x25CE;</button>
			<button type="button" class="pict-mde-left-btn pict-mde-left-btn-move" onclick="{~D:Record.ViewIdentifier~}.moveSegmentDown({~D:Record.SegmentIndex~})" title="Move Down">&darr;</button>
		</div>
	</div>
	<div class="pict-mde-drag-handle" draggable="true" title="Drag to reorder"></div>
	<div class="pict-mde-segment-body">
		<div class="pict-mde-segment-editor" id="PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}"></div>
		<div class="pict-mde-image-preview" id="PictMDE-ImagePreview-{~D:Record.SegmentIndex~}"></div>
		<div class="pict-mde-rich-preview" id="PictMDE-RichPreview-{~D:Record.SegmentIndex~}"></div>
	</div>
	<div class="pict-mde-sidebar" id="PictMDE-Sidebar-{~D:Record.SegmentIndex~}">
		<div class="pict-mde-sidebar-actions">
			<button type="button" class="pict-mde-sidebar-btn" onclick="{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'bold')" title="Bold (Ctrl+B)"><b>B</b></button>
			<button type="button" class="pict-mde-sidebar-btn" onclick="{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'italic')" title="Italic (Ctrl+I)"><i>I</i></button>
			<button type="button" class="pict-mde-sidebar-btn" onclick="{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'code')" title="Inline Code (Ctrl+E)"><code>&lt;&gt;</code></button>
			<button type="button" class="pict-mde-sidebar-btn" onclick="{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'heading')" title="Heading">#</button>
			<button type="button" class="pict-mde-sidebar-btn" onclick="{~D:Record.ViewIdentifier~}.applyFormatting({~D:Record.SegmentIndex~}, 'link')" title="Link">[&thinsp;]</button>
			<button type="button" class="pict-mde-sidebar-btn pict-mde-sidebar-btn-image" onclick="{~D:Record.ViewIdentifier~}.openImagePicker({~D:Record.SegmentIndex~})" title="Insert Image">&#x25A3;</button>
		</div>
		<input type="file" accept="image/*" class="pict-mde-image-input" id="PictMDE-ImageInput-{~D:Record.SegmentIndex~}" style="display:none" />
	</div>
</div>`
		},
		{
			"Hash": "MarkdownEditor-AddSegment",
			"Template": /*html*/`<div class="pict-mde-add-segment">
	<button type="button" class="pict-mde-btn-add" onclick="{~D:Record.ViewIdentifier~}.addSegment()">+ Add Segment</button>
</div>`
		}
	],

	"Renderables":
	[
		{
			"RenderableHash": "MarkdownEditor-Wrap",
			"TemplateHash": "MarkdownEditor-Container",
			"DestinationAddress": "#MarkdownEditor-Container-Div"
		}
	],

	"TargetElementAddress": "#MarkdownEditor-Container-Div",

	// Address in AppData to read/write the segments array
	// The data at this address should be an array of objects, each with a "Content" property
	// e.g. AppData.Document.Segments = [ { Content: "# Hello" }, { Content: "Some text" } ]
	"ContentDataAddress": false,

	// Whether the editor should be read-only
	"ReadOnly": false,

	// Whether to show rich content previews (rendered markdown with syntax-highlighted
	// code, mermaid diagrams, KaTeX equations, tables, etc. via pict-section-content).
	// Requires the consumer to load the mermaid and/or katex libraries via CDN
	// for diagram/equation rendering; code highlighting works without CDN scripts.
	"EnableRichPreview": true,

	// CSS for the markdown editor
	"CSS": /*css*/`
/* ---- Container ---- */
.pict-mde
{
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	font-size: 14px;
}

/* ---- Segment row: left-controls | drag-handle | editor body | sidebar ---- */
.pict-mde-segment
{
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: stretch;
	margin-bottom: 6px;
	min-height: 48px;
	transition: background-color 0.15s ease;
}

/* ---- Left controls (✕ top, ↑↓ bottom) ---- */
.pict-mde-left-controls
{
	flex: 0 0 22px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 2px 0;
}
.pict-mde-left-btn-remove
{
	position: sticky;
	top: 2px;
	z-index: 2;
}
.pict-mde-left-controls-bottom
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
	position: sticky;
	bottom: 2px;
	z-index: 2;
}
.pict-mde-left-btn
{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 12px;
	padding: 0;
	color: #888;
	line-height: 1;
	font-family: inherit;
	opacity: 0;
	transition: opacity 0.15s ease;
}
.pict-mde-segment:hover .pict-mde-left-btn,
.pict-mde-segment.pict-mde-active .pict-mde-left-btn
{
	opacity: 1;
}
.pict-mde-left-btn:hover
{
	color: #222;
}
.pict-mde-left-btn-remove:hover
{
	color: #CC3333;
}
.pict-mde-left-btn-linenums
{
	font-size: 11px;
	font-weight: 600;
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;
}
/* Highlight when line numbers are active */
.pict-mde.pict-mde-linenums-on .pict-mde-left-btn-linenums
{
	color: #4A90D9;
}
.pict-mde-left-btn-preview
{
	font-size: 11px;
}
/* Highlight the preview button when preview is visible (not hidden) */
.pict-mde-segment:not(.pict-mde-preview-hidden) .pict-mde-left-btn-preview
{
	color: #4A90D9;
}
/* Dim preview button when this segment's preview is individually hidden */
.pict-mde-segment.pict-mde-preview-hidden .pict-mde-left-btn-preview
{
	color: #CCC;
}

/* ---- Drag handle (simple grey bar) ---- */
.pict-mde-drag-handle
{
	flex: 0 0 8px;
	cursor: grab;
	background: #EDEDED;
	transition: background-color 0.15s ease;
	user-select: none;
}
.pict-mde-drag-handle:active
{
	cursor: grabbing;
}
.pict-mde-drag-handle:hover
{
	background: #C8C8C8;
}

/* ---- Editor body (middle column) ---- */
.pict-mde-segment-body
{
	flex: 1 1 auto;
	min-width: 0;
	background: #FFFFFF;
	transition: background-color 0.15s ease;
}
.pict-mde-segment-editor
{
	min-height: 48px;
}

/* ---- Image preview area below the editor ---- */
.pict-mde-image-preview
{
	display: none;
}
.pict-mde-image-preview.pict-mde-has-images
{
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	padding: 8px 12px;
	border-top: 1px solid #EDEDED;
}
.pict-mde-image-preview img
{
	max-width: 200px;
	max-height: 150px;
	border-radius: 3px;
	border: 1px solid #E0E0E0;
	object-fit: contain;
	background: #F8F8F8;
}
.pict-mde-image-preview-item
{
	position: relative;
	display: inline-block;
}
.pict-mde-image-preview-label
{
	display: block;
	font-size: 10px;
	color: #999;
	margin-top: 2px;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* ---- Rich content preview area (rendered via pict-section-content) ---- */
.pict-mde-rich-preview
{
	display: none;
}
.pict-mde-rich-preview.pict-mde-has-rich-preview
{
	display: block;
	border-top: 1px solid #EDEDED;
	background: #FCFCFC;
}
/* Global preview toggle: hide all previews when container has class */
.pict-mde.pict-mde-previews-hidden .pict-mde-rich-preview.pict-mde-has-rich-preview,
.pict-mde.pict-mde-previews-hidden .pict-mde-image-preview.pict-mde-has-images
{
	display: none;
}
/* Per-segment preview toggle: hide previews for a specific segment */
.pict-mde-segment.pict-mde-preview-hidden .pict-mde-rich-preview.pict-mde-has-rich-preview,
.pict-mde-segment.pict-mde-preview-hidden .pict-mde-image-preview.pict-mde-has-images
{
	display: none;
}
/* Constrain the pict-content inside the preview to fit the segment */
.pict-mde-rich-preview .pict-content
{
	padding: 12px;
	max-width: none;
	margin: 0;
	font-size: 13px;
}
/* Reduce heading sizes in the preview to be proportional */
.pict-mde-rich-preview .pict-content h1
{
	font-size: 1.4em;
	margin-top: 0;
}
.pict-mde-rich-preview .pict-content h2
{
	font-size: 1.2em;
	margin-top: 0.75em;
}
.pict-mde-rich-preview .pict-content h3
{
	font-size: 1.1em;
	margin-top: 0.6em;
}

/* ---- Rendered view (full document preview mode) ---- */
.pict-mde-rendered-view
{
	padding: 16px 20px;
	background: #FFFFFF;
	min-height: 120px;
}
.pict-mde-rendered-view .pict-content
{
	max-width: none;
	margin: 0;
}
/* Hide the add-segment button in rendered mode */
.pict-mde.pict-mde-rendered-mode .pict-mde-add-segment
{
	display: none;
}

/* Focused / active editor gets subtle warm background */
.pict-mde-segment.pict-mde-active .pict-mde-segment-body
{
	background: #FAFAF5;
}
.pict-mde-segment.pict-mde-active .pict-mde-drag-handle
{
	background: #9CB4C8;
}

/* ---- Right sidebar (formatting buttons) ---- */
.pict-mde-sidebar
{
	flex: 0 0 30px;
	display: flex;
	align-items: flex-start;
	position: relative;
}

.pict-mde-sidebar-actions
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
	padding: 4px 0;
	width: 100%;
	opacity: 0;
	transition: opacity 0.15s ease, top 0.1s ease;
	position: sticky;
	top: 0;
}
/* Active segment always shows its sidebar */
.pict-mde-segment.pict-mde-active .pict-mde-sidebar-actions
{
	opacity: 1;
}
/* When no segment is active, hovering shows both left + right controls */
.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-sidebar-actions
{
	opacity: 1;
}
/* When JS sets a cursor-relative offset, switch from sticky to absolute positioning */
.pict-mde-sidebar-actions.pict-mde-sidebar-at-cursor
{
	position: absolute;
	top: var(--pict-mde-sidebar-top, 0px);
}

.pict-mde-sidebar-btn
{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 22px;
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 12px;
	padding: 0;
	border-radius: 3px;
	color: #666;
	line-height: 1;
	font-family: inherit;
}
.pict-mde-sidebar-btn:hover
{
	color: #222;
}
.pict-mde-sidebar-btn b
{
	font-size: 13px;
	font-weight: 700;
}
.pict-mde-sidebar-btn i
{
	font-size: 13px;
	font-style: italic;
}
.pict-mde-sidebar-btn code
{
	font-size: 10px;
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;
}

/* ---- Add segment button ---- */
.pict-mde-add-segment
{
	margin-top: 6px;
	padding-left: 30px;
}
.pict-mde-btn-add
{
	display: block;
	width: 100%;
	padding: 7px;
	border: 2px dashed #D0D0D0;
	border-radius: 4px;
	background: transparent;
	color: #999;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.15s ease;
}
.pict-mde-btn-add:hover
{
	border-color: #4A90D9;
	color: #4A90D9;
	background: rgba(74, 144, 217, 0.04);
}

/* ---- Image drag-over indicator ---- */
.pict-mde-segment-editor.pict-mde-image-dragover
{
	outline: 2px dashed #4A90D9;
	outline-offset: -2px;
}

/* ---- Drag-in-progress: prevent CodeMirror from intercepting drop events ---- */
.pict-mde.pict-mde-dragging .pict-mde-segment-editor
{
	pointer-events: none;
}

/* ---- Drop target indicators for drag reorder ---- */
.pict-mde-segment.pict-mde-drag-over-top
{
	box-shadow: 0 -2px 0 0 #4A90D9;
}
.pict-mde-segment.pict-mde-drag-over-bottom
{
	box-shadow: 0 2px 0 0 #4A90D9;
}

/* ---- CodeMirror overrides inside segments ---- */
.pict-mde-segment-editor .cm-editor
{
	border: none;
}
.pict-mde-segment-editor .cm-editor .cm-scroller
{
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
	font-size: 14px;
	line-height: 1.6;
}
.pict-mde-segment-editor .cm-editor.cm-focused
{
	outline: none;
}
.pict-mde-segment-editor .cm-editor .cm-content
{
	padding: 8px 12px;
	min-height: 36px;
}
.pict-mde-segment-editor .cm-editor .cm-gutters
{
	background: #F8F8F8;
	border-right: 1px solid #E8E8E8;
	color: #BBB;
}

/* ---- Collapsed data URI widget ---- */
.pict-mde-data-uri-collapsed
{
	display: inline;
	background: #F0F0F0;
	color: #888;
	font-size: 11px;
	padding: 1px 4px;
	border-radius: 3px;
	border: 1px solid #E0E0E0;
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;
	cursor: default;
	white-space: nowrap;
}

/* ---- Line number toggle: hidden by default, shown when class present ---- */
.pict-mde .cm-editor .cm-gutters
{
	display: none;
}
.pict-mde.pict-mde-linenums-on .cm-editor .cm-gutters
{
	display: flex;
}
`
});
