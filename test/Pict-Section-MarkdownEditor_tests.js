/*
	Unit tests for Pict-Section-MarkdownEditor
*/

const libBrowserEnv = require('browser-env');
libBrowserEnv();

const Chai = require('chai');
const Expect = Chai.expect;

const libPict = require('pict');

const configureTestPict = (pPict) =>
{
	let tmpPict = (typeof (pPict) == 'undefined') ? new libPict() : pPict;
	tmpPict.TestData = (
		{
			Reads: [],
			Assignments: [],
			Appends: [],
			Gets: []
		});
	tmpPict.ContentAssignment.customReadFunction = (pAddress, pContentType) =>
	{
		tmpPict.TestData.Reads.push(pAddress);
		tmpPict.log.info(`Mocking a read of type ${pContentType} from Address: ${pAddress}`);
		return '';
	};
	tmpPict.ContentAssignment.customGetElementFunction = (pAddress) =>
	{
		tmpPict.TestData.Gets.push(pAddress);
		tmpPict.log.info(`Mocking a get of Address: ${pAddress}`);
		return '';
	};
	tmpPict.ContentAssignment.customAppendElementFunction = (pAddress, pContent) =>
	{
		tmpPict.TestData.Appends.push(pAddress);
		tmpPict.log.info(`Mocking an append of Address: ${pAddress}`, { Content: pContent });
		return '';
	};
	tmpPict.ContentAssignment.customAssignFunction = (pAddress, pContent) =>
	{
		tmpPict.TestData.Assignments.push(pAddress);
		tmpPict.log.info(`Mocking an assignment of Address: ${pAddress}`, { Content: pContent });
		return '';
	};

	return tmpPict;
};

const libPictSectionMarkdownEditor = require('../source/Pict-Section-MarkdownEditor.js');

