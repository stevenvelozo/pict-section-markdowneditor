/**
 * CodeMirror v6 entry point for browser bundling.
 *
 * This file is bundled by esbuild into a single script that sets
 * window.CodeMirrorModules with everything the markdown editor needs.
 */
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';

// Export everything the editor needs
export { EditorView, EditorState, Decoration, ViewPlugin, WidgetType, basicSetup, markdown };

// Also set up the extensions array that the editor expects
export const extensions = [basicSetup, markdown()];
