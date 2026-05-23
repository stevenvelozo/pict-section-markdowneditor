# Markdown Editor — The Full-Featured Segmented Editor

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/markdown%5Feditor/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

The reference deployment of `pict-section-markdowneditor` — a four-segment
document with every default capability turned on. Each segment is an
independent CodeMirror v6 instance, every quadrant button works out of
the box, drag-and-drop reordering is live, and the rich-preview pipeline
renders syntax-highlighted code, Mermaid diagrams, and KaTeX math beneath
each segment.

The application file is tiny on purpose: a trivial subclass, a four-line
view configuration, and seed segments declared inline in `DefaultAppData`.
Everything visible on the page comes from the framework defaults. Use
this example as the read-along when you're working out which option does
what — every default is exercised, every keystroke is wired, and the
toolbar above the editor demonstrates the four most useful public API
methods.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Zero-code subclass of `PictSectionMarkdownEditor` | `MarkdownEditor-Example-Application.js` — `class ExampleMarkdownEditorView extends libPictSectionMarkdownEditor {}` |
| `ContentDataAddress` binding into `AppData` | View config: `"ContentDataAddress": "AppData.Document.Segments"` |
| Multi-segment seeding via `DefaultAppData` | Four seed segments with headings, mermaid, KaTeX, and a `javascript` code block |
| CodeMirror v6 via `window.CodeMirrorModules` | `codemirror-entry.js` + `build-codemirror-bundle.js` produce `html/codemirror-bundle.js` |
| Four-quadrant button layout (TL / BL / TR / BR) | Default buttons render automatically once the view is mounted |
| Keyboard shortcuts wired to formatting | `Ctrl/Cmd + B`, `Ctrl/Cmd + I`, `Ctrl/Cmd + E` |
| Public API surface called from page chrome | `getAllContent()`, `setReadOnly()`, `togglePreview()`, `toggleRenderedView()` |
| Rich-preview pipeline (Mermaid + KaTeX + code) | Each segment renders its rich preview through `pict-section-content` |
| Drag-and-drop segment reorder | The grey handle column between left controls and the editor |

## Key files

- `MarkdownEditor-Example-Application.js` — application class, view
  subclass, view configuration, and `DefaultAppData` seed segments. The
  application is roughly thirty lines without the seed content.
- `codemirror-entry.js` — ES module entry point listing the CodeMirror v6
  exports the editor needs (`EditorView`, `EditorState`, `Decoration`,
  `ViewPlugin`, `WidgetType`, `basicSetup`, `markdown`, and a default
  `extensions` array).
- `build-codemirror-bundle.js` — minimal esbuild driver that produces
  `html/codemirror-bundle.js` as an IIFE binding to
  `window.CodeMirrorModules`.
- `html/index.html` — page shell. KaTeX + Mermaid CDN tags, the dynamic
  CSS container, the editor container `<div>`, and a small toolbar with
  four buttons that call public API methods.

## The data model

The view binds to a single address in `AppData`. The data at the address
is an array of objects, each with a `Content` string. That is the entire
schema — `pict-section-markdowneditor` does not require any wrapper
type or metadata.

```js
"Document":
{
    "Segments":
    [
        { "Content": "# Welcome to the Markdown Editor\n\nThis is the first segment. Start typing here." },
        { "Content": "## Second Section\n\nThis is a second segment. You can add, remove, and reorder segments." },
        { "Content": "## Diagrams & Math\n\n```mermaid\n…\n```\n\nEinstein's equation: $E=mc^2$" },
        { "Content": "## Code Highlighting\n\n```javascript\nconst greeting = 'Hello, World!';\n…\n```" }
    ]
}
```

The editor reads this array on `_buildEditorUI()`, creates one segment
(and one CodeMirror instance) per entry, and writes changes back into
the same array on every keystroke through a debounced
`_marshalAllEditorsToData()`.

---

## Feature 1 — Subclass-by-extension

Every consumer of `pict-section-markdowneditor` extends the base view
class. In this example the subclass adds nothing — it exists only so
that the host application can register a uniquely-identified view:

```js
const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');

class ExampleMarkdownEditorView extends libPictSectionMarkdownEditor
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }
}
```

The base class registers all templates, CSS, helper modules
(`Formatting`, `ImageHandling`, `DragAndReorder`, `RichPreview`,
`CodeMirror`), and quadrant button defaults. An empty subclass already
ships a fully working editor.

The same hook points (`onContentChange`, `onImageUpload`,
`customConfigureExtensions`) are reachable from this subclass — the
other example applications in this module override exactly those hooks
without changing the rest of the surface.

