/**
 * Pict-MDE-DragAndReorder: Helper module for PictSectionMarkdownEditor
 *
 * Handles segment drag-and-drop reordering, active segment management,
 * sidebar cursor-tracking positioning, and hidden-preview state maintenance
 * across reorder operations.
 */

/**
 * Attach drag/reorder and active-segment methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */
module.exports.attach = function attach(pView)
{
	/**
	 * Wire drag-and-drop events on a segment element for reorder via the drag handle.
	 *
	 * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._wireSegmentDragEvents = function _wireSegmentDragEvents(pSegmentElement, pSegmentIndex)
	{
		let tmpHandle = pSegmentElement.querySelector('.pict-mde-drag-handle');
		if (!tmpHandle)
		{
			return;
		}

		// The drag handle is the draggable element
		tmpHandle.addEventListener('dragstart', (pEvent) =>
		{
			pView._dragSourceIndex = pSegmentIndex;
			pEvent.dataTransfer.effectAllowed = 'move';
			pEvent.dataTransfer.setData('text/plain', String(pSegmentIndex));
			// Add a dragging class to the container so CSS can disable pointer-events
			// on CodeMirror editors (preventing them from intercepting the drop event)
			let tmpContainerEl = pView._getContainerElement();
			if (tmpContainerEl)
			{
				tmpContainerEl.classList.add('pict-mde-dragging');
			}
			setTimeout(() =>
			{
				pSegmentElement.style.opacity = '0.4';
			}, 0);
		});

		tmpHandle.addEventListener('dragend', () =>
		{
			pSegmentElement.style.opacity = '';
			pView._dragSourceIndex = -1;
			pView._clearAllDropIndicators();
			// Remove the dragging class from the container
			let tmpContainerEl = pView._getContainerElement();
			if (tmpContainerEl)
			{
				tmpContainerEl.classList.remove('pict-mde-dragging');
			}
		});

		// Drop target: the whole segment row. We determine above/below from mouse Y.
		pSegmentElement.addEventListener('dragover', (pEvent) =>
		{
			pEvent.preventDefault();
			pEvent.dataTransfer.dropEffect = 'move';

			// Clear all indicators first, then set the correct one
			pView._clearAllDropIndicators();

			// Determine if cursor is in the top or bottom half of this segment
			let tmpRect = pSegmentElement.getBoundingClientRect();
			let tmpMidY = tmpRect.top + (tmpRect.height / 2);
			if (pEvent.clientY < tmpMidY)
			{
				pSegmentElement.classList.add('pict-mde-drag-over-top');
			}
			else
			{
				pSegmentElement.classList.add('pict-mde-drag-over-bottom');
			}
		});

		pSegmentElement.addEventListener('dragleave', (pEvent) =>
		{
			// Only clear if we're actually leaving the element (not entering a child)
			if (!pSegmentElement.contains(pEvent.relatedTarget))
			{
				pSegmentElement.classList.remove('pict-mde-drag-over-top');
				pSegmentElement.classList.remove('pict-mde-drag-over-bottom');
			}
		});

		pSegmentElement.addEventListener('drop', (pEvent) =>
		{
			pEvent.preventDefault();

			let tmpDropBelow = pSegmentElement.classList.contains('pict-mde-drag-over-bottom');
			pView._clearAllDropIndicators();

			let tmpSourceIndex = pView._dragSourceIndex;
			if (tmpSourceIndex < 0 || tmpSourceIndex === pSegmentIndex)
			{
				return;
			}

			pView._reorderSegment(tmpSourceIndex, pSegmentIndex, tmpDropBelow);
		});
	};

	/**
	 * Clear all drop indicator classes from all segments.
	 */
	pView._clearAllDropIndicators = function _clearAllDropIndicators()
	{
		let tmpContainer = pView._getContainerElement();
		if (!tmpContainer)
		{
			return;
		}
		let tmpAllSegments = tmpContainer.querySelectorAll('.pict-mde-segment');
		for (let i = 0; i < tmpAllSegments.length; i++)
		{
			tmpAllSegments[i].classList.remove('pict-mde-drag-over-top');
			tmpAllSegments[i].classList.remove('pict-mde-drag-over-bottom');
		}
	};

	/**
	 * Reorder a segment from one position to another via drag.
	 *
	 * @param {number} pFromInternalIndex - The internal index of the dragged segment
	 * @param {number} pToInternalIndex - The internal index of the drop target
	 * @param {boolean} pDropBelow - Whether the drop was on the bottom half of the target
	 */
	pView._reorderSegment = function _reorderSegment(pFromInternalIndex, pToInternalIndex, pDropBelow)
	{
		let tmpFromLogical = pView._getLogicalIndex(pFromInternalIndex);
		let tmpToLogical = pView._getLogicalIndex(pToInternalIndex);

		if (tmpFromLogical < 0 || tmpToLogical < 0)
		{
			pView.log.warn(`PICT-MarkdownEditor _reorderSegment: could not resolve logical indices (from=${tmpFromLogical}, to=${tmpToLogical}).`);
			return;
		}

		if (tmpFromLogical === tmpToLogical)
		{
			return;
		}

		// Marshal all editor content back to data before manipulating the array
		pView._marshalAllEditorsToData();

		let tmpSegments = pView._getSegmentsFromData();
		if (!tmpSegments || tmpSegments.length < 2)
		{
			return;
		}

		// Calculate the target insertion index
		let tmpInsertAt = pDropBelow ? tmpToLogical + 1 : tmpToLogical;

		// Adjust for the removal shifting indices down
		if (tmpFromLogical < tmpInsertAt)
		{
			tmpInsertAt--;
		}

		// If the insert position equals the source, no move needed
		if (tmpInsertAt === tmpFromLogical)
		{
			return;
		}

		// Perform the reorder: remove from old position, insert at new
		let tmpMoved = tmpSegments.splice(tmpFromLogical, 1)[0];
		tmpSegments.splice(tmpInsertAt, 0, tmpMoved);

		// Explicitly write the reordered array back to the data address
		pView._setSegmentsToData(tmpSegments);

		// Reorder per-segment hidden preview state to follow the moved segment
		pView._reorderHiddenPreviewState(tmpFromLogical, tmpInsertAt);

		pView._buildEditorUI();
	};

	/**
	 * Reorder the hidden preview state after a splice-based move
	 * (remove from pFrom, insert at pTo).
	 *
	 * @param {number} pFrom - The logical index the segment was removed from
	 * @param {number} pTo - The logical index the segment was inserted at
	 */
	pView._reorderHiddenPreviewState = function _reorderHiddenPreviewState(pFrom, pTo)
	{
		if (pFrom === pTo)
		{
			return;
		}

		// Build an ordered array of hidden-state booleans
		let tmpKeys = Object.keys(pView._hiddenPreviewSegments).map((k) => parseInt(k, 10));
		if (tmpKeys.length === 0)
		{
			return;
		}

		let tmpMaxIndex = Math.max(...tmpKeys, pFrom, pTo);
		let tmpStates = [];
		for (let i = 0; i <= tmpMaxIndex; i++)
		{
			tmpStates.push(!!pView._hiddenPreviewSegments[i]);
		}

		// Perform the same splice on the states array
		let tmpMovedState = tmpStates.splice(pFrom, 1)[0];
		tmpStates.splice(pTo, 0, tmpMovedState);

		// Rebuild the hidden map
		pView._hiddenPreviewSegments = {};
		for (let i = 0; i < tmpStates.length; i++)
		{
			if (tmpStates[i])
			{
				pView._hiddenPreviewSegments[i] = true;
			}
		}
	};

	/**
	 * Swap the hidden preview state of two logical indices.
	 * Used when moveSegmentUp/Down swaps adjacent segments.
	 *
	 * @param {number} pIndexA - First logical index
	 * @param {number} pIndexB - Second logical index
	 */
	pView._swapHiddenPreviewState = function _swapHiddenPreviewState(pIndexA, pIndexB)
	{
		let tmpAHidden = !!pView._hiddenPreviewSegments[pIndexA];
		let tmpBHidden = !!pView._hiddenPreviewSegments[pIndexB];

		if (tmpBHidden) { pView._hiddenPreviewSegments[pIndexA] = true; }
		else { delete pView._hiddenPreviewSegments[pIndexA]; }

		if (tmpAHidden) { pView._hiddenPreviewSegments[pIndexB] = true; }
		else { delete pView._hiddenPreviewSegments[pIndexB]; }
	};

	// -- Active Segment Management --

	/**
	 * Set a segment as the active (focused) segment.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._setActiveSegment = function _setActiveSegment(pSegmentIndex)
	{
		// Clear previous active
		if (pView._activeSegmentIndex >= 0 && pView._activeSegmentIndex !== pSegmentIndex)
		{
			let tmpPrevEl = document.getElementById(`PictMDE-Segment-${pView._activeSegmentIndex}`);
			if (tmpPrevEl)
			{
				tmpPrevEl.classList.remove('pict-mde-active');
			}
		}

		pView._activeSegmentIndex = pSegmentIndex;

		let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (tmpSegEl)
		{
			tmpSegEl.classList.add('pict-mde-active');
		}
	};

	/**
	 * Clear the active state from a segment (on blur).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._clearActiveSegment = function _clearActiveSegment(pSegmentIndex)
	{
		if (pView._activeSegmentIndex === pSegmentIndex)
		{
			pView._activeSegmentIndex = -1;
		}

		let tmpSegEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (tmpSegEl)
		{
			tmpSegEl.classList.remove('pict-mde-active');
		}

		// Reset sidebar back to sticky when segment is no longer active
		pView._resetSidebarPosition(pSegmentIndex);
	};

	// -- Sidebar Cursor Tracking --

	/**
	 * Update the sidebar formatting-buttons position so they float next to the
	 * cursor / selection in the active segment.
	 *
	 * When a segment is active and has a cursor, we switch the sidebar-actions
	 * from sticky positioning to absolute, offset to align with the cursor line.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._updateSidebarPosition = function _updateSidebarPosition(pSegmentIndex)
	{
		let tmpSegmentEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (!tmpSegmentEl)
		{
			return;
		}

		let tmpQuadrantTR = tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');
		if (!tmpQuadrantTR)
		{
			return;
		}

		let tmpEditor = pView._segmentEditors[pSegmentIndex];
		if (!tmpEditor)
		{
			return;
		}

		// Get the cursor position in the editor
		let tmpCursorPos = tmpEditor.state.selection.main.head;
		let tmpCursorCoords = tmpEditor.coordsAtPos(tmpCursorPos);
		if (!tmpCursorCoords)
		{
			// If we can't get coords, revert to sticky
			pView._resetSidebarPosition(pSegmentIndex);
			return;
		}

		// Calculate the offset relative to the segment element
		let tmpSegmentRect = tmpSegmentEl.getBoundingClientRect();
		let tmpOffsetTop = tmpCursorCoords.top - tmpSegmentRect.top;

		// Clamp so the sidebar buttons don't go above the segment or below it
		let tmpSidebarHeight = tmpQuadrantTR.offsetHeight || 0;
		let tmpSegmentHeight = tmpSegmentEl.offsetHeight || 0;
		let tmpMaxOffset = Math.max(0, tmpSegmentHeight - tmpSidebarHeight);
		tmpOffsetTop = Math.max(0, Math.min(tmpOffsetTop, tmpMaxOffset));

		// Apply the cursor-relative positioning
		tmpQuadrantTR.classList.add('pict-mde-sidebar-at-cursor');
		tmpQuadrantTR.style.setProperty('--pict-mde-sidebar-top', `${tmpOffsetTop}px`);
	};

	/**
	 * Reset the sidebar back to default sticky positioning (no cursor tracking).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */
	pView._resetSidebarPosition = function _resetSidebarPosition(pSegmentIndex)
	{
		let tmpSegmentEl = document.getElementById(`PictMDE-Segment-${pSegmentIndex}`);
		if (!tmpSegmentEl)
		{
			return;
		}

		let tmpQuadrantTR = tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');
		if (!tmpQuadrantTR)
		{
			return;
		}

		tmpQuadrantTR.classList.remove('pict-mde-sidebar-at-cursor');
		tmpQuadrantTR.style.removeProperty('--pict-mde-sidebar-top');
	};
};
