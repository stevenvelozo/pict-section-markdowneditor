# Pict Section MarkdownEditor

> A segmented markdown editor for Pict applications, built on CodeMirror

Split documents into independently editable segments with drag-and-drop reorder, live rich previews, and server-side image upload hooks. Define your editor in a JSON configuration object -- or extend the class to add custom formatting, image handling, and content change behavior.

- **Segmented Editing** -- Break documents into reorderable segments with add, remove, and drag-and-drop
- **Rich Preview** -- Live rendered markdown with syntax highlighting, mermaid diagrams, and KaTeX math
- **Image Support** -- Paste, drag, or pick images with inline base64 or server-side upload via `onImageUpload`
- **Formatting Toolbar** -- Bold, italic, code, heading, link, and image buttons that follow the cursor
- **Extensible** -- Override `onImageUpload`, `onContentChange`, and `customConfigureExtensions` for custom behavior

[Quick Start](README.md)
[Configuration](configuration.md)
[API Reference](api.md)
[Image Upload](image_upload.md)
[GitHub](https://github.com/stevenvelozo/pict-section-markdowneditor)
