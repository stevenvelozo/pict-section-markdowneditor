# API Reference

`PictSectionMarkdownEditor` extends `PictView` and provides the following public API.

## CodeMirror Integration

### `connectCodeMirrorModules(pCodeMirrorModules)`

Provide the CodeMirror v6 modules the editor needs. If not called, the editor will attempt to use `window.CodeMirrorModules`.

**Parameters:**
- `pCodeMirrorModules` -- Object with `EditorView` (function), `EditorState` (function), and optionally `extensions` (array), `Decoration`, `ViewPlugin`, `WidgetType`

**Returns:** `true` if modules were accepted, `false` if validation failed.

```javascript
view.connectCodeMirrorModules({
	EditorView: EditorView,
	EditorState: EditorState,
	extensions: [basicSetup, markdown()],
	Decoration: Decoration,
	ViewPlugin: ViewPlugin,
	WidgetType: WidgetType
});
```

The `Decoration`, `ViewPlugin`, and `WidgetType` exports enable the data URI collapse extension. If omitted, long base64 image URIs will display in full.

## Segment Management

### `addSegment(pContent)`

Add a new segment at the end of the document.

**Parameters:**
- `pContent` (string, optional) -- Initial markdown content. Defaults to empty string.

### `removeSegment(pSegmentIndex)`

Remove the segment at the given logical index.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment to remove.

### `moveSegmentUp(pSegmentIndex)`

Swap the segment at `pSegmentIndex` with the one above it.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment to move.

### `moveSegmentDown(pSegmentIndex)`

Swap the segment at `pSegmentIndex` with the one below it.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment to move.

### `getSegmentContent(pLogicalIndex)`

Get the markdown content of a segment.

**Parameters:**
- `pLogicalIndex` (number) -- Logical index of the segment.

**Returns:** String content of the segment, or `null` if out of range.

### `setSegmentContent(pLogicalIndex, pContent)`

Replace the content of a segment.

**Parameters:**
- `pLogicalIndex` (number) -- Logical index of the segment.
- `pContent` (string) -- New markdown content.

### `getSegmentCount()`

**Returns:** Number of segments currently in the editor.

### `getAllContent(pSeparator)`

Combine all segment content into a single string.

**Parameters:**
- `pSeparator` (string, optional) -- Separator between segments. Defaults to `"\n\n"`.

**Returns:** Combined markdown string.

## Formatting

### `applyFormatting(pSegmentIndex, pFormatType)`

Apply markdown formatting to the current selection in a segment.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment.
- `pFormatType` (string) -- One of: `'bold'`, `'italic'`, `'code'`, `'heading'`, `'link'`.

**Behavior:**
- `'bold'` -- Wraps selection with `**` (toggles if already wrapped)
- `'italic'` -- Wraps selection with `*`
- `'code'` -- Wraps selection with `` ` ``
- `'heading'` -- Prefixes line with `# ` (toggles)
- `'link'` -- Wraps selection as `[text](url)`

If no text is selected, inserts the formatting markers and places the cursor between them.

## Image Handling

### `openImagePicker(pSegmentIndex)`

Open a file picker dialog for image selection. The selected image is processed through `_processImageFile()`.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment to insert the image into.

### `onImageUpload(pFile, pSegmentIndex, fCallback)`

**Override this method** to handle server-side image uploads. By default, this method does nothing and returns `false`, causing the editor to fall back to base64 data URI encoding.

**Parameters:**
- `pFile` (File) -- The image File object from the browser.
- `pSegmentIndex` (number) -- The segment index where the image will be inserted.
- `fCallback` (function) -- Callback to invoke when upload completes: `fCallback(pError, pURL)`.

**Returns:** `true` if your code handles the upload asynchronously, `false` to use the default base64 behavior.

See the [Image Upload Guide](image_upload.md) for a complete integration walkthrough.

## View Toggles

### `togglePreview(pVisible)`

Toggle the global rich preview visibility for all segments.

**Parameters:**
- `pVisible` (boolean, optional) -- Force visible (`true`) or hidden (`false`). Omit to toggle.

### `toggleSegmentPreview(pSegmentIndex, pVisible)`

Toggle the rich preview for a single segment.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the segment.
- `pVisible` (boolean, optional) -- Force visible or hidden. Omit to toggle.

### `toggleControls(pSegmentIndexOrVisible, pVisible)`

Toggle line numbers and sidebar control visibility.

**Parameters:**
- `pSegmentIndexOrVisible` (number/boolean) -- If boolean, toggles globally. If number, toggles for the given segment index.
- `pVisible` (boolean, optional) -- Used when first argument is a segment index.

### `toggleLineNumbers(pVisible)`

Backward-compatible alias for `toggleControls()`.

### `toggleRenderedView(pRendered)`

Switch between the segmented editing mode and a full-document rendered preview.

**Parameters:**
- `pRendered` (boolean, optional) -- Force rendered (`true`) or editing (`false`). Omit to toggle.

### `setReadOnly(pReadOnly)`

Enable or disable read-only mode at runtime.

**Parameters:**
- `pReadOnly` (boolean) -- `true` to disable editing, `false` to enable.

## Data Management

### `marshalFromView()`

Sync all CodeMirror editor content back to the AppData segments array at `ContentDataAddress`. Called automatically on content changes, but can be triggered manually when you need to read the latest data.

## Lifecycle Hooks

These methods are designed to be overridden in subclasses.

### `customConfigureExtensions(pExtensions, pSegmentIndex)`

Customize the CodeMirror extensions array before a segment editor is created.

**Parameters:**
- `pExtensions` (array) -- The extensions array to modify in place.
- `pSegmentIndex` (number) -- The segment index being configured.

### `onContentChange(pSegmentIndex, pContent)`

Called whenever a segment's content changes.

**Parameters:**
- `pSegmentIndex` (number) -- Logical index of the changed segment.
- `pContent` (string) -- The new content of the segment.

### `onImageUpload(pFile, pSegmentIndex, fCallback)`

Called when an image is pasted, dragged, or picked. Override to handle server-side uploads. See [Image Upload](image_upload.md).

## Destruction

### `destroy()`

Clean up all CodeMirror editor instances, timers, and DOM elements. Call this before removing the view from the application.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `initialRenderComplete` | boolean | Whether the initial render has completed |
| `options.ReadOnly` | boolean | Current read-only state |
| `options.EnableRichPreview` | boolean | Whether rich previews are enabled |
| `options.ContentDataAddress` | string | Fable manifest path to the segments array |