suite
(
	'PictSectionMarkdownEditor',
	() =>
	{
		setup(() => { });

		suite
		(
			'Module Exports',
			() =>
			{
				test
				(
					'Main class should be exported',
					(fDone) =>
					{
						Expect(libPictSectionMarkdownEditor).to.be.a('function');
						return fDone();
					}
				);
				test
				(
					'Default configuration should be exported',
					(fDone) =>
					{
						Expect(libPictSectionMarkdownEditor.default_configuration).to.be.an('object');
						Expect(libPictSectionMarkdownEditor.default_configuration).to.have.property('DefaultRenderable');
						Expect(libPictSectionMarkdownEditor.default_configuration).to.have.property('TargetElementAddress');
						Expect(libPictSectionMarkdownEditor.default_configuration).to.have.property('CSS');
						Expect(libPictSectionMarkdownEditor.default_configuration).to.have.property('ContentDataAddress');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Basic Initialization',
			() =>
			{
				test
				(
					'Should create a view instance with default options',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE', {}, libPictSectionMarkdownEditor);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView._segmentEditors).to.be.an('object');
						Expect(tmpView._segmentCounter).to.equal(0);
						Expect(tmpView.initialRenderComplete).to.equal(false);
						return fDone();
					}
				);
				test
				(
					'Should create a view instance with custom content data address',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView(
							'Pict-View-TestMDE-Address',
							{
								ContentDataAddress: 'AppData.Document.Segments'
							},
							libPictSectionMarkdownEditor
						);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView.options.ContentDataAddress).to.equal('AppData.Document.Segments');
						return fDone();
					}
				);
				test
				(
					'Should create a view instance with read-only option',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView(
							'Pict-View-TestMDE-ReadOnly',
							{
								ReadOnly: true
							},
							libPictSectionMarkdownEditor
						);
						Expect(tmpView).to.be.an('object');
						Expect(tmpView.options.ReadOnly).to.equal(true);
						return fDone();
					}
				);
			}
		);

		suite
		(
			'CodeMirror Module Connection',
			() =>
			{
				test
				(
					'connectCodeMirrorModules should accept valid modules',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-CM', {}, libPictSectionMarkdownEditor);

						// Mock CodeMirror modules
						let tmpMockModules =
						{
							EditorView: function() {},
							EditorState: function() {},
							extensions: []
						};

						tmpView.connectCodeMirrorModules(tmpMockModules);
						Expect(tmpView._codeMirrorModules).to.equal(tmpMockModules);
						return fDone();
					}
				);
				test
				(
					'connectCodeMirrorModules should reject invalid modules',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-CM2', {}, libPictSectionMarkdownEditor);

						let tmpResult = tmpView.connectCodeMirrorModules({ foo: 'bar' });
						Expect(tmpResult).to.equal(false);
						Expect(tmpView._codeMirrorModules).to.equal(null);
						return fDone();
					}
				);
				test
				(
					'connectCodeMirrorModules should reject non-object input',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-CM3', {}, libPictSectionMarkdownEditor);

						let tmpResult = tmpView.connectCodeMirrorModules('not an object');
						Expect(tmpResult).to.equal(false);
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Public API (pre-initialization)',
			() =>
			{
				test
				(
					'getSegmentCount should return 0 before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-API1', {}, libPictSectionMarkdownEditor);
						Expect(tmpView.getSegmentCount()).to.equal(0);
						return fDone();
					}
				);
				test
				(
					'getAllContent should return empty string before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-API2', {}, libPictSectionMarkdownEditor);
						Expect(tmpView.getAllContent()).to.equal('');
						return fDone();
					}
				);
				test
				(
					'getSegmentContent should return empty string for out-of-range index',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-API3', {}, libPictSectionMarkdownEditor);
						Expect(tmpView.getSegmentContent(0)).to.equal('');
						Expect(tmpView.getSegmentContent(-1)).to.equal('');
						return fDone();
					}
				);
				test
				(
					'destroy should not throw before initialization',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-Destroy', {}, libPictSectionMarkdownEditor);
						tmpView.destroy();
						Expect(Object.keys(tmpView._segmentEditors).length).to.equal(0);
						return fDone();
					}
				);
				test
				(
					'setReadOnly should update the option',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-RO', {}, libPictSectionMarkdownEditor);
						Expect(tmpView.options.ReadOnly).to.equal(false);
						tmpView.setReadOnly(true);
						Expect(tmpView.options.ReadOnly).to.equal(true);
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Data Management',
			() =>
			{
				test
				(
					'Should read segments from configured data address',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						tmpPict.AppData.Document = {
							Segments: [
								{ Content: '# Hello' },
								{ Content: 'World' }
							]
						};
						let tmpView = tmpPict.addView(
							'Pict-View-TestMDE-Data1',
							{ ContentDataAddress: 'AppData.Document.Segments' },
							libPictSectionMarkdownEditor
						);

						let tmpSegments = tmpView._getSegmentsFromData();
						Expect(tmpSegments).to.be.an('array');
						Expect(tmpSegments.length).to.equal(2);
						Expect(tmpSegments[0].Content).to.equal('# Hello');
						Expect(tmpSegments[1].Content).to.equal('World');
						return fDone();
					}
				);
				test
				(
					'Should return null when no data address is configured',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView(
							'Pict-View-TestMDE-Data2',
							{},
							libPictSectionMarkdownEditor
						);

						let tmpSegments = tmpView._getSegmentsFromData();
						Expect(tmpSegments).to.equal(null);
						return fDone();
					}
				);
				test
				(
					'Should write segments to configured data address',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						tmpPict.AppData.Document = {};
						let tmpView = tmpPict.addView(
							'Pict-View-TestMDE-Data3',
							{ ContentDataAddress: 'AppData.Document.Segments' },
							libPictSectionMarkdownEditor
						);

						let tmpNewSegments = [{ Content: 'Test content' }];
						tmpView._setSegmentsToData(tmpNewSegments);

						Expect(tmpPict.AppData.Document.Segments).to.be.an('array');
						Expect(tmpPict.AppData.Document.Segments.length).to.equal(1);
						Expect(tmpPict.AppData.Document.Segments[0].Content).to.equal('Test content');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Template Configuration',
			() =>
			{
				test
				(
					'Should have required templates in default configuration',
					(fDone) =>
					{
						let tmpConfig = libPictSectionMarkdownEditor.default_configuration;
						let tmpTemplates = tmpConfig.Templates;
						Expect(tmpTemplates).to.be.an('array');

						let tmpTemplateHashes = tmpTemplates.map((t) => t.Hash);
						Expect(tmpTemplateHashes).to.include('MarkdownEditor-Container');
						Expect(tmpTemplateHashes).to.include('MarkdownEditor-Segment');
						Expect(tmpTemplateHashes).to.include('MarkdownEditor-AddSegment');
						return fDone();
					}
				);
				test
				(
					'Should have renderables in default configuration',
					(fDone) =>
					{
						let tmpConfig = libPictSectionMarkdownEditor.default_configuration;
						Expect(tmpConfig.Renderables).to.be.an('array');
						Expect(tmpConfig.Renderables.length).to.be.greaterThan(0);
						Expect(tmpConfig.Renderables[0].RenderableHash).to.equal('MarkdownEditor-Wrap');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Hook Methods',
			() =>
			{
				test
				(
					'customConfigureExtensions should return extensions unchanged by default',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-Hooks1', {}, libPictSectionMarkdownEditor);

						let tmpExtensions = ['ext1', 'ext2'];
						let tmpResult = tmpView.customConfigureExtensions(tmpExtensions, 0);
						Expect(tmpResult).to.deep.equal(['ext1', 'ext2']);
						return fDone();
					}
				);
				test
				(
					'onContentChange should be callable without error',
					(fDone) =>
					{
						let tmpPict = configureTestPict();
						let tmpView = tmpPict.addView('Pict-View-TestMDE-Hooks2', {}, libPictSectionMarkdownEditor);

						// Should not throw
						tmpView.onContentChange(0, 'test content');
						return fDone();
					}
				);
			}
		);
	}
);
