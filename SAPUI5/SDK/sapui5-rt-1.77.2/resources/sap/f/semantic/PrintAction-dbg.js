/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/f/semantic/SemanticButton'], function(SemanticButton) {
	"use strict";

	/**
	* Constructor for a new <code>PrintAction</code>.
	* @param {string} [sId] ID for the new control, generated automatically if no ID is given
	* @param {object} [mSettings] Custom initial settings for the new control
	*
	* @class
	* A semantic-specific button, eligible for the <code>printAction</code> aggregation of the
	* {@link sap.f.semantic.SemanticPage} to be placed in the share menu within its title.
	*
	* @extends sap.f.semantic.SemanticButton
	*
	* @author SAP SE
	* @version 1.77.2
	*
	* @constructor
	* @public
	* @since 1.46.0
	* @alias sap.f.semantic.PrintAction
	* @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	*/
	var PrintAction =  SemanticButton.extend("sap.f.semantic.PrintAction", /** @lends sap.f.semantic.PrintAction.prototype */ {
		metadata: {
			library: "sap.f"
		}
	});

	return PrintAction;
});
