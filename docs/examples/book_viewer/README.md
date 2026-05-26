# Book Viewer — Click-to-Edit Long-Form Content

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/book%5Fviewer/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A long-form reading experience — *"De Architectura Digitalis"*, an
imaginary ten-chapter reference book full of Lorem Ipsum, Mermaid
diagrams, KaTeX equations, syntax-highlighted code, and tables — that
is **rendered** with `pict-section-content` and **edited** with
`pict-section-markdowneditor`. Every chapter shows an "Edit" pencil on
hover; clicking it swaps that one chapter from a read-only render into
a single-segment markdown editor without disturbing the surrounding
content. Clicking "Done" marshals the chapter content back into the
book and re-renders it as a fixed page.

This is the canonical pattern for "edit-in-place" content surfaces —
documentation sites, wikis, CMS authoring views, course-reader apps,
internal handbooks. The book is split on `## ` headings into independent
sections; each section is independently editable; the markdown editor
is created and destroyed on demand so the page never holds more than
one live CodeMirror instance at a time.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| `pict-section-content` provider used directly | `addProvider('Content-Provider', PictContentProvider.default_configuration, PictContentProvider)` |
| `parseMarkdown()` outside the editor's preview pane | `tmpProvider.parseMarkdown(tmpMarkdown)` per section |
| Splitting a long document on heading boundaries | `splitOnHeadings(pMarkdown)` — splits on `## ` lines |
| Hover-revealed per-section edit affordance | `.book-section-toolbar { opacity: 0 }` + `:hover { opacity: 1 }` |
| Lazy editor lifecycle (create / destroy per edit) | `editSection()` adds a view; `finishEditing()` destroys it |
| Single-segment editing of a multi-section document | Each `editSection` call sets `AppData.EditingSection.Segments = [{ Content: ... }]` |
| Mermaid + KaTeX driven from host code, not the editor | `_postRenderSection()` re-runs `mermaid.run` and `katex.render` per section |
| CSS registration from a non-view provider | The application calls `pict.CSSMap.addCSS('Pict-Content-View', tmpCSS)` directly |
| Per-section data sync back to `AppData.Book.Sections` | `finishEditing()` joins editor segments and writes the result |

## Key files

- `BookViewer-Example-Application.js` — application class, section
  splitter, lazy editor lifecycle, post-render hooks for Mermaid and
  KaTeX. The `_BookMarkdown` array at the top of the file is the
  inline book content.
- `html/index.html` — page shell. Loads KaTeX + Mermaid CDN scripts,
  defines the book's typography (`Georgia, 'Times New Roman', serif`),
  styles the per-section hover toolbar and the editing card, and mounts
  the application.

## The data model

Three pieces of state live on the application instance:

```js
// The sections parsed from the book
this._sections = [];

// Track which section (if any) is currently being edited
this._editingSectionIndex = -1;

// The editor view instance (created lazily)
this._editorView = null;
```

Plus two `AppData` addresses — `AppData.Book.Sections` mirrors
`_sections` for inspection, and `AppData.EditingSection.Segments` is
the throw-away single-segment array the active editor binds to:

```js
this.pict.AppData.Book = { Sections: this._sections.map((s) => ({ Content: s })) };

// when entering edit mode:
this.pict.AppData.EditingSection = { Segments: [{ Content: this._sections[pIndex] }] };
```

This is the key design choice that makes the editor lifecycle clean:
each edit operates on its own dedicated data path. There is no
"current section index" the editor needs to know about; the editor
binds to a fresh address every time `editSection()` is called.

---

## Feature 1 — Splitting the book on heading boundaries

The book is one large markdown string in a JS file. The application
splits it on `## ` (chapter heading) lines at startup. The first
segment is everything before the first chapter heading — the title
block:

```js
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

After split, each section is a self-contained markdown string. Round
trips work because the inverse — `chapters.join('\n\n')` — produces
syntactically equivalent markdown.

The split-by-heading approach generalises: a CMS could split per
heading, per `<hr>`, or per arbitrary marker — what matters is that
each unit be independently parsable.

## Feature 2 — Using `pict-section-content` directly

`pict-section-markdowneditor` already uses `pict-section-content`
internally for its rich preview pane. The Book Viewer takes that
relationship one step further: the *primary* rendering of each chapter
is done by `pict-section-content`, not by the editor. The application
registers the content provider in its constructor and uses it directly
in `_renderSectionContent()`:

```js
this.pict.addProvider(
    'Content-Provider',
    libPictSectionContent.PictContentProvider.default_configuration,
    libPictSectionContent.PictContentProvider
);

