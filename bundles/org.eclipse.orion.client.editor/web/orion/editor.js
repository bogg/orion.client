/*******************************************************************************
 * @license
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
 
/*globals define window document */

define('orion/editor', [
	
	"orion/textview/textView", 
	"orion/textview/textModel",
	"orion/textview/projectionTextModel",
	"orion/textview/eventTarget",
	"orion/textview/keyBinding",
	"orion/textview/rulers",
	"orion/textview/annotations",
	"orion/textview/tooltip",
	"orion/textview/undoStack",
	"orion/textview/textDND",
	
	"orion/editor/editor",
	"orion/editor/editorFeatures",
	
	"orion/editor/contentAssist",
	"orion/editor/cssContentAssist",
	"orion/editor/htmlContentAssist",
	"orion/editor/jsTemplateContentAssist",
	
	"orion/editor/AsyncStyler",
	"orion/editor/mirror",
	"orion/editor/textMateStyler",
	"orion/editor/htmlGrammar",
	"examples/textview/textStyler"
], function() {

	var exports = {};
	for (var a in arguments) {
		if (arguments.hasOwnProperty(a)) {
			var module = arguments[a];
			for (var m in module) {
				if (module.hasOwnProperty(m)) {
					exports[m] = module[m];
				}
			}
		}
	}

	function edit(options) {
		var editorID = options.editorID ? options.editorID : "editor";
		var editorDomNode = document.getElementById(editorID);
	
		var textViewFactory = function() {
			return new exports.TextView({
				parent: editorDomNode,
				tabSize: options.tabSize ? options.tabSize : 4
			});
		};

		var contentAssist;
		var contentAssistFactory = {
			createContentAssistMode: function(editor) {
				contentAssist = new exports.ContentAssist(editor.getTextView());
				var contentAssistWidget = new exports.ContentAssistWidget(contentAssist);
				return new exports.ContentAssistMode(contentAssist, contentAssistWidget);
			}
		};
		var cssContentAssistProvider = new exports.CssContentAssistProvider();
		var jsTemplateContentAssistProvider = new exports.JSTemplateContentAssistProvider();
	
		// Canned highlighters for js, java, and css. Grammar-based highlighter for html
		var syntaxHighlighter = {
			styler: null, 
			
			highlight: function(lang, editor) {
				if (this.styler) {
					this.styler.destroy();
					this.styler = null;
				}
				if (lang) {
					var textView = editor.getTextView();
					var annotationModel = editor.getAnnotationModel();
					switch(lang) {
						case "js":
						case "java":
						case "css":
							this.styler = new exports.TextStyler(textView, lang, annotationModel);
							break;
						case "html":
							this.styler = new exports.TextMateStyler(textView, new exports.HtmlGrammar());
							break;
					}
				}
			}
		};
		
		var keyBindingFactory = function(editor, keyModeStack, undoStack, contentAssist) {
			
			// Create keybindings for generic editing
			var genericBindings = new exports.TextActions(editor, undoStack);
			keyModeStack.push(genericBindings);
			
			// create keybindings for source editing
			var codeBindings = new exports.SourceCodeActions(editor, undoStack, contentAssist);
			keyModeStack.push(codeBindings);
		};
			
		var editor = new exports.Editor({
			textViewFactory: textViewFactory,
			undoStackFactory: new exports.UndoFactory(),
			annotationFactory: new exports.AnnotationFactory(),
			lineNumberRulerFactory: new exports.LineNumberRulerFactory(),
			contentAssistFactory: contentAssistFactory,
			keyBindingFactory: keyBindingFactory, 
			statusReporter: options.statusReporter,
			domNode: editorDomNode
		});
			
		editor.installTextView();
		// if there is a mechanism to change which file is being viewed, this code would be run each time it changed.
		if (options.contents) {
			editor.setInput(options.title, null, options.contents);
		}
		syntaxHighlighter.highlight(options.lang, editor);
		contentAssist.addEventListener("Activating", function() {
			if (/\.css$/.test(options.lang)) {
				contentAssist.setProviders([cssContentAssistProvider]);
			} else if (/\.js$/.test(options.lang)) {
				contentAssist.setProviders([jsTemplateContentAssistProvider]);
			}
		});
		
		return editor;
	}
	exports.edit = edit;
	
	if (true /*window.orionEditorGlobal*/) {
		if (!window.orion) { window.orion = {}; }
		if (!window.orion.editor) { window.orion.editor = exports; }
	}
	
	return exports;
});