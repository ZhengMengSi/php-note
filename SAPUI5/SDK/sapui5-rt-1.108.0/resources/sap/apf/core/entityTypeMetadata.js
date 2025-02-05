/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([],function(){"use strict";sap.apf.core.EntityTypeMetadata=function(t,e,a){this.type="entityTypeMetadata";this.getPropertyMetadata=function(t){var n;n=a.getPropertyMetadata(e,t);if(!n){n={dataType:{}}}return n};this.getEntityTypeMetadata=function(){return a.getEntityTypeAnnotations(e)};function n(){t.check(e&&typeof e==="string","sap.apf.core.entityTypeMetadata: incorrect value for parameter sEntityType");t.check(a&&a.type&&a.type==="metadata","sap.apf.core.entityTypeMetadata: incorrect value for parameter oMetadata")}n()}});
//# sourceMappingURL=entityTypeMetadata.js.map