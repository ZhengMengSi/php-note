/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */

// Provides default renderer for control sap.makit.CombinationChart.
sap.ui.define([], function() {
	"use strict";

	var CombinationChartRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	CombinationChartRenderer.render = function(oRm, oControl){
		oRm.write("<div id =\"sap-ui-dummy-" + oControl.getId() + "\" style =\"display:none\">");
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.writeAttribute("data-sap-ui-preserve", oControl.getId());
		oRm.addClass("sapMakitChart");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");
		oRm.write("</div>");
	};

	return CombinationChartRenderer;
}, true);