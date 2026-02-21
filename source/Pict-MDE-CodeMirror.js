/**
 * Pict-MDE-CodeMirror: Helper module for PictSectionMarkdownEditor
 *
 * Handles CodeMirror editor instance creation, extension configuration,
 * keyboard shortcuts, paste handling, and the data URI collapse extension.
 */

/**
 * Attach CodeMirror editor creation methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */
module.exports.attach = function attach(pView)
{
	/**
	 * Create a CodeMirror editor instance inside a container element.
	 *
	 * @param {HTMLElement} pContainer - The DOM element to mount the editor in
	 * @param {number} pSegmentIndex - The segment index
	 * @param {string} pContent - The initial content
	 */
	pView._createEditorInContainer = function _createEditorInContainer(pContainer, pSegmentIndex, pContent)
	{
		let tmpCM = pView._codeMirrorModules;

		// Build the extensions array
		let tmpExtensions = [];

		// Add consumer-provided extensions (e.g. basicSetup, markdown())
		if (tmpCM.extensions && Array.isArray(tmpCM.extensions))
		{
			tmpExtensions = tmpExtensions.concat(tmpCM.extensions);
		}

		// Update listener for content changes, focus, and cursor tracking
		tmpExtensions.push(
			tmpCM.EditorView.updateListener.of((pUpdate) =>
			{
				if (pUpdate.docChanged)
				{
					pView._onSegmentContentChange(pSegmentIndex, pUpdate.state.doc.toString());
				}

				// Track focus changes to toggle the active class
				if (pUpdate.focusChanged)
				{
					if (pUpdate.view.hasFocus)
					{
						pView._setActiveSegment(pSegmentIndex);
						// Position sidebar at cursor on focus
						pView._updateSidebarPosition(pSegmentIndex);
					}
					else
					{
						// Small delay so clicking a sidebar button doesn't immediately deactivate
						setTimeout(() =>
						{
							if (pView._activeSegmentIndex === pSegmentIndex)
							{
								// Check if focus moved to another segment or truly left
								let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
								if (tmpSegEl && !tmpSegEl.contains(document.activeElement))
								{
									pView._clearActiveSegment(pSegmentIndex);
									pView._resetSidebarPosition(pSegmentIndex);
								}
							}
						}, 100);
					}
				}

				// Track cursor/selection changes to move the sidebar
				if (pUpdate.selectionSet && pUpdate.view.hasFocus)
				{
					pView._updateSidebarPosition(pSegmentIndex);
				}
			})
		);

		// Keyboard shortcuts for formatting and image paste handling
		tmpExtensions.push(
			tmpCM.EditorView.domEventHandlers(
			{
				keydown: (pEvent, pEditorView) =>
				{
					// Ctrl/Cmd + B = bold
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'b')
					{
						pEvent.preventDefault();
						pView.applyFormatting(pSegmentIndex, 'bold');
						return true;
					}
					// Ctrl/Cmd + I = italic
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'i')
					{
						pEvent.preventDefault();
						pView.applyFormatting(pSegmentIndex, 'italic');
						return true;
					}
					// Ctrl/Cmd + E = inline code
					if ((pEvent.ctrlKey || pEvent.metaKey) && pEvent.key === 'e')
					{
						pEvent.preventDefault();
						pView.applyFormatting(pSegmentIndex, 'code');
						return true;
					}
				},
				paste: (pEvent, pEditorView) =>
				{
					// Check clipboard for image data
					let tmpItems = pEvent.clipboardData && pEvent.clipboardData.items;
					if (!tmpItems)
					{
						return false;
					}
					for (let i = 0; i < tmpItems.length; i++)
					{
						if (tmpItems[i].type.startsWith('image/'))
						{
							pEvent.preventDefault();
							let tmpFile = tmpItems[i].getAsFile();
							if (tmpFile)
							{
								pView._processImageFile(tmpFile, pSegmentIndex);
							}
							return true;
						}
					}
					return false;
				}
			})
		);

		// Collapse long data URIs in image markdown so the editor is readable
		let tmpCollapseExtension = pView._buildDataURICollapseExtension();
		if (tmpCollapseExtension)
		{
			tmpExtensions.push(tmpCollapseExtension);
		}

		// Make read-only if configured
		if (pView.options.ReadOnly)
		{
			tmpExtensions.push(tmpCM.EditorState.readOnly.of(true));
			tmpExtensions.push(tmpCM.EditorView.editable.of(false));
		}

		// Allow consumer to customize extensions
		tmpExtensions = pView.customConfigureExtensions(tmpExtensions, pSegmentIndex);

		let tmpState = tmpCM.EditorState.create(
		{
			doc: pContent || '',
			extensions: tmpExtensions
		});

		let tmpEditorView = new tmpCM.EditorView(
		{
			state: tmpState,
			parent: pContainer
		});

		pView._segmentEditors[pSegmentIndex] = tmpEditorView;
	};

	/**
	 * Build a CodeMirror extension that visually collapses long data URIs
	 * inside markdown image syntax.
	 *
	 * The extension uses Decoration.replace() to hide the long base64 portion
	 * and show a compact widget instead, e.g. "data:image/jpeg;base64...28KB".
	 * The actual document content is unchanged -- only the visual display
	 * is affected.
	 *
	 * Returns null if the required CodeMirror modules (Decoration, ViewPlugin,
	 * WidgetType) are not available.
	 *
	 * @returns {object|null} A CodeMirror ViewPlugin extension, or null
	 */
	pView._buildDataURICollapseExtension = function _buildDataURICollapseExtension()
	{
		let tmpCM = pView._codeMirrorModules;

		// All three classes are required -- degrade gracefully if not available
		if (!tmpCM || !tmpCM.Decoration || !tmpCM.ViewPlugin || !tmpCM.WidgetType)
		{
			return null;
		}

		let tmpDecoration = tmpCM.Decoration;
		let tmpViewPlugin = tmpCM.ViewPlugin;
		let tmpWidgetType = tmpCM.WidgetType;

		// Minimum data URI length before collapsing (short URIs are left alone)
		let tmpMinLength = 200;

		// Widget class: renders the collapsed placeholder inline
		class DataURIWidget extends tmpWidgetType
		{
			constructor(pLabel)
			{
				super();
				this.label = pLabel;
			}

			toDOM()
			{
				let tmpSpan = document.createElement('span');
				tmpSpan.className = 'pict-mde-data-uri-collapsed';
				tmpSpan.textContent = this.label;
				tmpSpan.title = 'Data URI (click to expand in image preview below)';
				return tmpSpan;
			}

			eq(pOther)
			{
				return this.label === pOther.label;
			}
		}

		/**
		 * Scan the visible ranges of the document for data URIs inside image
		 * markdown and build a DecorationSet that replaces the long portion.
		 *
		 * Pattern:  ![alt](data:image/TYPE;base64,LONGSTRING)
		 *
		 * We keep "![alt](data:image/TYPE;base64," visible and replace only the
		 * long base64 payload plus the closing ")" with a compact widget.
		 */
		function buildDecorations(pEditorView)
		{
			let tmpDecorations = [];
			let tmpDoc = pEditorView.state.doc;

			for (let tmpVisRange of pEditorView.visibleRanges)
			{
				let tmpFrom = tmpVisRange.from;
				let tmpTo = tmpVisRange.to;
				let tmpText = tmpDoc.sliceString(tmpFrom, tmpTo);

				// Match: ![...](data:image/...;base64,...) -- we need positions of the base64 payload
				let tmpRegex = /!\[[^\]]*\]\(data:([^;]+);base64,/g;
				let tmpMatch;

				while ((tmpMatch = tmpRegex.exec(tmpText)) !== null)
				{
					// tmpMatch[0] is "![alt](data:image/png;base64,"
					// tmpMatch[1] is the MIME subtype, e.g. "image/png"
					let tmpPayloadStart = tmpFrom + tmpMatch.index + tmpMatch[0].length;

					// Find the closing parenthesis -- scan forward from payloadStart
					let tmpPayloadEnd = -1;
					let tmpSearchFrom = tmpPayloadStart;
					let tmpDocLength = tmpDoc.length;

					// Scan character by character in the document for the closing ')'
					// We need to handle this carefully since the payload could be huge
					// and span beyond the visible range.
					// Search up to 5MB worth of characters (way more than any realistic image).
					let tmpMaxScan = Math.min(tmpDocLength, tmpSearchFrom + 5 * 1024 * 1024);
					let tmpChunkSize = 4096;

					for (let tmpPos = tmpSearchFrom; tmpPos < tmpMaxScan; tmpPos += tmpChunkSize)
					{
						let tmpEnd = Math.min(tmpPos + tmpChunkSize, tmpMaxScan);
						let tmpChunk = tmpDoc.sliceString(tmpPos, tmpEnd);
						let tmpParenIdx = tmpChunk.indexOf(')');
						if (tmpParenIdx >= 0)
						{
							tmpPayloadEnd = tmpPos + tmpParenIdx;
							break;
						}
					}

					if (tmpPayloadEnd < 0)
					{
						// No closing paren found -- skip this match
						continue;
					}

					// Calculate the payload length (base64 data between comma and closing paren)
					let tmpPayloadLength = tmpPayloadEnd - tmpPayloadStart;

					if (tmpPayloadLength < tmpMinLength)
					{
						// Too short to bother collapsing
						continue;
					}

					// Build a human-readable size label
					let tmpSizeBytes = Math.round(tmpPayloadLength * 0.75); // base64 to bytes approx
					let tmpSizeLabel;
					if (tmpSizeBytes >= 1024 * 1024)
					{
						tmpSizeLabel = (tmpSizeBytes / (1024 * 1024)).toFixed(1) + 'MB';
					}
					else if (tmpSizeBytes >= 1024)
					{
						tmpSizeLabel = Math.round(tmpSizeBytes / 1024) + 'KB';
					}
					else
					{
						tmpSizeLabel = tmpSizeBytes + 'B';
					}

					let tmpMimeType = tmpMatch[1] || 'image';
					let tmpWidgetLabel = `\u2026${tmpSizeLabel})`;

					// Replace from the start of the base64 payload to after the closing paren
					let tmpWidget = tmpDecoration.replace(
					{
						widget: new DataURIWidget(tmpWidgetLabel)
					});

					tmpDecorations.push(tmpWidget.range(tmpPayloadStart, tmpPayloadEnd + 1));
				}
			}

			return tmpDecoration.set(tmpDecorations, true);
		}

		// Create the ViewPlugin
		let tmpPlugin = tmpViewPlugin.fromClass(
			class
			{
				constructor(pEditorView)
				{
					this.decorations = buildDecorations(pEditorView);
				}

				update(pUpdate)
				{
					if (pUpdate.docChanged || pUpdate.viewportChanged)
					{
						this.decorations = buildDecorations(pUpdate.view);
					}
				}
			},
			{
				decorations: (pPlugin) => pPlugin.decorations
			}
		);

		return tmpPlugin;
	};
};