## Feature 2 — Binding the editor to `AppData`

Two configuration fields connect a `PictSectionMarkdownEditor` to the
host application: `TargetElementAddress` (where to mount in the DOM) and
`ContentDataAddress` (where to read and write segment content in
`AppData`):

```js
const _ExampleMarkdownEditorConfiguration = (
{
    "ViewIdentifier": "ExampleMarkdownEditor",
    "TargetElementAddress": "#MarkdownEditorContainer",
    "ContentDataAddress": "AppData.Document.Segments",
    "ReadOnly": false
});
```

`ContentDataAddress` is a Fable manifest path resolved against an
address space that includes `AppData`, `Bundle`, `Options`, and the
`Fable`/`Pict` services — the same resolver as the rest of the Pict
data layer. The editor reads through `manifest.getValueByHash()` and
writes through `manifest.setValueByHash()`, so any address that resolves
to (or can be set to) an array works — including nested addresses,
addresses inside `Bundle`, and addresses backed by getters.

## Feature 3 — CodeMirror module injection

`PictSectionMarkdownEditor` does not bundle CodeMirror v6 directly. Each
host application provides the CodeMirror modules either by calling
`view.connectCodeMirrorModules({...})` explicitly or by exposing a
`window.CodeMirrorModules` global. The default is the global, and that
is the path this example uses.

The entry point lists every export the editor needs and emits a single
IIFE bundle via esbuild:

```js
// codemirror-entry.js
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';

export { EditorView, EditorState, Decoration, ViewPlugin, WidgetType, basicSetup, markdown };
export const extensions = [basicSetup, markdown()];
```

The build script is a six-line esbuild driver — IIFE format, global
name `CodeMirrorModules`, browser platform, ES2018 target:

```js
build(
{
    entryPoints: [path.join(__dirname, 'codemirror-entry.js')],
    bundle: true,
    outfile: path.join(__dirname, 'html', 'codemirror-bundle.js'),
    format: 'iife',
    globalName: 'CodeMirrorModules',
    platform: 'browser',
    target: ['es2018'],
    minify: false
});
```

The page loads the bundle before the Pict application bundle, so by the
time the view's `onAfterInitialRender()` runs, `window.CodeMirrorModules`
is already populated. The view's `connectCodeMirrorModules()` finds it
automatically:

```js
if (window.CodeMirrorModules && typeof (window.CodeMirrorModules.EditorView) === 'function')
{
    this.log.trace(`PICT-MarkdownEditor Found CodeMirror modules on window.CodeMirrorModules.`);
    this._codeMirrorModules = window.CodeMirrorModules;
    return;
}
```

Passing `Decoration`, `ViewPlugin`, and `WidgetType` is what enables the
data-URI collapse extension — when an image is embedded as a base64
data URI the editor visually replaces the long string with a chip like
`data:image/png;base64,…39kB` so the source stays readable.

## Feature 4 — The four-quadrant button layout

Each segment is a flex row with five regions: left controls (TL + BL),
drag handle, editor body, right sidebar (TR + BR), and a hidden file
input. The quadrant button arrays in the default configuration populate
the four corners:

```js
"ButtonsTL":
[
    { "HTML": "{~I:Close~}",    "Action": "removeSegment",  "Class": "pict-mde-btn-remove",  "Title": "Remove Segment" }
],
"ButtonsBL":
[
    { "HTML": "{~I:ArrowUp~}",   "Action": "moveSegmentUp",     "Class": "pict-mde-btn-move",     "Title": "Move Up" },
    { "HTML": "{~I:ArrowDown~}", "Action": "moveSegmentDown",   "Class": "pict-mde-btn-move",     "Title": "Move Down" },
    { "HTML": "{~I:Settings~}",  "Action": "toggleControls",    "Class": "pict-mde-btn-linenums", "Title": "Toggle Controls" },
    { "HTML": "{~I:Eye~}",       "Action": "cyclePreviewMode",  "Class": "pict-mde-btn-preview",  "Title": "Cycle Preview Mode" }
],
"ButtonsTR":
[
    { "HTML": "<b>B</b>",            "Action": "applyFormatting:bold",     "Class": "", "Title": "Bold (Ctrl+B)" },
    { "HTML": "<i>I</i>",            "Action": "applyFormatting:italic",   "Class": "", "Title": "Italic (Ctrl+I)" },
    { "HTML": "<code>&lt;&gt;</code>","Action": "applyFormatting:code",    "Class": "", "Title": "Inline Code (Ctrl+E)" },
    { "HTML": "#",                   "Action": "applyFormatting:heading",  "Class": "", "Title": "Heading" },
    { "HTML": "[&thinsp;]",          "Action": "applyFormatting:link",     "Class": "", "Title": "Link" },
    { "HTML": "{~I:Image~}",         "Action": "openImagePicker",          "Class": "pict-mde-sidebar-btn-image", "Title": "Insert Image" }
],
"ButtonsBR":
[
]
```

