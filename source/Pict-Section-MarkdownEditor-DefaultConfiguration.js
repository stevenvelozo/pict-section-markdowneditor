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
		<div class="pict-mde-quadrant-tl"></div>
		<div class="pict-mde-quadrant-bl"></div>
	</div>
	<div class="pict-mde-drag-handle" draggable="true" title="Drag to reorder"></div>
	<div class="pict-mde-segment-body">
		<div class="pict-mde-segment-editor" id="PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}"></div>
		<div class="pict-mde-image-preview" id="PictMDE-ImagePreview-{~D:Record.SegmentIndex~}"></div>
		<div class="pict-mde-rich-preview" id="PictMDE-RichPreview-{~D:Record.SegmentIndex~}"></div>
	</div>
	<div class="pict-mde-sidebar" id="PictMDE-Sidebar-{~D:Record.SegmentIndex~}">
		<div class="pict-mde-quadrant-tr"></div>
		<div class="pict-mde-quadrant-br"></div>
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

	// ---- Quadrant button definitions ----
	// Each quadrant is an array of button objects:
	//   HTML   — innerHTML for the button
	//   Action — method name, optionally "method:arg" (receives segment index as first param)
	//   Class  — additional CSS class(es) appended to the base class
	//   Title  — tooltip text
	//
	// Consumers can override any quadrant to add, remove, or reorder buttons.
	// Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
	// Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.

	"ButtonsTL":
	[
		{ "HTML": "&times;", "Action": "removeSegment", "Class": "pict-mde-btn-remove", "Title": "Remove Segment" }
	],

	"ButtonsBL":
	[
		{ "HTML": "&uarr;", "Action": "moveSegmentUp", "Class": "pict-mde-btn-move", "Title": "Move Up" },
		{ "HTML": "&darr;", "Action": "moveSegmentDown", "Class": "pict-mde-btn-move", "Title": "Move Down" },
		{ "HTML": "&#x229E;", "Action": "toggleControls", "Class": "pict-mde-btn-linenums", "Title": "Toggle Controls" },
		{ "HTML": "&#x25CE;", "Action": "toggleSegmentPreview", "Class": "pict-mde-btn-preview", "Title": "Toggle Preview" }
	],

	"ButtonsTR":
	[
		{ "HTML": "<b>B</b>", "Action": "applyFormatting:bold", "Class": "", "Title": "Bold (Ctrl+B)" },
		{ "HTML": "<i>I</i>", "Action": "applyFormatting:italic", "Class": "", "Title": "Italic (Ctrl+I)" },
		{ "HTML": "<code>&lt;&gt;</code>", "Action": "applyFormatting:code", "Class": "", "Title": "Inline Code (Ctrl+E)" },
		{ "HTML": "#", "Action": "applyFormatting:heading", "Class": "", "Title": "Heading" },
		{ "HTML": "[&thinsp;]", "Action": "applyFormatting:link", "Class": "", "Title": "Link" },
		{ "HTML": "&#x25A3;", "Action": "openImagePicker", "Class": "pict-mde-sidebar-btn-image", "Title": "Insert Image" }
	],

	"ButtonsBR":
	[
	],

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

/* ---- Left controls column ---- */
.pict-mde-left-controls
{
	flex: 0 0 22px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 2px 0;
}

/* ---- Left-side quadrants ---- */
.pict-mde-quadrant-tl
{
	display: flex;
	flex-direction: column;
	align-items: center;
	position: sticky;
	top: 2px;
	z-index: 2;
}
.pict-mde-quadrant-bl
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
	position: sticky;
	bottom: 2px;
	z-index: 2;
}

