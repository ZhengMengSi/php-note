/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var V={};V.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapVizKitViewport");r.writeClasses();r.writeAttribute("tabindex",0);r.writeAttribute("aria-label","Image");r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeStyles();r.write(">");var i,l;var t=c.getTools();for(i=0,l=t.length;i<l;i++){var _=sap.ui.getCore().byId(t[i]);var a=_.getGizmoForContainer(c);if(a&&a.hasDomElement()){r.renderControl(a);}}var C=c.getContent();for(i=0,l=C.length;i<l;i++){r.renderControl(C[i]);}var s=c.getScene();if(s&&s.getEnableDivAnnotations()){r.write("<div");r.addClass("sapUiVizKitAnnotationContainer");r.writeClasses();r.write(">");if(s.getAnnotations().size>0){var A=s.getAnnotations();A.forEach(function(o){r.renderControl(o);o.setVisibleFromNode(c);});s.annotations.clear();}r.write("</div>");}if(c.getSafeArea()){r.renderControl(c.getSafeArea());}r.write("</div>");};return V;},true);
