#!/usr/bin/env node
/**
 * Build script to bundle CodeMirror v6 into a single browser-compatible file.
 * Run: node build-codemirror-bundle.js
 *
 * This creates html/codemirror-bundle.js which exposes window.CodeMirrorModules
 * with { EditorView, EditorState, extensions }.
 */
const { build } = require('esbuild');
const path = require('path');

build(
{
	entryPoints: [path.join(__dirname, 'codemirror-entry.js')],
	bundle: true,
	outfile: path.join(__dirname, 'html', 'codemirror-bundle.js'),
	format: 'iife',
	globalName: 'CodeMirrorModules',
	platform: 'browser',
	target: ['es2018'],
	minify: false
}).then(() =>
{
	console.log('CodeMirror bundle built successfully -> html/codemirror-bundle.js');
}).catch((pError) =>
{
	console.error('Build failed:', pError);
	process.exit(1);
});