Two patterns make this declarative button system more powerful than it
looks. The `HTML` field is parsed through Pict's template engine before
becoming `innerHTML`, so `{~I:Close~}` resolves to a themable SVG icon
from `pict.providers.Icon`; plain strings (`<b>B</b>`,
`<code>&lt;&gt;</code>`) pass through unchanged. The `Action` field is
`"method"` or `"method:argument"`; the engine splits on the colon and
calls `this[method](segmentIndex, argument)` — which is how the same
underlying `applyFormatting(idx, type)` drives five different buttons
without writing five different click handlers.

## Feature 5 — Driving the public API from page chrome

The page shell wires four toolbar buttons directly to the editor's
public methods. The view exposes itself as
`_Pict.views.ExampleMarkdownEditorView`:

```js
function getAllContent()
{
    if (typeof(_Pict) !== 'undefined' && _Pict.views.ExampleMarkdownEditorView)
    {
        var tmpContent = _Pict.views.ExampleMarkdownEditorView.getAllContent();
        var tmpOutputWrap = document.getElementById('OutputWrap');
        var tmpOutput = document.getElementById('OutputContent');
        tmpOutputWrap.style.display = 'block';
        tmpOutput.textContent = tmpContent;
    }
}
function toggleReadOnly()
{
    if (typeof(_Pict) !== 'undefined' && _Pict.views.ExampleMarkdownEditorView)
    {
        var tmpView = _Pict.views.ExampleMarkdownEditorView;
        tmpView.setReadOnly(!tmpView.options.ReadOnly);
    }
}
function toggleAllPreviews()
{
    if (typeof(_Pict) !== 'undefined' && _Pict.views.ExampleMarkdownEditorView)
    {
        _Pict.views.ExampleMarkdownEditorView.togglePreview();
    }
}
function toggleRenderedView()
{
    if (typeof(_Pict) !== 'undefined' && _Pict.views.ExampleMarkdownEditorView)
    {
        _Pict.views.ExampleMarkdownEditorView.toggleRenderedView();
    }
}
```

These are not "host hooks" — they are the same public API the editor's
own quadrant buttons use. The right-side `Image` button calls
`openImagePicker(segmentIndex)`, the bottom-left `Settings` button calls
`toggleControls()`, and so on. A consumer can move any function from a
quadrant button into a page toolbar (or both) without changing the
editor.

## Feature 6 — Rich previews per segment

`EnableRichPreview: true` (the default) renders each segment's markdown
through `pict-section-content` into a `.pict-mde-rich-preview` div below
the editor. The preview is wrapped in a `.pict-content` container so the
content module's CSS takes effect — heading sizes, code-block styling,
table borders, and KaTeX placeholders are all picked up automatically.

The third seed segment exercises the full pipeline in one block:

```markdown
## Diagrams & Math

```mermaid
graph LR;
    A[Editor] --> B[Preview];
    B --> C[Rendered];
```

Einstein's equation: $E=mc^2$

Display math:

$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

`pict-section-content` produces the surrounding HTML; post-render hooks
in `Pict-MDE-RichPreview.js` call `mermaid.run({...})` on every
`pre.mermaid` element and `katex.render(text, el, {...})` on every
`.pict-content-katex-inline` / `.pict-content-katex-display` element.
Both libraries are loaded from CDN by the HTML page itself:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: false, theme: 'default' });</script>
```

Note `startOnLoad: false` — the editor's own render cycle is what
triggers Mermaid; auto-start would race against the per-segment renders
and produce stale or duplicate diagrams.

Preview updates are debounced on a 500 ms timer per segment, keyed by
internal segment index, so the diagram and equation renderers fire once
per keystroke burst rather than on every character.

## Feature 7 — The four preview layouts

The bottom-left "eye" button cycles through four preview layouts:
`off → bottom → side → tabbed → off`. The mode lives on the container
as a CSS class (`.pict-mde-preview-off`, `.pict-mde-preview-bottom`,
`.pict-mde-preview-side`, `.pict-mde-preview-tabbed`); the entire layout
is CSS-driven from there.

