/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer'],function(R){"use strict";var A={apiVersion:2};A.render=function(r,c){r.openStart("div",c);r.class("sapUIActionsToolbar");r.openEnd();r.renderControl(c.getAggregation("_toolbar"));r.close("div");};return A;},true);
