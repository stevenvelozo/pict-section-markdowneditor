const libPictApplication = require('pict-application');
const libPictSectionContent = require('pict-section-content');
const libPictSectionMarkdownEditor = require('../../source/Pict-Section-MarkdownEditor.js');

// ---------------------------------------------------------------------------
// The Book: "De Architectura Digitalis" — a lorem-ipsum reference with
// charts, equations, images and tables scattered through the chapters.
// ---------------------------------------------------------------------------
const _BookMarkdown = [
	// ---- Title / Intro (no ## — treated as the preamble) ----
	'# De Architectura Digitalis',
	'',
	'*A Comprehensive Guide to Imaginary Systems*',
	'',
	'> "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupery',
	'',
	'This volume surveys the theory and practice of digital architecture, from first principles through advanced topics. Each chapter may be edited independently by clicking the pencil icon.',
	'',
	'---',
	'',

	// ---- Chapter 1 ----
	'## Chapter 1 — Foundations of Structure',
	'',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
	'',
	'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	'',
	'### Core Terminology',
	'',
	'| Term | Definition | Example |',
	'| --- | --- | --- |',
	'| Node | An atomic unit of computation | A service instance |',
	'| Edge | A connection between two nodes | An API call |',
	'| Graph | A collection of nodes and edges | A microservice mesh |',
	'| Weight | A numeric cost on an edge | Latency in ms |',
	'',
	'The relationship between nodes can be expressed as $G = (V, E)$ where $V$ is the vertex set and $E \\subseteq V \\times V$ is the edge set.',
	'',

	// ---- Chapter 2 ----
	'## Chapter 2 — The Flow of Information',
	'',
	'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
	'',
	'```mermaid',
	'graph LR',
	'    Source[Data Source] --> Ingest[Ingestion Layer]',
	'    Ingest --> Transform[Transform Pipeline]',
	'    Transform --> Store[(Data Lake)]',
	'    Store --> Index[Search Index]',
	'    Store --> Analytics[Analytics Engine]',
	'    Index --> API[Query API]',
	'    Analytics --> Dashboard[Dashboard]',
	'```',
	'',
	'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
	'',
	'The throughput of a pipeline with $n$ stages and individual latencies $l_i$ is bounded by:',
	'',
	'$$',
	'T \\leq \\frac{1}{\\max_{i=1}^{n} l_i}',
	'$$',
	'',

	// ---- Chapter 3 ----
	'## Chapter 3 — Equilibrium and Scaling',
	'',
	'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
	'',
	'Scaling behavior follows a logarithmic cost curve. If a system serves $N$ users with $k$ replicas, the cost per user approaches:',
	'',
	'$$',
	'C(N) = \\frac{C_0 \\cdot k}{N} + c_{\\text{marginal}} \\cdot \\log_2(N)',
	'$$',
	'',
	'where $C_0$ is the base infrastructure cost and $c_{\\text{marginal}}$ is the per-doubling overhead.',
	'',
	'![Placeholder diagram](https://placehold.co/600x200/E8E0D4/5E5549?text=Scaling+Curve+Visualization)',
	'',
	'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
	'',

	// ---- Chapter 4 ----
	'## Chapter 4 — Pattern Languages',
	'',
	'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
	'',
	'### The Observer Pattern',
	'',
	'```javascript',
	'class EventBus extends libFableServiceProviderBase',
	'{',
	'	constructor(pFable, pOptions, pServiceHash)',
	'	{',
	'		super(pFable, pOptions, pServiceHash);',
	'		this._listeners = {};',
	'	}',
	'',
	'	on(pEvent, fHandler)',
	'	{',
	'		if (!this._listeners[pEvent])',
	'		{',
	'			this._listeners[pEvent] = [];',
	'		}',
	'		this._listeners[pEvent].push(fHandler);',
	'	}',
	'',
	'	emit(pEvent, pData)',
	'	{',
	'		let tmpHandlers = this._listeners[pEvent] || [];',
	'		for (let i = 0; i < tmpHandlers.length; i++)',
	'		{',
	'			tmpHandlers[i](pData);',
	'		}',
	'	}',
	'}',
	'```',
	'',
	'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
	'',

	// ---- Chapter 5 ----
	'## Chapter 5 — Networks and Topology',
	'',
	'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
	'',
	'```mermaid',
	'graph TD',
	'    LB[Load Balancer] --> A[Service A]',
	'    LB --> B[Service B]',
	'    LB --> C[Service C]',
	'    A --> Cache[(Redis Cache)]',
	'    B --> Cache',
	'    C --> Cache',
	'    A --> DB[(Primary DB)]',
	'    B --> DB',
	'    C --> Replica[(Read Replica)]',
	'    DB --> Replica',
	'```',
	'',
	'The diameter of a network graph $G$ is $d(G) = \\max_{u,v \\in V} \\delta(u,v)$, where $\\delta(u,v)$ is the shortest path length.',
	'',
	'For a balanced binary tree with $n$ nodes, the diameter is $2 \\lfloor \\log_2 n \\rfloor$, and the average path length grows as:',
	'',
	'$$',
	'\\bar{d} \\approx \\frac{2(n+1)}{n} \\left( H_{n+1} - 1 \\right) \\approx 2 \\ln n',
	'$$',
	'',
	'where $H_n$ is the $n$-th harmonic number.',
	'',

	// ---- Chapter 6 ----
	'## Chapter 6 — Probabilistic Methods',
	'',
	'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
	'',
	'A Bloom filter with $m$ bits, $k$ hash functions, and $n$ inserted elements has a false-positive probability of approximately:',
	'',
	'$$',
	'P_{\\text{fp}} \\approx \\left(1 - e^{-kn/m}\\right)^k',
	'$$',
	'',
	'The optimal number of hash functions is $k^* = \\frac{m}{n} \\ln 2$, which gives:',
	'',
	'$$',
	'P_{\\text{fp}}^* \\approx \\left(\\frac{1}{2}\\right)^{k^*} = 2^{-(m/n)\\ln 2}',
	'$$',
	'',
	'![Bloom filter illustration](https://placehold.co/600x180/3D3229/E8E0D4?text=Bloom+Filter+Bit+Array)',
	'',
	'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
	'',

	// ---- Chapter 7 ----
	'## Chapter 7 — Temporal Dynamics',
	'',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
	'',
	'```mermaid',
	'sequenceDiagram',
	'    participant Client',
	'    participant Gateway',
	'    participant Auth',
	'    participant Service',
	'    participant DB',
	'',
	'    Client->>Gateway: Request',
	'    Gateway->>Auth: Validate Token',
	'    Auth-->>Gateway: OK',
	'    Gateway->>Service: Forward Request',
	'    Service->>DB: Query',
	'    DB-->>Service: Result',
	'    Service-->>Gateway: Response',
	'    Gateway-->>Client: Response',
	'```',
	'',
	'The response time $R$ of a serial request chain with $n$ services follows:',
	'',
	'$$',
	'R = \\sum_{i=1}^{n} (r_i + q_i)',
	'$$',
	'',
	'where $r_i$ is the processing time and $q_i$ is the queue wait time at stage $i$. By Little\'s Law, the average queue length is $L = \\lambda W$ where $\\lambda$ is the arrival rate and $W$ is the average wait.',
	'',

	// ---- Chapter 8 ----
	'## Chapter 8 — The Art of Compilation',
	'',
	'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
	'',
	'### Pipeline Stages',
	'',
	'```mermaid',
	'graph LR',
	'    Src[Source Code] --> Lex[Lexer]',
	'    Lex --> Parse[Parser]',
	'    Parse --> AST[AST]',
	'    AST --> Opt[Optimizer]',
	'    Opt --> Gen[Code Gen]',
	'    Gen --> Out[Output]',
	'```',
	'',
	'### Example: Template Compilation',
	'',
	'```javascript',
	'function compileTemplate(pSource)',
	'{',
	'	let tmpTokens = tokenize(pSource);',
	'	let tmpAST = parse(tmpTokens);',
	'	let tmpOptimized = optimize(tmpAST);',
	'',
	'	return function render(pData)',
	'	{',
	'		return evaluate(tmpOptimized, pData);',
	'	};',
	'}',
	'```',
	'',
	'The time complexity of parsing a context-free grammar is $O(n^3)$ by the CYK algorithm, but for $LL(k)$ and $LR(k)$ grammars it reduces to $O(n)$.',
	'',

	// ---- Chapter 9 ----
	'## Chapter 9 — Entropy and Information',
	'',
	'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.',
	'',
	'Shannon entropy of a discrete random variable $X$ with outcomes $\\{x_1, \\ldots, x_n\\}$:',
	'',
	'$$',
	'H(X) = -\\sum_{i=1}^{n} p(x_i) \\log_2 p(x_i)',
	'$$',
	'',
	'For a binary source with probability $p$, the binary entropy function is:',
	'',
	'$$',
	'H_b(p) = -p \\log_2 p - (1-p) \\log_2 (1-p)',
	'$$',
	'',
	'| $p$ | $H_b(p)$ bits | Interpretation |',
	'| --- | --- | --- |',
	'| 0.0 | 0.000 | Perfectly predictable (always 0) |',
	'| 0.1 | 0.469 | Low uncertainty |',
	'| 0.5 | 1.000 | Maximum uncertainty (fair coin) |',
	'| 0.9 | 0.469 | Low uncertainty |',
	'| 1.0 | 0.000 | Perfectly predictable (always 1) |',
	'',
	'Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem.',
	'',

	// ---- Chapter 10 ----
	'## Chapter 10 — Reflections',
	'',
	'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
	'',
	'![Final illustration](https://placehold.co/600x240/264653/FAEDCD?text=End+of+Volume+I)',
	'',
	'> "The purpose of abstraction is not to be vague, but to create a new semantic level in which one can be absolutely precise." — Edsger W. Dijkstra',
	'',
	'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
	'',
	'---',
	'',
	'*End of Volume I*',
].join('\n');


