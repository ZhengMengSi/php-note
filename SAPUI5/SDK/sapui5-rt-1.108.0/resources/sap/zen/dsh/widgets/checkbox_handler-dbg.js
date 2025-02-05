/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(jQuery, BaseHandler) {
    "use strict";
    var CheckboxHandler = function() {
      BaseHandler.apply(this, arguments);
      var dispatcher = BaseHandler.dispatcher;
      var that = this;
      function fireEvent(oControlProperties, checked) {
        var onclick = that.prepareCommand(
          oControlProperties.onclick,oControlProperties.status,"" + checked
        );
        eval(onclick);
      }
      function init(oControl, oControlProperties) {
        oControl.setTooltip(oControlProperties.tooltip);
        oControl.setEnabled(oControlProperties.enabled);
        oControl.setChecked(oControlProperties.checked);
        oControl.setText(oControlProperties.text);
        //fireEvent(oControlProperties, oControlProperties.checked);
      }
      function addevents(oCheckbox, oControlProperties) {
        // attach events
        oCheckbox.attachChange(function(e) {
          if(dispatcher.isMainMode()){
            fireEvent(oControlProperties, e.getParameters().selected);
          }else{
            fireEvent(oControlProperties, e.getParameters().checked);
          }
        });
      }
      this.create = function(oChainedControl, oControlProperties) {
        var id = oControlProperties["id"];
        // initialization
        var oCheckbox = this.createDefaultProxy(id);
        init(oCheckbox, oControlProperties);
        addevents(oCheckbox, oControlProperties);
        return oCheckbox;
      };
      this.update = function(oControl, oControlProperties) {
        if (oControlProperties) {
          init(oControl, oControlProperties);
        }
        return oControl;
      };
      this.getDefaultProxyClass = function(){
        return ["sap.m.CheckBox", "sap.ui.commons.CheckBox"];
      };
      this.provideFunctionMapping = function(){
        return [["setSelected","setChecked"],["attachSelect","attachChange"]];
      };
      this.getType = function() {
        return "checkbox";
      };
      this.getDecorator = function() {
        return "FixedHeightDecorator";
      };
    };
    var instance = new CheckboxHandler();
    BaseHandler.dispatcher.addHandlers(instance.getType(), instance);
    return instance;
  }
);
