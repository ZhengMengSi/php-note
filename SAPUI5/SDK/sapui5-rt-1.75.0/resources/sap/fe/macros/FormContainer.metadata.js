/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.FormContainer",{name:"FormContainer",namespace:"sap.fe.macros",fragment:"sap.fe.macros.FormContainer",metadata:{stereotype:"xmlmacro",properties:{id:{type:"string"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:["EntitySet","NavigationProperty"]},dataFieldCollection:{type:"sap.ui.model.Context"},editMode:{type:"string",defaultValue:"Display"},createMode:{type:"string",defaultValue:"false"},title:{type:"string"},navigationPath:{type:"string"},visibilityPath:{type:"string"}},events:{onChange:{type:"function"}}}});return F;});