`bottom` is the default visible mode in this example (the cycle picks
up the last non-off layout, which starts at `bottom`). `side` reflows
each segment body into a two-column flex with the editor on the left
and the preview pane on the right. `tabbed` reveals a tab bar above
each segment with `Edit` and `Preview` tabs — the editor hides
when `Preview` is active. Below 768px, side mode falls back to vertical
stacking automatically.

## Feature 8 — Read-only and rendered modes

`setReadOnly(true)` flips `options.ReadOnly`, re-marshals editor
content, and rebuilds the UI. Each CodeMirror instance reconstructs
with the `EditorState.readOnly.of(true)` extension, the right-side
formatting buttons grey out, and the add-segment button still appears
(removing segments stays available so users can clean up before
publishing).

`toggleRenderedView()` is the read-mode opposite — it tears down every
CodeMirror instance, joins all segment content with `\n\n`, and renders
the result through `pict-section-content` into a single
`.pict-mde-rendered-view` container. Mermaid and KaTeX run once across
the joined document. Toggling back reconstructs each segment's
CodeMirror editor from `AppData` with content intact.

## Running the example

```bash
cd example_applications/markdown_editor
npm install
node build-codemirror-bundle.js   # produces html/codemirror-bundle.js
npx quack build && npx quack copy # produces dist/markdown_editor_example.min.js
# then open dist/index.html in a browser
```

The CodeMirror bundle step is independent of `quack build` and only
needs to run when the CodeMirror entry point or its dependencies
change.

## Things to try in the running app

- **Type into a segment** — content saves to `AppData.Document.Segments`
  on a 500 ms debounce. Open the browser console and inspect
  `_Pict.AppData.Document.Segments[0].Content` to see it update live.
- **Drag a segment** — grab the grey vertical handle to the left of the
  editor body and drop above or below another segment. The blue line
  indicates the drop position.
- **Click an empty segment's image button** — the file picker opens.
  With no `onImageUpload` override the image becomes a base64 data URI;
  the data URI is visually collapsed in the editor but the raw markdown
  still contains the full URI (`getAllContent` proves it).
- **Use the formatting keys** — `Ctrl/Cmd + B`, `Ctrl/Cmd + I`,
  `Ctrl/Cmd + E` toggle wrappers around the selection. Selecting nothing
  inserts paired markers and leaves the cursor between them.
- **Click "Toggle Rendered View"** — the whole editor flips into a
  single read-only render with diagrams and equations rendered live.
  Click again to return to segment editing.
- **Click "Toggle Read-Only"** — formatting buttons disable, content
  becomes non-editable, but segments are still individually removable.
- **Cycle preview modes** — bottom-left "eye" button: `off → bottom →
  side → tabbed`. Watch the layout reflow without re-mounting the
  CodeMirror editors.
- **Click "Get All Content"** — combines all segments with `\n\n` and
  displays them in the output panel below the editor.

## Takeaways

1. **One config field binds the editor to a data path.**
   `ContentDataAddress` is the entire integration surface for
   round-tripping content; the value at that address is just an array
   of `{ Content }` objects.
2. **CodeMirror is host-supplied, not bundled.** The host controls the
   exact CodeMirror v6 build through `window.CodeMirrorModules` or an
   explicit `connectCodeMirrorModules()` call. The editor stays
   framework-agnostic and the host can omit modules it doesn't need.
3. **Quadrant buttons are config, not code.** Replacing the toolbar is a
   matter of editing `ButtonsTL`/`ButtonsBL`/`ButtonsTR`/`ButtonsBR`
   arrays — `{~I:Name~}` template tags resolve to themable SVG icons,
   `method:arg` actions split automatically.
4. **The public API is the same as the internal API.** `getAllContent`,
   `togglePreview`, `setReadOnly`, `toggleRenderedView` — every method
   bound to a quadrant button is also available on the view instance
   for page chrome or other host code to call.
5. **Rich previews trade host setup for capability.** Mermaid and KaTeX
   come from CDN script tags loaded by the host page; the editor knows
   only to call `mermaid.run({ nodes })` and `katex.render(text, el)`
   when those globals exist. Hosts without the CDN tags still get every
   non-diagram, non-math preview feature.

## Related documentation

- [Overview](../../README.md) — module README + Quick Start
- [Configuration](../../configuration.md) — view options, button quadrants, templates
- [API Reference](../../api.md) — every public method the example calls
- [Image Upload](../../image_upload.md) — base64 fallback vs server upload hook
