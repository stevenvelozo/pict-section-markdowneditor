const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');

class ExampleMarkdownEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _ExampleMarkdownEditorConfiguration = (
{
	"ViewIdentifier": "ExampleMarkdownEditor",
	"TargetElementAddress": "#MarkdownEditorContainer",
	"ContentDataAddress": "AppData.Document.Segments",
	"ReadOnly": false
});

class MarkdownEditorExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('ExampleMarkdownEditorView', _ExampleMarkdownEditorConfiguration, ExampleMarkdownEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();

		// The view will pick up CodeMirror modules from window.CodeMirrorModules
		// (set up in the HTML via the codemirror-bundle.js script)
		let tmpView = this.pict.views.ExampleMarkdownEditorView;
		if (tmpView)
		{
			tmpView.render();
		}
	}
}

module.exports = MarkdownEditorExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Markdown Editor Example",
	"Hash": "MarkdownEditorExample",
	"MainViewportViewIdentifier": "ExampleMarkdownEditorView",
	"pict_configuration":
	{
		"Product": "MarkdownEditor-Example",
		"DefaultAppData":
		{
			"Document":
			{
				"Segments":
				[
					{
						"Content": "# Welcome to the Markdown Editor\n\nThis is the first segment. Start typing here."
					},
					{
						"Content": "## Second Section\n\nThis is a second segment. You can add, remove, and reorder segments."
					}
				]
			}
		}
	}
});
