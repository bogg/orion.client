/*******************************************************************************
 * @license
 * Copyright (c) 2013 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
 
/*globals define Node console */

define('orion/markOccurrences', [ //$NON-NLS-0$
], function() {

	function MarkOccurrences(serviceRegistry, editor) {
		this.registry = serviceRegistry;
		this.editor = editor;
	}
	
	MarkOccurrences.prototype = /** @lends orion.MarkOccurrences.prototype */ {
		findOccurrences: function (contentType, title, message, contents) {
		console.log ("hi");
		}
	};
});