/* ---- Left-side buttons (shared base) ---- */
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
.pict-mde-btn-remove:hover
{
	color: #CC3333;
}
.pict-mde-btn-linenums
{
	font-size: 11px;
	font-weight: 600;
	font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', monospace;
}
/* Highlight when controls are active */
.pict-mde.pict-mde-controls-on .pict-mde-btn-linenums
{
	color: #4A90D9;
}
.pict-mde-btn-preview
{
	font-size: 11px;
}
/* Highlight the preview button when preview is visible (not hidden) */
.pict-mde-segment:not(.pict-mde-preview-hidden) .pict-mde-btn-preview
{
	color: #4A90D9;
}
/* Dim preview button when this segment's preview is individually hidden */
.pict-mde-segment.pict-mde-preview-hidden .pict-mde-btn-preview
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
	flex: 1 1 0%;
	min-width: 0;
	overflow: hidden;
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
	overflow: hidden;
}
/* Constrain images in the rich preview even if pict-section-content CSS loads late */
.pict-mde-rich-preview img
{
	max-width: 100%;
	height: auto;
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

/* ---- Right sidebar column ---- */
.pict-mde-sidebar
{
	flex: 0 0 30px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	position: relative;
}

/* ---- Right-side quadrants ---- */
.pict-mde-quadrant-tr
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
.pict-mde-quadrant-br
{
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1px;
	padding: 4px 0;
	width: 100%;
	opacity: 0;
	transition: opacity 0.15s ease;
	position: sticky;
	bottom: 0;
}

/* Active segment always shows its right-side quadrants */
.pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,
.pict-mde-segment.pict-mde-active .pict-mde-quadrant-br
{
	opacity: 1;
}
/* When no segment is active, hovering shows both left + right controls */
.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-tr,
.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-br
{
	opacity: 1;
}

/* ---- Controls-hidden mode: right quadrants show faintly on hover ---- */
.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-tr,
.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-br
{
	opacity: 0;
}
.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-tr,
.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-br
{
	opacity: 0.3;
}
.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,
.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-br
{
	opacity: 0.3;
}

/* When JS sets a cursor-relative offset, switch TR from sticky to absolute positioning */
.pict-mde-quadrant-tr.pict-mde-sidebar-at-cursor
{
	position: absolute;
	top: var(--pict-mde-sidebar-top, 0px);
}

/* ---- Right-side buttons (shared base) ---- */
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

/* ---- Line number / controls toggle: gutters hidden by default ---- */
.pict-mde .cm-editor .cm-gutters
{
	display: none;
}
.pict-mde.pict-mde-controls-on .cm-editor .cm-gutters
{
	display: flex;
}

/* ============================================
   RESPONSIVE: Tablet / Phone (max-width: 768px)
   ============================================ */
@media (max-width: 768px)
{
	/* Prevent any horizontal overflow in the editor */
	.pict-mde
	{
		overflow-x: hidden;
		max-width: 100%;
	}

	/* Reduce the left controls column width */
	.pict-mde-left-controls
	{
		flex: 0 0 16px;
	}
	.pict-mde-left-btn
	{
		width: 16px;
		height: 18px;
		font-size: 10px;
	}

	/* Make left-side buttons always visible on touch (no hover) */
	.pict-mde-left-btn
	{
		opacity: 0.6;
	}

	/* Narrow the drag handle */
	.pict-mde-drag-handle
	{
		flex: 0 0 5px;
	}

	/* Shrink the right sidebar column */
	.pict-mde-sidebar
	{
		flex: 0 0 24px;
	}
	.pict-mde-sidebar-btn
	{
		width: 20px;
		height: 20px;
		font-size: 11px;
	}

	/* Make right sidebar buttons always visible (touch devices) */
	.pict-mde-quadrant-tr,
	.pict-mde-quadrant-br
	{
		opacity: 0.7;
	}
	.pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,
	.pict-mde-segment.pict-mde-active .pict-mde-quadrant-br
	{
		opacity: 1;
	}

	/* Reduce CodeMirror content padding */
	.pict-mde-segment-editor .cm-editor .cm-content
	{
		padding: 6px 6px;
	}

	/* Reduce font size slightly for more content on screen */
	.pict-mde-segment-editor .cm-editor .cm-scroller
	{
		font-size: 13px;
	}

	/* Add segment button: reduce left margin */
	.pict-mde-add-segment
	{
		padding-left: 21px;
	}

	/* Rich preview: less padding */
	.pict-mde-rich-preview .pict-content
	{
		padding: 8px;
		font-size: 12px;
	}

	/* Image previews: smaller max dimensions */
	.pict-mde-image-preview img
	{
		max-width: 120px;
		max-height: 100px;
	}

	/* Rendered view: less padding */
	.pict-mde-rendered-view
	{
		padding: 10px 8px;
	}
}

/* ============================================
   RESPONSIVE: Small phone (max-width: 480px)
   ============================================ */
@media (max-width: 480px)
{
	/* Wrap segment so left controls flow to the top as a horizontal bar */
	.pict-mde-segment
	{
		flex-wrap: wrap;
	}

	/* Left controls become a horizontal toolbar at the top of the segment */
	.pict-mde-left-controls
	{
		flex: 0 0 100%;
		flex-direction: row;
		justify-content: flex-start;
		gap: 2px;
		padding: 3px 4px;
		order: -1;
		background: #F5F5F5;
		border-bottom: 1px solid #EDEDED;
	}
	.pict-mde-left-btn
	{
		width: 24px;
		height: 24px;
		font-size: 12px;
		opacity: 0.7;
	}

	/* Left quadrants flow horizontally */
	.pict-mde-quadrant-tl,
	.pict-mde-quadrant-bl
	{
		flex-direction: row;
		gap: 2px;
		position: static;
	}

	/* Segment body: explicit basis so it fills the wrapped row */
	.pict-mde-segment-body
	{
		flex: 1 1 calc(100% - 20px);
	}

	/* Hide drag handle on very small screens */
	.pict-mde-drag-handle
	{
		display: none;
	}

	/* Right sidebar: further shrink */
	.pict-mde-sidebar
	{
		flex: 0 0 20px;
	}
	.pict-mde-sidebar-btn
	{
		width: 18px;
		height: 18px;
		font-size: 10px;
	}

	/* Add segment: no left offset since controls are at top */
	.pict-mde-add-segment
	{
		padding-left: 0;
	}

	/* Even tighter CodeMirror padding */
	.pict-mde-segment-editor .cm-editor .cm-content
	{
		padding: 4px 4px;
	}
}
`
});
