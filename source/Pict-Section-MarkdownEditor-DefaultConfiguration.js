module.exports = (
{
	"DefaultRenderable": "MarkdownEditor-Wrap",
	"DefaultDestinationAddress": "#MarkdownEditor-Container-Div",

	"Templates":
	[
		{
			"Hash": "MarkdownEditor-Container",
			"Template": /*html*/`<div class="pict-mde" id="PictMDE-{~D:Record.Hash~}"></div>`
		},
		{
			"Hash": "MarkdownEditor-Segment",
			"Template": /*html*/`<div class="pict-mde-segment" id="PictMDE-Segment-{~D:Record.SegmentIndex~}" data-segment-index="{~D:Record.SegmentIndex~}">
	<div class="pict-mde-segment-toolbar">
		<span class="pict-mde-segment-label">Segment {~D:Record.SegmentDisplayIndex~}</span>
		<div class="pict-mde-segment-actions">
			<button type="button" class="pict-mde-btn pict-mde-btn-move-up" onclick="{~D:Record.ViewIdentifier~}.moveSegmentUp({~D:Record.SegmentIndex~})" title="Move Up">&uarr;</button>
			<button type="button" class="pict-mde-btn pict-mde-btn-move-down" onclick="{~D:Record.ViewIdentifier~}.moveSegmentDown({~D:Record.SegmentIndex~})" title="Move Down">&darr;</button>
			<button type="button" class="pict-mde-btn pict-mde-btn-remove" onclick="{~D:Record.ViewIdentifier~}.removeSegment({~D:Record.SegmentIndex~})" title="Remove Segment">&times;</button>
		</div>
	</div>
	<div class="pict-mde-segment-editor" id="PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}"></div>
</div>`
		},
		{
			"Hash": "MarkdownEditor-AddSegment",
			"Template": /*html*/`<div class="pict-mde-add-segment">
	<button type="button" class="pict-mde-btn pict-mde-btn-add" onclick="{~D:Record.ViewIdentifier~}.addSegment()">+ Add Segment</button>
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

	// CSS for the markdown editor
	"CSS": /*css*/`.pict-mde
{
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	font-size: 14px;
}
.pict-mde-segment
{
	position: relative;
	margin-bottom: 12px;
	border: 1px solid #D0D0D0;
	border-radius: 6px;
	background: #FFFFFF;
	transition: border-color 0.15s ease;
}
.pict-mde-segment:focus-within
{
	border-color: #4A90D9;
	box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.15);
}
.pict-mde-segment-toolbar
{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 8px;
	background: #F5F5F5;
	border-bottom: 1px solid #E0E0E0;
	border-radius: 6px 6px 0 0;
	min-height: 28px;
}
.pict-mde-segment-label
{
	font-size: 11px;
	font-weight: 600;
	color: #888;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	user-select: none;
}
.pict-mde-segment-actions
{
	display: flex;
	gap: 2px;
}
.pict-mde-btn
{
	border: none;
	background: transparent;
	cursor: pointer;
	font-size: 13px;
	padding: 2px 6px;
	border-radius: 3px;
	color: #666;
	line-height: 1;
}
.pict-mde-btn:hover
{
	background: #E0E0E0;
	color: #333;
}
.pict-mde-btn-remove:hover
{
	background: #FFDDDD;
	color: #CC3333;
}
.pict-mde-btn-add
{
	display: block;
	width: 100%;
	padding: 8px;
	border: 2px dashed #D0D0D0;
	border-radius: 6px;
	background: transparent;
	color: #888;
	font-size: 13px;
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
.pict-mde-add-segment
{
	margin-top: 8px;
}
.pict-mde-segment-editor
{
	min-height: 60px;
}
.pict-mde-segment-editor .cm-editor
{
	border: none;
	border-radius: 0 0 6px 6px;
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
	min-height: 40px;
}
.pict-mde-segment-editor .cm-editor .cm-gutters
{
	background: #F8F8F8;
	border-right: 1px solid #E8E8E8;
	color: #BBB;
}
`
});
