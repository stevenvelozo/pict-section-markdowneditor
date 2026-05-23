# Embedded Editor — Markdown Editing as a Page Widget

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/embedded%5Feditor/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

The minimal-viable embedded use of `pict-section-markdowneditor` — the
editor mounted inside a bordered card on an otherwise ordinary page,
the way a notes field, a comment box, or a structured-content textarea
replacement would be. There is no toolbar above the editor and no
ambient page chrome around it; the surrounding page styles its own
"window-frame" container with three traffic-light dots and a `notes.md`
label, and the editor renders inside that container exactly as if it
were a textarea.

The application file is sixty lines including seed content. The same
configuration shape as the standalone Markdown Editor example, the same
empty subclass, the same `ContentDataAddress` binding — but the target
element is a small `<div>` inside a card rather than a full-page
container. This is the pattern to copy when you are adding a markdown
field to an existing page, not building a markdown app.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Editor mounted inside an arbitrary host container | `"TargetElementAddress": "#EmbeddedEditorContainer"` |
| Multiple seed segments with mixed content | Two `AppData.Note.Segments` entries — a meeting-notes header and a task checklist |
| GitHub-Flavored Markdown task lists in seed data | `- [ ] Alice: Draft the proposal by Friday` |
| Rich-preview default behaviour | `EnableRichPreview: true` renders the checklist and the header beneath each segment |
| Theme-cascade-friendly card chrome | The host CSS uses `var(--theme-color-background-panel, #fff)` so the card respects a Pict theme |
| Zero JavaScript outside the application bootstrap | The page shell contains no event handlers; everything works via defaults |
| Direct AppData write-back on every keystroke | Editing either segment updates `AppData.Note.Segments[*].Content` automatically |

## Key files

- `EmbeddedEditor-Example-Application.js` — application class, view
  subclass, view configuration, and `DefaultAppData` with two seed
  segments. Sixty lines total.
- `html/index.html` — page shell with a `.editor-widget` card that
  contains the three "traffic-light" dot ornaments, the filename label,
  and the `#EmbeddedEditorContainer` mount point.

## The data model

Two seed segments at `AppData.Note.Segments`. Identical schema to the
other examples — the editor never cares about the path; only the value
at the path being an array of `{ Content }` records:

```js
"Note":
{
    "Segments":
    [
        {
            "Content": "**Meeting Notes** — February 21, 2026\n\nAttendees: Alice, Bob, Charlie\n\n---\n\nDiscussed the Q1 roadmap and agreed on priorities."
        },
        {
            "Content": "## Action Items\n\n- [ ] Alice: Draft the proposal by Friday\n- [ ] Bob: Set up the staging environment\n- [ ] Charlie: Review the API contracts"
        }
    ]
}
```

---

## Feature 1 — Mounting into a non-fullscreen container

The view config differs from the standalone editor only in the target
element address. Everything else is identical:

```js
const _EmbeddedEditorConfiguration = (
{
    "ViewIdentifier": "EmbeddedEditor",
    "TargetElementAddress": "#EmbeddedEditorContainer",
    "ContentDataAddress": "AppData.Note.Segments",
    "ReadOnly": false,
    "EnableRichPreview": true
});
```

`TargetElementAddress` is a CSS selector resolved by
`ContentAssignment.getElement()` — any element on the page that exists
at the time the view first renders. The editor finds it during
`onAfterInitialRender()`:

```js
let tmpTargetElementSet = this.services.ContentAssignment.getElement(this.options.TargetElementAddress);
if (!tmpTargetElementSet || tmpTargetElementSet.length < 1)
{
    this.log.error(`PICT-MarkdownEditor Could not find target element [${this.options.TargetElementAddress}]!`);
    this.targetElement = false;
    return false;
}
this.targetElement = tmpTargetElementSet[0];
```

The container does not need to be sized or positioned in any special
way — the editor's own CSS (`.pict-mde-segment` is a flex row, the
container has no fixed height) lets the editor grow to fit whatever
space the host gives it. The host card in this example sets a 1px
border, an 8px border radius, and a thin shadow; the editor's internal
chrome (drag handle, quadrants, preview pane) fills the inside without
collisions.

## Feature 2 — Page-frame styling around the editor

The page shell wraps the editor mount in a card that visually feels like
a desktop window — three dots, a filename, a soft shadow:

```html
<div class="editor-widget">
    <div class="editor-widget-header">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
        <span>notes.md</span>
    </div>
    <div id="EmbeddedEditorContainer"></div>
</div>
```

```css
.editor-widget
{
    border: 1px solid #C8BFB0;
    border-radius: 8px;
    background: var(--theme-color-background-panel, #fff);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.editor-widget-header
{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #F8F5F0;
    border-bottom: 1px solid #E0D8CC;
    font-size: 0.8rem;
    color: var(--theme-color-text-muted, #888);
}
#EmbeddedEditorContainer
{
    padding: 0;
}
```

Two patterns worth copying: the card's `background` uses the Pict
theme's `--theme-color-background-panel` custom property with a hex
fallback, so the same markup works inside a theme-aware app and inside
a vanilla page. And the container itself takes `padding: 0` — the
editor's per-segment chrome already provides the right spacing; adding
host padding would push the drag handle away from the card edge.

## Feature 3 — Multi-segment content in a compact form factor

