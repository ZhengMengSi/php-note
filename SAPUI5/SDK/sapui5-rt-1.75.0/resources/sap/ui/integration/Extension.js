/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Element'],function(E){"use strict";var a=E.extend("sap.ui.integration.Extension",{metadata:{library:"sap.ui.integration",properties:{actions:{type:"array"}},events:{onAction:{allowPreventDefault:true,parameters:{card:{type:"sap.ui.core.Control"},actionConfig:{type:'object'},actionSource:{type:"sap.ui.core.Control"},manifestParameters:{type:"object"},type:{type:"sap.ui.integration.CardActionType"}}}}}});return a;});
