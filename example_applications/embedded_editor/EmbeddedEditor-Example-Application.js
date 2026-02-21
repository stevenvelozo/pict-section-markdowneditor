const libPictApplication = require('pict-application');
const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');

class EmbeddedEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

const _EmbeddedEditorConfiguration = (
{
	"ViewIdentifier": "EmbeddedEditor",
	"TargetElementAddress": "#EmbeddedEditorContainer",
	"ContentDataAddress": "AppData.Note.Segments",
	"ReadOnly": false,
	"EnableRichPreview": true
});

class EmbeddedEditorExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addView('EmbeddedEditorView', _EmbeddedEditorConfiguration, EmbeddedEditorView);
	}

	onAfterInitialize()
	{
		super.onAfterInitialize();

		let tmpView = this.pict.views.EmbeddedEditorView;
		if (tmpView)
		{
			tmpView.render();
		}
	}
}

module.exports = EmbeddedEditorExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Embedded Editor Example",
	"Hash": "EmbeddedEditorExample",
	"MainViewportViewIdentifier": "EmbeddedEditorView",
	"pict_configuration":
	{
		"Product": "EmbeddedEditor-Example",
		"DefaultAppData":
		{
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
		}
	}
});
