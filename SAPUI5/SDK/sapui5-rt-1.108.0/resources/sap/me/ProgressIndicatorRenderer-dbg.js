/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */

// Provides default renderer for control sap.ui.commons.ProgressIndicator
sap.ui.define(['sap/base/util/Version', 'sap/base/Log', 'sap/base/security/encodeXML'],
	function(Version, Log, encodeXML) {
	"use strict";


	/**
	 * ProgressIndicator renderer.
	 * @namespace
	 */
	var ProgressIndicatorRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.fw.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ProgressIndicatorRenderer.render = function (rm, oProgressIndicator) {
		/* For backwards compatibility we can't remove the deprecated sap.me.ProgressIndicator.
		 * However, if the compatibility version is 1.16 or higher then the sap.me.ProgressIndicator
		 * should not be used.
		*/
		var useProgressIndicatorCompatVersion = new Version(sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMeProgressIndicator"));
		if (useProgressIndicatorCompatVersion.compareTo("1.16") >= 0) {
			Log.error("The sap.me.ProgressIndicator control is not supported as of SAPUI5 version 1.16. Please us sap.m.ProgressIndicator instead.");
			return;
		}

		// .convenience variable
		var widthControl = oProgressIndicator.getWidth();
		var widthBar = oProgressIndicator.getPercentValue();
		var widthBorder;

		// return immediately if control is invisible
		if (!oProgressIndicator.getVisible()) {
			return;
		}

		if (widthBar > 100) {
			widthBorder = (10000 / widthBar) + '%';
		} else {
			widthBorder = '100%';
		}

		// write the HTML into the render manager
		rm.write('<DIV');
		rm.writeControlData(oProgressIndicator);

		rm.writeAttribute('tabIndex', '0');


		if (oProgressIndicator.getWidth() && oProgressIndicator.getWidth() != '') {
			rm.writeAttribute('style', 'width:' + widthControl + ';');
		}

		if (oProgressIndicator.getTooltip_AsString()) {
			rm.writeAttributeEscaped('title', oProgressIndicator.getDisplayValue() + '- ' + oProgressIndicator.getTooltip_AsString());
		} else {
			rm.writeAttributeEscaped('title', oProgressIndicator.getDisplayValue());
		}

		rm.addClass('sapUIMeProgInd');
		rm.writeClasses();

		rm.write('>');

		rm.write('<DIV');
		rm.writeAttribute('id', oProgressIndicator.getId() + '-box');

		if (oProgressIndicator.getWidth() && oProgressIndicator.getWidth() != '') {
			rm.writeAttribute('style', 'width:' + widthBorder + ';');
		}

		rm.addClass('sapUIMeProgIndBorder');
		rm.writeClasses();

		rm.write('>');

		rm.write('<DIV');

		rm.writeAttribute('id', oProgressIndicator.getId() + '-bar');
		rm.writeAttribute('style', 'width:' + oProgressIndicator.getPercentValue() + '%;');

		var sBarColor = oProgressIndicator.getBarColor();
		rm.addClass("sapUIMeProgIndBar");
		if (sBarColor != "") {
			rm.addClass("sapUIMeProgIndBar" + encodeXML(sBarColor));
		}

		rm.writeClasses();

		rm.write('>');

		rm.write('<DIV');
		rm.writeAttribute('id', oProgressIndicator.getId() + '-end');

		// Do not mind about color for the end of the bar
		if (widthBar > 100) {
			rm.addClass('sapUIMeProgIndEnd');
		} else {
			rm.addClass('sapUIMeProgIndEndHidden');
		}

		rm.writeClasses();
		rm.writeAttribute('style', 'position: relative; left:' + widthBorder);

		rm.write('>');
		rm.write('</DIV>');

		rm.write('<SPAN');

		rm.addClass('sapUIMeProgIndFont');
		rm.writeClasses();

		rm.write('>');

		if (oProgressIndicator.getShowValue() && oProgressIndicator.getShowValue() == true) {
			if (oProgressIndicator.getDisplayValue() && oProgressIndicator.getDisplayValue() != '') {
				rm.writeEscaped(oProgressIndicator.getDisplayValue());
			}
		}

		rm.write('</SPAN>');
		rm.write('</DIV>');
		rm.write('</DIV>');
		rm.write('</DIV>');
	};

	return ProgressIndicatorRenderer;

}, /* bExport= */ true);
