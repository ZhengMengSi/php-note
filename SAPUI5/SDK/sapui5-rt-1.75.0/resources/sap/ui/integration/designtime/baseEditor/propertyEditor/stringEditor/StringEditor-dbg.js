/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor",
	"sap/ui/base/BindingParser"
], function (
	BasePropertyEditor,
	BindingParser
) {
	"use strict";

	/**
	 * @class
	 * Constructor for a new <code>StringEditor</code>.
	 * This allows to set string values or binding strings for a specified property of a JSON object.
	 * The editor is rendered as a {@link sap.m.Input}.
	 * To get notified about changes made with the editor, you can use the <code>attachValueChange</code> method,
	 * which passes the current property state as a string or binding string to the provided callback function when the user edits the input.
	 *
	 * @extends sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor
	 * @alias sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor
	 * @author SAP SE
	 * @since 1.70
	 * @version 1.75.0
	 *
	 * @private
	 * @experimental 1.70
	 * @ui5-restricted
	 */
	var StringEditor = BasePropertyEditor.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor", {
		xmlFragment: "sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor",
		_onLiveChange: function() {
			var oInput = this.getContent();
			if (this._validate()) {
				this.fireValueChange(oInput.getValue());
			}
		},
		_validate: function() {
			var oInput = this.getContent();
			var oValue = oInput.getValue();
			var bInvalidBindingString = false;
			try {
				BindingParser.complexParser(oValue);
			} catch (oError) {
				bInvalidBindingString = true;
			} finally {
				if (bInvalidBindingString) {
					oInput.setValueState("Error");
					oInput.setValueStateText(this.getI18nProperty("BASE_EDITOR.STRING.INVALID_BINDING"));
					return false;
				} else {
					oInput.setValueState("None");
					return true;
				}
			}
		},
		renderer: BasePropertyEditor.getMetadata().getRenderer().render
	});

	return StringEditor;
});