// ---------------------------------------------------------------------------
// Split the book on "## " headings — each section becomes one segment.
// The first segment is everything before the first "## ".
// ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// BookViewerSectionEditorView — a tiny markdown editor that operates on a
// single segment.  Created on-demand when the user clicks "Edit".
// ---------------------------------------------------------------------------
class BookViewerSectionEditorView extends libPictSectionMarkdownEditor
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}


// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------
class BookViewerExampleApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Content provider for rendering markdown → HTML
		this.pict.addProvider(
			'Content-Provider',
			libPictSectionContent.PictContentProvider.default_configuration,
			libPictSectionContent.PictContentProvider
		);

		// The sections parsed from the book
		this._sections = [];

		// Track which section (if any) is currently being edited
		this._editingSectionIndex = -1;

		// The editor view instance (created lazily)
		this._editorView = null;
	}

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

		// Split the book and render
		this._sections = splitOnHeadings(_BookMarkdown);

		// Store in AppData for the editor to use
		this.pict.AppData.Book = { Sections: this._sections.map((s) => ({ Content: s })) };

		this._renderAllSections();
	}

	/**
	 * Render all sections as pict-section-content HTML.
	 */
	_renderAllSections()
	{
		let tmpProvider = this.pict.providers['Content-Provider'];
		let tmpContainer = document.getElementById('BookViewerContainer');
		if (!tmpContainer)
		{
			return;
		}

		tmpContainer.innerHTML = '';

		for (let i = 0; i < this._sections.length; i++)
		{
			this._renderSectionContent(tmpContainer, i);
		}
	}

	/**
	 * Render a single section as read-only rendered content with an edit button.
	 */
	_renderSectionContent(pContainer, pIndex)
	{
		let tmpProvider = this.pict.providers['Content-Provider'];
		let tmpMarkdown = this._sections[pIndex];
		let tmpHTML = tmpProvider.parseMarkdown(tmpMarkdown);

		let tmpSectionDiv = document.createElement('div');
		tmpSectionDiv.className = 'book-section';
		tmpSectionDiv.id = `BookSection-${pIndex}`;
		tmpSectionDiv.setAttribute('data-section-index', String(pIndex));

		let tmpToolbar = document.createElement('div');
		tmpToolbar.className = 'book-section-toolbar';

		let tmpEditBtn = document.createElement('button');
		tmpEditBtn.className = 'book-section-edit-btn';
		tmpEditBtn.innerHTML = '&#x270E; Edit';
		tmpEditBtn.title = 'Edit this section';
		tmpEditBtn.onclick = () =>
		{
			this.editSection(pIndex);
		};
		tmpToolbar.appendChild(tmpEditBtn);

		let tmpContentDiv = document.createElement('div');
		tmpContentDiv.className = 'pict-content book-section-content';
		tmpContentDiv.id = `BookSectionContent-${pIndex}`;
		tmpContentDiv.innerHTML = tmpHTML;

		tmpSectionDiv.appendChild(tmpToolbar);
		tmpSectionDiv.appendChild(tmpContentDiv);
		pContainer.appendChild(tmpSectionDiv);

		// Post-render: mermaid and katex
		this._postRenderSection(pIndex);
	}

	/**
	 * Post-render mermaid and KaTeX for a section.
	 */
	_postRenderSection(pIndex)
	{
		let tmpContainerID = `BookSectionContent-${pIndex}`;
		let tmpContainer = document.getElementById(tmpContainerID);
		if (!tmpContainer)
		{
			return;
		}

		// Mermaid
		if (typeof mermaid !== 'undefined')
		{
			let tmpMermaidNodes = tmpContainer.querySelectorAll('pre.mermaid');
			if (tmpMermaidNodes.length > 0)
			{
				try
				{
					mermaid.run({ nodes: tmpMermaidNodes });
				}
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

	/**
	 * Switch a section into edit mode: replace the rendered content with a
	 * single-segment markdown editor.
	 */
	editSection(pIndex)
	{
		// If already editing another section, finish it first
		if (this._editingSectionIndex >= 0)
		{
			this.finishEditing();
		}

		this._editingSectionIndex = pIndex;

		let tmpSectionDiv = document.getElementById(`BookSection-${pIndex}`);
		if (!tmpSectionDiv)
		{
			return;
		}

		// Mark it as editing
		tmpSectionDiv.classList.add('book-section-editing');

		// Replace the toolbar button with "Done"
		let tmpToolbar = tmpSectionDiv.querySelector('.book-section-toolbar');
		if (tmpToolbar)
		{
			tmpToolbar.innerHTML = '';
			let tmpDoneBtn = document.createElement('button');
			tmpDoneBtn.className = 'book-section-done-btn';
			tmpDoneBtn.innerHTML = '&#x2713; Done';
			tmpDoneBtn.title = 'Finish editing this section';
			tmpDoneBtn.onclick = () =>
			{
				this.finishEditing();
			};
			tmpToolbar.appendChild(tmpDoneBtn);
		}

		// Replace the content area with an editor container
		let tmpContentDiv = tmpSectionDiv.querySelector('.book-section-content');
		if (tmpContentDiv)
		{
			tmpContentDiv.className = 'book-section-editor-container';
			tmpContentDiv.id = `BookSectionEditor-${pIndex}`;
			tmpContentDiv.innerHTML = '';
		}

		// Set up AppData for this single segment
		this.pict.AppData.EditingSection = { Segments: [{ Content: this._sections[pIndex] }] };

		// Destroy previous editor view if it exists
		if (this._editorView)
		{
			this._editorView.destroy();
			// Remove from pict's view registry
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

	/**
	 * Finish editing: marshal the editor content back into the sections array,
	 * destroy the editor, and re-render the section as content.
	 */
	finishEditing()
	{
		if (this._editingSectionIndex < 0)
		{
			return;
		}

		let tmpIndex = this._editingSectionIndex;
		this._editingSectionIndex = -1;

		// Marshal editor content back
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

		// Update AppData
		this.pict.AppData.Book.Sections[tmpIndex].Content = this._sections[tmpIndex];

		// Re-render this section as content
		let tmpSectionDiv = document.getElementById(`BookSection-${tmpIndex}`);
		if (!tmpSectionDiv)
		{
			return;
		}

		let tmpParent = tmpSectionDiv.parentElement;
		let tmpNextSibling = tmpSectionDiv.nextSibling;
		tmpSectionDiv.remove();

		// Re-create the section
		let tmpNewSection = document.createElement('div');
		tmpNewSection.id = `BookSection-placeholder-${tmpIndex}`;
		if (tmpNextSibling)
		{
			tmpParent.insertBefore(tmpNewSection, tmpNextSibling);
		}
		else
		{
			tmpParent.appendChild(tmpNewSection);
		}

		// Build the real section
		let tmpProvider = this.pict.providers['Content-Provider'];
		let tmpMarkdown = this._sections[tmpIndex];
		let tmpHTML = tmpProvider.parseMarkdown(tmpMarkdown);

		tmpNewSection.className = 'book-section';
		tmpNewSection.id = `BookSection-${tmpIndex}`;
		tmpNewSection.setAttribute('data-section-index', String(tmpIndex));

		let tmpToolbar = document.createElement('div');
		tmpToolbar.className = 'book-section-toolbar';

		let tmpEditBtn = document.createElement('button');
		tmpEditBtn.className = 'book-section-edit-btn';
		tmpEditBtn.innerHTML = '&#x270E; Edit';
		tmpEditBtn.title = 'Edit this section';
		let tmpSelf = this;
		tmpEditBtn.onclick = () =>
		{
			tmpSelf.editSection(tmpIndex);
		};
		tmpToolbar.appendChild(tmpEditBtn);

		let tmpContentDiv = document.createElement('div');
		tmpContentDiv.className = 'pict-content book-section-content';
		tmpContentDiv.id = `BookSectionContent-${tmpIndex}`;
		tmpContentDiv.innerHTML = tmpHTML;

		tmpNewSection.innerHTML = '';
		tmpNewSection.appendChild(tmpToolbar);
		tmpNewSection.appendChild(tmpContentDiv);

		this._postRenderSection(tmpIndex);
	}
}

module.exports = BookViewerExampleApplication;

module.exports.default_configuration = (
{
	"Name": "Book Viewer Example",
	"Hash": "BookViewerExample",
	"pict_configuration":
	{
		"Product": "BookViewer-Example",
		"DefaultAppData":
		{
			"Book": { "Sections": [] }
		}
	}
});
