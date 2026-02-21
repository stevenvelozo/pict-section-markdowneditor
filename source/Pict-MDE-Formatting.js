/**
 * Pict-MDE-Formatting: Helper module for PictSectionMarkdownEditor
 *
 * Handles markdown formatting operations (bold, italic, code, heading, link)
 * applied to selections or at the cursor position in CodeMirror editors.
 */

// Markdown formatting definitions: wrapper characters for toggle-style formatting
const _FormattingMap =
{
	bold: { wrap: '**' },
	italic: { wrap: '*' },
	code: { wrap: '`' },
	heading: { prefix: '# ' },
	link: { before: '[', after: '](url)' }
};

/**
 * Attach formatting methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */
module.exports.attach = function attach(pView)
{
	/**
	 * Apply markdown formatting to the selection (or insert formatting at cursor)
	 * in a specific segment.
	 *
	 * If text is selected, wraps it.  If no selection, inserts the formatting
	 * markers and places the cursor between them.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pFormatType - One of: 'bold', 'italic', 'code', 'heading', 'link'
	 */
	pView.applyFormatting = function applyFormatting(pSegmentIndex, pFormatType)
	{
		let tmpEditor = pView._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			pView.log.warn(`PICT-MarkdownEditor applyFormatting: no editor for segment ${pSegmentIndex}.`);
			return;
		}

		let tmpFormat = _FormattingMap[pFormatType];
		if (!tmpFormat)
		{
			pView.log.warn(`PICT-MarkdownEditor applyFormatting: unknown format type "${pFormatType}".`);
			return;
		}

		let tmpState = tmpEditor.state;
		let tmpSelection = tmpState.selection.main;
		let tmpFrom = tmpSelection.from;
		let tmpTo = tmpSelection.to;
		let tmpHasSelection = (tmpFrom !== tmpTo);
		let tmpSelectedText = tmpHasSelection ? tmpState.sliceDoc(tmpFrom, tmpTo) : '';

		let tmpChanges;
		let tmpCursorPos;

		if (tmpFormat.wrap)
		{
			// Toggle-style: wrap selection or insert empty wrapper
			let tmpWrap = tmpFormat.wrap;
			if (tmpHasSelection)
			{
				// Check if already wrapped — if so, unwrap
				let tmpBefore = tmpState.sliceDoc(Math.max(0, tmpFrom - tmpWrap.length), tmpFrom);
				let tmpAfter = tmpState.sliceDoc(tmpTo, Math.min(tmpState.doc.length, tmpTo + tmpWrap.length));

				if (tmpBefore === tmpWrap && tmpAfter === tmpWrap)
				{
					// Unwrap
					tmpChanges = [
						{ from: tmpFrom - tmpWrap.length, to: tmpFrom, insert: '' },
						{ from: tmpTo, to: tmpTo + tmpWrap.length, insert: '' }
					];
					tmpCursorPos = tmpFrom - tmpWrap.length;
					tmpEditor.dispatch(
					{
						changes: tmpChanges,
						selection: { anchor: tmpCursorPos, head: tmpCursorPos + tmpSelectedText.length }
					});
					return;
				}

				// Wrap the selection
				let tmpInsert = tmpWrap + tmpSelectedText + tmpWrap;
				tmpChanges = { from: tmpFrom, to: tmpTo, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpWrap.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos, head: tmpCursorPos + tmpSelectedText.length }
				});
			}
			else
			{
				// No selection: insert empty wrapper and place cursor inside
				let tmpInsert = tmpWrap + tmpWrap;
				tmpChanges = { from: tmpFrom, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpWrap.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos }
				});
			}
		}
		else if (tmpFormat.prefix)
		{
			// Line-prefix style (headings)
			let tmpLine = tmpState.doc.lineAt(tmpFrom);
			let tmpLineText = tmpLine.text;

			// Toggle: if line already starts with the prefix, remove it; otherwise add
			if (tmpLineText.startsWith(tmpFormat.prefix))
			{
				tmpChanges = { from: tmpLine.from, to: tmpLine.from + tmpFormat.prefix.length, insert: '' };
			}
			else
			{
				tmpChanges = { from: tmpLine.from, insert: tmpFormat.prefix };
			}
			tmpEditor.dispatch({ changes: tmpChanges });
		}
		else if (tmpFormat.before && tmpFormat.after)
		{
			// Surround style (links)
			if (tmpHasSelection)
			{
				let tmpInsert = tmpFormat.before + tmpSelectedText + tmpFormat.after;
				tmpChanges = { from: tmpFrom, to: tmpTo, insert: tmpInsert };
				// Place cursor on the "url" part
				tmpCursorPos = tmpFrom + tmpFormat.before.length + tmpSelectedText.length + 2;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos, head: tmpCursorPos + 3 }
				});
			}
			else
			{
				let tmpInsert = tmpFormat.before + tmpFormat.after;
				tmpChanges = { from: tmpFrom, insert: tmpInsert };
				tmpCursorPos = tmpFrom + tmpFormat.before.length;
				tmpEditor.dispatch(
				{
					changes: tmpChanges,
					selection: { anchor: tmpCursorPos }
				});
			}
		}

		// Re-focus the editor after clicking a sidebar button
		tmpEditor.focus();
	};
};