Even though the card is small, the editor is still multi-segment. The
seed data has two segments and the runtime cost of supporting many is
identical to supporting one — every segment is an independent
CodeMirror instance with its own toolbar, drag handle, and preview pane.
This is what distinguishes the markdown editor from a single textarea:
the user can pull a section out, reorder it, or remove it without
manually managing splitter UI.

The bottom-left "+ Add Segment" button appears beneath the last
segment by default and adds a new empty entry to `AppData.Note.Segments`:

```js
addSegment(pContent)
{
    let tmpContent = (typeof (pContent) === 'string') ? pContent : '';
    let tmpSegments = this._getSegmentsFromData();
    if (!tmpSegments)
    {
        tmpSegments = [];
    }
    tmpSegments.push({ Content: tmpContent });
    this._setSegmentsToData(tmpSegments);
    this._buildEditorUI();
}
```

The host page makes no special accommodation — the card simply grows
to fit additional segments.

## Feature 4 — Round-tripping through AppData

Every keystroke flows through the same content-change pipeline as the
larger examples. The internal `_onSegmentContentChange()` updates the
`Content` field on the matching `AppData.Note.Segments` entry
immediately, then debounces image-preview and rich-preview updates on a
500 ms timer:

```js
_onSegmentContentChange(pSegmentIndex, pContent)
{
    let tmpLogicalIndex = this._getLogicalIndex(pSegmentIndex);
    if (tmpLogicalIndex < 0) { return; }

    let tmpSegments = this._getSegmentsFromData();
    if (!tmpSegments) { return; }

    if (tmpLogicalIndex < tmpSegments.length)
    {
        tmpSegments[tmpLogicalIndex].Content = pContent;
    }
    this.onContentChange(tmpLogicalIndex, pContent);
    // …debounced preview/image updates…
}
```

Because `AppData.Note.Segments` is the canonical state, a host that
wants to save the notes to a backend only needs to read that address;
there is no separate "publish" or "marshal" step. (Hosts that need to
*force* a marshal — e.g. to be sure the last keystroke has flushed
before a network request — can still call
`view.marshalFromView()` explicitly.)

## Feature 5 — Subclassing for future-proofing

The subclass is empty in this example, but it is a deliberate hook
point. To add custom behaviour — auto-save to a server, track edit
times, validate content — a consumer overrides one method:

```js
class EmbeddedEditorView extends libPictSectionMarkdownEditor
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }

    // Example: tracked changes
    onContentChange(pSegmentIndex, pContent)
    {
        super.onContentChange(pSegmentIndex, pContent);
        // post to a backend, increment a dirty flag, etc.
    }
}
```

`onContentChange(logicalIndex, content)` fires on every debounced
keystroke (after the `Content` field has been updated in `AppData`).
This is the cheapest place to extend the editor without touching its
internals — the same hook the Server Upload example uses for its
upload-status side effects.

## Running the example

```bash
cd example_applications/embedded_editor
npm install
node build-codemirror-bundle.js   # produces html/codemirror-bundle.js
npx quack build && npx quack copy # produces dist/embedded_editor_example.min.js
# then open dist/index.html in a browser
```

The HTML shell loads KaTeX, Mermaid, the CodeMirror bundle, Pict, and
the application bundle in that order, then calls
`Pict.safeLoadPictApplication(EmbeddedEditorExample, 1)`.

## Things to try in the running app

- **Edit the meeting notes header** — type into the first segment.
  Watch the rich preview beneath the segment re-render after the
  500 ms debounce.
- **Check off an action item** — the `[ ]` syntax is rendered as a
  task-list checkbox by `pict-section-content`. Open the preview pane
  beneath the second segment.
- **Add a third segment** — click `+ Add Segment` beneath the last
  segment. The new segment appears with an empty editor and full
  quadrant buttons.
- **Drag-reorder** — grab the grey vertical drag handle to the left of
  the editor body and drop above or below the other segment.
- **Insert an image** — click the image button in the right sidebar of
  any segment and pick a small PNG. The image embeds as a base64 data
  URI (no upload hook is configured in this example) and the editor
  shows a collapsed `data:image/png;base64,…NkB` chip. The thumbnail
  appears in the image preview area below the editor.
- **Inspect `AppData`** — `_Pict.AppData.Note.Segments` in the browser
  console reflects every edit live.

## Takeaways

1. **The editor is a widget, not a workspace.** Mounting at any DOM
   selector means it composes inside cards, modals, sidebars, table
   cells, or full-page containers without configuration differences.
2. **No host JavaScript is required.** Every default behaviour — segment
   reorder, quadrant buttons, rich previews, debounced content sync —
   is on by default. The host's only responsibility is providing the
   target element.
3. **Use theme-aware fallbacks in host CSS.** Wrapping the editor in
   `var(--theme-color-background-panel, #fff)`-style declarations keeps
   the card visually consistent inside a themed Pict application while
   still working on a vanilla page.
4. **Multi-segment scales down as well as up.** Two segments in a small
   card behaves the same as twenty segments on a full-page editor —
   the per-segment overhead is one CodeMirror instance plus a flex row,
   not a multiplier on the page chrome.
5. **An empty subclass is the right starting point.** It costs nothing
   to keep the subclass even when there are no overrides yet — adding
   `onContentChange()` or `onImageUpload()` later is a one-method
   change instead of a refactor.

## Related documentation

- [Overview](../../README.md) — module README + Quick Start
- [Configuration](../../configuration.md) — view options, button quadrants, templates
- [API Reference](../../api.md) — `marshalFromView()` and the content lifecycle
- [Image Upload](../../image_upload.md) — what happens with the default base64 flow