// later, per section:
let tmpProvider = this.pict.providers['Content-Provider'];
let tmpMarkdown = this._sections[pIndex];
let tmpHTML = tmpProvider.parseMarkdown(tmpMarkdown);
```

This composition — `pict-section-content` for read-mode, the markdown
editor for edit-mode — is the recommended pattern any time the read
view dramatically outweighs the edit view in time spent. The editor is
expensive: each segment is a full CodeMirror instance with editing
state. Keeping the read view as static HTML is cheap, and the user
spends the vast majority of their time in read view.

## Feature 3 — Registering the editor's CSS manually

Because the application uses the markdown editor *lazily* (no editor
view is registered at boot), the editor's CSS would not be injected
until the first edit. To prevent the first edit from flashing
unstyled, the application registers both the content view's CSS and
the editor's CSS at startup:

```js
onAfterInitialize()
{
    super.onAfterInitialize();

    // Register pict-section-content CSS
    let tmpContentViewConfig = libPictSectionContent.default_configuration;
    if (tmpContentViewConfig && tmpContentViewConfig.CSS)
    {
        this.pict.CSSMap.addCSS('Pict-Content-View', tmpContentViewConfig.CSS);
    }

    // Register markdown editor CSS
    let tmpEditorConfig = libPictSectionMarkdownEditor.default_configuration;
    if (tmpEditorConfig && tmpEditorConfig.CSS)
    {
        this.pict.CSSMap.addCSS('Pict-Section-MarkdownEditor', tmpEditorConfig.CSS);
    }

    this.pict.CSSMap.injectCSS();
    // ...
}
```

`pict.CSSMap.addCSS(hash, css, priority)` deduplicates by hash, so this
is safe even though the editor itself would also register the same
fragment on first instantiation. Pre-registering is the cleanest way
to defeat the unstyled-flash on lazy widgets.

## Feature 4 — Hover-revealed edit affordance

The toolbar that holds the Edit / Done button is invisible by default,
visible on hover, and pinned visible while editing. Three CSS rules:

```css
.book-section-toolbar
{
    position: absolute;
    top: 12px;
    right: 0;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
}
.book-section:hover .book-section-toolbar { opacity: 1; }
.book-section-editing .book-section-toolbar { opacity: 1; }
```

The active edit's section also takes a different background and a
rounded border, signalling visually that this one block is in edit mode
while the rest of the page stays in read mode:

```css
.book-section-editing
{
    background: #FFFEF8;
    border: 1px solid #D4A373;
    border-radius: 6px;
    padding: 0 1rem 1rem 1rem;
    margin: 1rem -1rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
```

This is "edit-in-place" at its lightest — a single CSS class
transition between two rendering states, with the underlying DOM
container reused.

## Feature 5 — The edit lifecycle: create on demand, destroy on done

`editSection(pIndex)` is the entire enter-edit-mode operation. It
finishes any previous edit first, marks the new section, replaces the
content `<div>` with an empty editor mount, sets a fresh `AppData`
slot, and creates a new editor view:

```js
editSection(pIndex)
{
    if (this._editingSectionIndex >= 0)
    {
        this.finishEditing();
    }

    this._editingSectionIndex = pIndex;
    // ...mark the toolbar, replace the content div, swap the button to "Done"...

    // Set up AppData for this single segment
    this.pict.AppData.EditingSection = { Segments: [{ Content: this._sections[pIndex] }] };

    // Destroy previous editor view if it exists
    if (this._editorView)
    {
        this._editorView.destroy();
        delete this.pict.views['BookSectionEditorView'];
        delete this.pict.servicesMap.PictView['BookSectionEditorView'];
    }

    // Create a new editor view for this section
    let tmpEditorConfig =
    {
        ViewIdentifier: 'BookSectionEditorView',
        TargetElementAddress: `#BookSectionEditor-${pIndex}`,
        ContentDataAddress: 'AppData.EditingSection.Segments',
        ReadOnly: false,
        EnableRichPreview: true
    };

    this._editorView = this.pict.addView('BookSectionEditorView', tmpEditorConfig, BookViewerSectionEditorView);
    this._editorView.render();
}
```

Two subtleties matter here:

- The editor view's `destroy()` method tears down every CodeMirror
  instance, clears debounce timers, and resets internal state — but
  the framework's view registry needs to be cleaned manually so the
  same identifier can be reused. That is the `delete this.pict.views[...]`
  + `delete this.pict.servicesMap.PictView[...]` pair.
- `TargetElementAddress` uses the section index, not a fixed selector,
  so each chapter's edit mounts into its own freshly-created div. There
  is no risk of two editors fighting for the same DOM node.

`finishEditing()` is the symmetric exit path — marshal the editor
content back into `_sections`, destroy the editor, re-render the
section as static content:

```js
finishEditing()
{
    if (this._editingSectionIndex < 0) { return; }

    let tmpIndex = this._editingSectionIndex;
    this._editingSectionIndex = -1;

    if (this._editorView)
    {
        this._editorView.marshalFromView();
        let tmpEditorSegments = this.pict.AppData.EditingSection.Segments;
        if (tmpEditorSegments && tmpEditorSegments.length > 0)
        {
            // Combine all editor segments into a single section
            let tmpParts = [];
            for (let i = 0; i < tmpEditorSegments.length; i++)
            {
                tmpParts.push(tmpEditorSegments[i].Content || '');
            }
            this._sections[tmpIndex] = tmpParts.join('\n\n');
        }

        this._editorView.destroy();
        delete this.pict.views['BookSectionEditorView'];
        delete this.pict.servicesMap.PictView['BookSectionEditorView'];
        this._editorView = null;
    }

    this.pict.AppData.Book.Sections[tmpIndex].Content = this._sections[tmpIndex];

    // ...rebuild the section's rendered content DIV and re-run post-render hooks...
}
```

Note that the editor can produce *more than one* segment while in edit
mode — the user can split a chapter while editing — and the
`tmpParts.join('\n\n')` flattens it back into a single section. The
overall document remains a flat list of sections; the segment-within-a-
section structure is editor-side scratch state.

## Feature 6 — Driving Mermaid and KaTeX from the host

Because `pict-section-content` renders synchronously into HTML — but
Mermaid diagrams and KaTeX equations need a follow-up activation pass
— the application's `_postRenderSection(pIndex)` runs after each
section render:

```js
_postRenderSection(pIndex)
{
    let tmpContainer = document.getElementById(`BookSectionContent-${pIndex}`);
    if (!tmpContainer) { return; }

    // Mermaid
    if (typeof mermaid !== 'undefined')
    {
        let tmpMermaidNodes = tmpContainer.querySelectorAll('pre.mermaid');
        if (tmpMermaidNodes.length > 0)
        {
            try { mermaid.run({ nodes: tmpMermaidNodes }); }
            catch (pErr)
            {
                this.log.warn('Mermaid error in section ' + pIndex + ': ' + pErr.message);
            }
        }
    }

    // KaTeX
    if (typeof katex !== 'undefined')
    {
        let tmpInline = tmpContainer.querySelectorAll('.pict-content-katex-inline');
        for (let j = 0; j < tmpInline.length; j++)
        {
            try { katex.render(tmpInline[j].textContent, tmpInline[j], { throwOnError: false, displayMode: false }); }
            catch (e) { /* ignore */ }
        }
        let tmpDisplay = tmpContainer.querySelectorAll('.pict-content-katex-display');
        for (let j = 0; j < tmpDisplay.length; j++)
        {
            try { katex.render(tmpDisplay[j].textContent, tmpDisplay[j], { throwOnError: false, displayMode: true }); }
            catch (e) { /* ignore */ }
        }
    }
}
```

`pict-section-content` emits `pre.mermaid` and
`.pict-content-katex-inline` / `.pict-content-katex-display` placeholders
during `parseMarkdown()`; the host code activates them by scope-narrowed
DOM queries. Scoping the query to the section's container prevents
Mermaid from accidentally re-running across sections it has already
rendered.

This is *exactly the same activation pattern the editor's rich-preview
pane uses internally* — the application is reproducing it because it
calls `parseMarkdown()` directly.

## Feature 7 — A 10-chapter Lorem Ipsum book as seed content

`_BookMarkdown` is an array of string literals joined with `'\n'` —
each chapter contributes a heading, prose, and at least one of: a
Mermaid graph, a KaTeX block, a fenced code block, an image, or a
markdown table. Every supported `pict-section-content` feature appears
at least once:

- Chapter 1 — table + inline KaTeX
- Chapter 2 — Mermaid LR graph + display KaTeX
- Chapter 3 — KaTeX + image placeholder
- Chapter 4 — fenced JavaScript code block
- Chapter 5 — Mermaid TD graph + display KaTeX
- Chapter 6 — multiple KaTeX displays + image
- Chapter 7 — Mermaid sequence diagram + KaTeX
- Chapter 8 — Mermaid LR pipeline + fenced code
- Chapter 9 — KaTeX entropy formulas + a probability table
- Chapter 10 — image + blockquote

This is more than padding. Each chapter is a real test of one
`pict-section-content` capability, surfaced through the edit-in-place
interaction. Editing chapter 2 and saving exercises the entire
"split → parseMarkdown → re-render Mermaid in scope" path.

## Running the example

```bash
cd example_applications/book_viewer
npm install
node build-codemirror-bundle.js   # produces html/codemirror-bundle.js
npx quack build && npx quack copy # produces dist/book_viewer_example.min.js
# then open dist/index.html in a browser
```

## Things to try in the running app

- **Read the book** — scroll through. Mermaid diagrams render
  asynchronously; KaTeX equations render on each section's
  post-render pass.
- **Hover any chapter** — the "Edit" pencil appears at the top-right
  corner of that section only.
- **Click "Edit"** — the chapter swaps into edit mode with a
  highlighted card around it. The chapter is now a single segment in a
  freshly-mounted markdown editor.
- **Add a `## Sub-section` while editing** — `+ Add Segment` while
  editing produces an additional editor segment. On Done, both
  segments are joined back into the chapter with `\n\n` between them.
- **Switch chapter mid-edit** — click another chapter's Edit while one
  is already in edit mode. The first chapter's content marshals back
  automatically before the new one opens.
- **Inspect `AppData.Book.Sections`** — every saved edit updates that
  array. Open the browser console: `_Pict.AppData.Book.Sections[2].Content`.
- **Edit a Mermaid diagram** — change one of the chapter-5 graph nodes,
  click Done. The chapter re-renders and the new Mermaid graph appears.

## Takeaways

1. **Render with `pict-section-content`, edit with
   `pict-section-markdowneditor`.** The two packages are designed to
   compose: the content provider's `parseMarkdown()` and the editor's
   internal pipeline use the same HTML/CSS contract.
2. **Create the editor view on demand.** A long-form reading
   experience does not need an always-on editor instance. Creating
   the view in `editSection()` and destroying it in `finishEditing()`
   keeps memory and DOM weight proportional to active editing, not
   total content size.
3. **Use a dedicated `AppData` slot for the active edit.** Binding
   the editor to a throw-away path (`AppData.EditingSection.Segments`)
   instead of mutating the canonical book array lets the application
   decide *when* to commit — on Done, with explicit `marshalFromView()`
   plus a flatten step.
4. **Clean the view registry when destroying a view.** Calling
   `view.destroy()` is not enough — Pict's `views` and
   `servicesMap.PictView` hold strong references that prevent a new
   view with the same identifier from being created. `delete` both.
5. **Scope Mermaid and KaTeX activation to the section.**
   `tmpContainer.querySelectorAll('pre.mermaid')` re-runs Mermaid
   only on the section that changed; a document-wide query would
   re-process every diagram on the page, every time.

## Related documentation

- [Overview](../../README.md) — module README + Quick Start
- [Configuration](../../configuration.md) — view options, `ContentDataAddress`, templates
- [API Reference](../../api.md) — `marshalFromView()`, `destroy()`, the segment lifecycle
- [Image Upload](../../image_upload.md) — extending the editor with custom hooks
- [pict-section-content](https://fable-retold.github.io/pict-section-content/) — `parseMarkdown()`, Mermaid/KaTeX placeholders, CSS classes
