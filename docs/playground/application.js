// Application Code for the Markdown Editor playground.
//
// `Base` is the synthesized PictApplication wrapper that registers the
// MarkdownEditor view from your Pict Config (under `MarkdownEditorViewConfig`).
//
// pict-section-markdowneditor wraps CodeMirror v6, which ships as four+
// separate ES-module-only packages.  The triangulated infrastructure
// dynamic-imports each one declaratively (see the Imports block in
// _playground.json with `"Source": "esm"`) and stamps the resulting
// namespace onto window.CodeMirror{View,State,Basic,Markdown}.
//
// The markdown-editor view expects a SINGLE window.CodeMirrorModules object
// with EditorView, EditorState, Decoration, ViewPlugin, WidgetType, and an
// `extensions` array — so we assemble that here in `onBeforeInitialize`,
// which runs after the bootstrap's ESM-await phase has finished.
//
return class extends Base
{
	onBeforeInitialize()
	{
		// All four ESM globals are guaranteed to be on `window` at this
		// point — the playground bootstrap awaits `__SectionPlaygroundESMReady`
		// before instantiating the application.
		if (!window.CodeMirrorModules && window.CodeMirrorView && window.CodeMirrorState)
		{
			let tmpView     = window.CodeMirrorView;
			let tmpState    = window.CodeMirrorState;
			let tmpBasic    = window.CodeMirrorBasic    || {};
			let tmpMarkdown = window.CodeMirrorMarkdown || {};

			let tmpExtensions = [];
			if (tmpBasic.basicSetup)
			{
				tmpExtensions.push(tmpBasic.basicSetup);
			}
			if (typeof tmpMarkdown.markdown === 'function')
			{
				tmpExtensions.push(tmpMarkdown.markdown());
			}

			window.CodeMirrorModules =
			{
				EditorView:  tmpView.EditorView,
				EditorState: tmpState.EditorState,
				Decoration:  tmpView.Decoration,
				ViewPlugin:  tmpView.ViewPlugin,
				WidgetType:  tmpView.WidgetType,
				extensions:  tmpExtensions
			};
		}

		return super.onBeforeInitialize();
	}
};
