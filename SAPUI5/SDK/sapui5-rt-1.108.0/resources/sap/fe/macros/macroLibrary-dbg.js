/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/buildingBlocks/BuildingBlockRuntime", "sap/fe/macros/form/FormBuildingBlock", "sap/fe/macros/form/FormContainerBuildingBlock", "sap/fe/macros/situations/SituationsIndicator.fragment", "sap/ui/core/util/XMLPreprocessor", "./chart/Chart.metadata", "./contact/Contact.metadata", "./draftIndicator/DraftIndicator.metadata", "./fcl/FlexibleColumnLayoutActions.metadata", "./field/PublicField", "./filterBar/FilterBar.metadata", "./form/FormElement.metadata", "./internal/ActionCommand.metadata", "./internal/CollectionField.metadata", "./internal/DataPoint.metadata", "./internal/Field.metadata", "./internal/FilterField.metadata", "./kpiTag/KPITag.metadata", "./microchart/MicroChart.metadata", "./paginator/Paginator.metadata", "./quickView/QuickViewForm.metadata", "./share/Share.metadata", "./table/Table.metadata", "./valuehelp/ValueHelp.metadata", "./valuehelp/ValueHelpFilterBar.metadata", "./visualfilters/VisualFilter.metadata"], function (BuildingBlockRuntime, FormBuildingBlock, FormContainerBuildingBlock, SituationsIndicator, XMLPreprocessor, Chart, Contact, DraftIndicator, FlexibleColumnLayoutActions, Field, FilterBar, FormElement, ActionCommand, CollectionField, DataPoint, InternalField, FilterField, KPITag, MicroChart, Paginator, QuickViewForm, Share, Table, ValueHelp, ValueHelpFilterBar, VisualFilter) {
  "use strict";

  var registerBuildingBlock = BuildingBlockRuntime.registerBuildingBlock;

  var sNamespace = "sap.fe.macros",
      aControls = [Table, FormBuildingBlock, FormContainerBuildingBlock, Field, InternalField, FilterBar, FilterField, Chart, ValueHelp, ValueHelpFilterBar, MicroChart, Contact, QuickViewForm, VisualFilter, DraftIndicator, DataPoint, FormElement, FlexibleColumnLayoutActions, Share, KPITag, CollectionField, Paginator, ActionCommand, SituationsIndicator].map(function (vEntry) {
    if (typeof vEntry === "string") {
      return {
        name: vEntry,
        namespace: sNamespace,
        metadata: {
          metadataContexts: {},
          properties: {},
          events: {}
        }
      };
    }

    return vEntry;
  });

  function registerAll() {
    // as a first version we expect that there's a fragment with exactly the namespace/name
    aControls.forEach(function (oEntry) {
      registerBuildingBlock(oEntry);
    });
  } //This is needed in for templating test utils


  function deregisterAll() {
    aControls.forEach(function (oEntry) {
      XMLPreprocessor.plugIn(null, oEntry.namespace, oEntry.name);
    });
  } //Always register when loaded for compatibility


  registerAll();
  return {
    register: registerAll,
    deregister: deregisterAll
  };
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzTmFtZXNwYWNlIiwiYUNvbnRyb2xzIiwiVGFibGUiLCJGb3JtQnVpbGRpbmdCbG9jayIsIkZvcm1Db250YWluZXJCdWlsZGluZ0Jsb2NrIiwiRmllbGQiLCJJbnRlcm5hbEZpZWxkIiwiRmlsdGVyQmFyIiwiRmlsdGVyRmllbGQiLCJDaGFydCIsIlZhbHVlSGVscCIsIlZhbHVlSGVscEZpbHRlckJhciIsIk1pY3JvQ2hhcnQiLCJDb250YWN0IiwiUXVpY2tWaWV3Rm9ybSIsIlZpc3VhbEZpbHRlciIsIkRyYWZ0SW5kaWNhdG9yIiwiRGF0YVBvaW50IiwiRm9ybUVsZW1lbnQiLCJGbGV4aWJsZUNvbHVtbkxheW91dEFjdGlvbnMiLCJTaGFyZSIsIktQSVRhZyIsIkNvbGxlY3Rpb25GaWVsZCIsIlBhZ2luYXRvciIsIkFjdGlvbkNvbW1hbmQiLCJTaXR1YXRpb25zSW5kaWNhdG9yIiwibWFwIiwidkVudHJ5IiwibmFtZSIsIm5hbWVzcGFjZSIsIm1ldGFkYXRhIiwibWV0YWRhdGFDb250ZXh0cyIsInByb3BlcnRpZXMiLCJldmVudHMiLCJyZWdpc3RlckFsbCIsImZvckVhY2giLCJvRW50cnkiLCJyZWdpc3RlckJ1aWxkaW5nQmxvY2siLCJkZXJlZ2lzdGVyQWxsIiwiWE1MUHJlcHJvY2Vzc29yIiwicGx1Z0luIiwicmVnaXN0ZXIiLCJkZXJlZ2lzdGVyIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJtYWNyb0xpYnJhcnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVnaXN0ZXJCdWlsZGluZ0Jsb2NrIH0gZnJvbSBcInNhcC9mZS9jb3JlL2J1aWxkaW5nQmxvY2tzL0J1aWxkaW5nQmxvY2tSdW50aW1lXCI7XG5pbXBvcnQgRm9ybUJ1aWxkaW5nQmxvY2sgZnJvbSBcInNhcC9mZS9tYWNyb3MvZm9ybS9Gb3JtQnVpbGRpbmdCbG9ja1wiO1xuaW1wb3J0IEZvcm1Db250YWluZXJCdWlsZGluZ0Jsb2NrIGZyb20gXCJzYXAvZmUvbWFjcm9zL2Zvcm0vRm9ybUNvbnRhaW5lckJ1aWxkaW5nQmxvY2tcIjtcbmltcG9ydCBTaXR1YXRpb25zSW5kaWNhdG9yIGZyb20gXCJzYXAvZmUvbWFjcm9zL3NpdHVhdGlvbnMvU2l0dWF0aW9uc0luZGljYXRvci5mcmFnbWVudFwiO1xuaW1wb3J0IFhNTFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbC9YTUxQcmVwcm9jZXNzb3JcIjtcbmltcG9ydCBDaGFydCBmcm9tIFwiLi9jaGFydC9DaGFydC5tZXRhZGF0YVwiO1xuaW1wb3J0IENvbnRhY3QgZnJvbSBcIi4vY29udGFjdC9Db250YWN0Lm1ldGFkYXRhXCI7XG5pbXBvcnQgRHJhZnRJbmRpY2F0b3IgZnJvbSBcIi4vZHJhZnRJbmRpY2F0b3IvRHJhZnRJbmRpY2F0b3IubWV0YWRhdGFcIjtcbmltcG9ydCBGbGV4aWJsZUNvbHVtbkxheW91dEFjdGlvbnMgZnJvbSBcIi4vZmNsL0ZsZXhpYmxlQ29sdW1uTGF5b3V0QWN0aW9ucy5tZXRhZGF0YVwiO1xuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2ZpZWxkL1B1YmxpY0ZpZWxkXCI7XG5pbXBvcnQgRmlsdGVyQmFyIGZyb20gXCIuL2ZpbHRlckJhci9GaWx0ZXJCYXIubWV0YWRhdGFcIjtcbmltcG9ydCBGb3JtRWxlbWVudCBmcm9tIFwiLi9mb3JtL0Zvcm1FbGVtZW50Lm1ldGFkYXRhXCI7XG5pbXBvcnQgQWN0aW9uQ29tbWFuZCBmcm9tIFwiLi9pbnRlcm5hbC9BY3Rpb25Db21tYW5kLm1ldGFkYXRhXCI7XG5pbXBvcnQgQ29sbGVjdGlvbkZpZWxkIGZyb20gXCIuL2ludGVybmFsL0NvbGxlY3Rpb25GaWVsZC5tZXRhZGF0YVwiO1xuaW1wb3J0IERhdGFQb2ludCBmcm9tIFwiLi9pbnRlcm5hbC9EYXRhUG9pbnQubWV0YWRhdGFcIjtcbmltcG9ydCBJbnRlcm5hbEZpZWxkIGZyb20gXCIuL2ludGVybmFsL0ZpZWxkLm1ldGFkYXRhXCI7XG5pbXBvcnQgRmlsdGVyRmllbGQgZnJvbSBcIi4vaW50ZXJuYWwvRmlsdGVyRmllbGQubWV0YWRhdGFcIjtcbmltcG9ydCBLUElUYWcgZnJvbSBcIi4va3BpVGFnL0tQSVRhZy5tZXRhZGF0YVwiO1xuaW1wb3J0IE1pY3JvQ2hhcnQgZnJvbSBcIi4vbWljcm9jaGFydC9NaWNyb0NoYXJ0Lm1ldGFkYXRhXCI7XG5pbXBvcnQgUGFnaW5hdG9yIGZyb20gXCIuL3BhZ2luYXRvci9QYWdpbmF0b3IubWV0YWRhdGFcIjtcbmltcG9ydCBRdWlja1ZpZXdGb3JtIGZyb20gXCIuL3F1aWNrVmlldy9RdWlja1ZpZXdGb3JtLm1ldGFkYXRhXCI7XG5pbXBvcnQgU2hhcmUgZnJvbSBcIi4vc2hhcmUvU2hhcmUubWV0YWRhdGFcIjtcbmltcG9ydCBUYWJsZSBmcm9tIFwiLi90YWJsZS9UYWJsZS5tZXRhZGF0YVwiO1xuaW1wb3J0IFZhbHVlSGVscCBmcm9tIFwiLi92YWx1ZWhlbHAvVmFsdWVIZWxwLm1ldGFkYXRhXCI7XG5pbXBvcnQgVmFsdWVIZWxwRmlsdGVyQmFyIGZyb20gXCIuL3ZhbHVlaGVscC9WYWx1ZUhlbHBGaWx0ZXJCYXIubWV0YWRhdGFcIjtcbmltcG9ydCBWaXN1YWxGaWx0ZXIgZnJvbSBcIi4vdmlzdWFsZmlsdGVycy9WaXN1YWxGaWx0ZXIubWV0YWRhdGFcIjtcblxuY29uc3Qgc05hbWVzcGFjZSA9IFwic2FwLmZlLm1hY3Jvc1wiLFxuXHRhQ29udHJvbHMgPSBbXG5cdFx0VGFibGUsXG5cdFx0Rm9ybUJ1aWxkaW5nQmxvY2ssXG5cdFx0Rm9ybUNvbnRhaW5lckJ1aWxkaW5nQmxvY2ssXG5cdFx0RmllbGQsXG5cdFx0SW50ZXJuYWxGaWVsZCxcblx0XHRGaWx0ZXJCYXIsXG5cdFx0RmlsdGVyRmllbGQsXG5cdFx0Q2hhcnQsXG5cdFx0VmFsdWVIZWxwLFxuXHRcdFZhbHVlSGVscEZpbHRlckJhcixcblx0XHRNaWNyb0NoYXJ0LFxuXHRcdENvbnRhY3QsXG5cdFx0UXVpY2tWaWV3Rm9ybSxcblx0XHRWaXN1YWxGaWx0ZXIsXG5cdFx0RHJhZnRJbmRpY2F0b3IsXG5cdFx0RGF0YVBvaW50LFxuXHRcdEZvcm1FbGVtZW50LFxuXHRcdEZsZXhpYmxlQ29sdW1uTGF5b3V0QWN0aW9ucyxcblx0XHRTaGFyZSxcblx0XHRLUElUYWcsXG5cdFx0Q29sbGVjdGlvbkZpZWxkLFxuXHRcdFBhZ2luYXRvcixcblx0XHRBY3Rpb25Db21tYW5kLFxuXHRcdFNpdHVhdGlvbnNJbmRpY2F0b3Jcblx0XS5tYXAoZnVuY3Rpb24gKHZFbnRyeSkge1xuXHRcdGlmICh0eXBlb2YgdkVudHJ5ID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRuYW1lOiB2RW50cnksXG5cdFx0XHRcdG5hbWVzcGFjZTogc05hbWVzcGFjZSxcblx0XHRcdFx0bWV0YWRhdGE6IHtcblx0XHRcdFx0XHRtZXRhZGF0YUNvbnRleHRzOiB7fSxcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0XHRldmVudHM6IHt9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiB2RW50cnk7XG5cdH0pO1xuXG5mdW5jdGlvbiByZWdpc3RlckFsbCgpIHtcblx0Ly8gYXMgYSBmaXJzdCB2ZXJzaW9uIHdlIGV4cGVjdCB0aGF0IHRoZXJlJ3MgYSBmcmFnbWVudCB3aXRoIGV4YWN0bHkgdGhlIG5hbWVzcGFjZS9uYW1lXG5cdGFDb250cm9scy5mb3JFYWNoKGZ1bmN0aW9uIChvRW50cnkpIHtcblx0XHRyZWdpc3RlckJ1aWxkaW5nQmxvY2sob0VudHJ5KTtcblx0fSk7XG59XG5cbi8vVGhpcyBpcyBuZWVkZWQgaW4gZm9yIHRlbXBsYXRpbmcgdGVzdCB1dGlsc1xuZnVuY3Rpb24gZGVyZWdpc3RlckFsbCgpIHtcblx0YUNvbnRyb2xzLmZvckVhY2goZnVuY3Rpb24gKG9FbnRyeSkge1xuXHRcdFhNTFByZXByb2Nlc3Nvci5wbHVnSW4obnVsbCwgb0VudHJ5Lm5hbWVzcGFjZSwgb0VudHJ5Lm5hbWUpO1xuXHR9KTtcbn1cblxuLy9BbHdheXMgcmVnaXN0ZXIgd2hlbiBsb2FkZWQgZm9yIGNvbXBhdGliaWxpdHlcbnJlZ2lzdGVyQWxsKCk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0cmVnaXN0ZXI6IHJlZ2lzdGVyQWxsLFxuXHRkZXJlZ2lzdGVyOiBkZXJlZ2lzdGVyQWxsXG59O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7RUEyQkEsSUFBTUEsVUFBVSxHQUFHLGVBQW5CO0VBQUEsSUFDQ0MsU0FBUyxHQUFHLENBQ1hDLEtBRFcsRUFFWEMsaUJBRlcsRUFHWEMsMEJBSFcsRUFJWEMsS0FKVyxFQUtYQyxhQUxXLEVBTVhDLFNBTlcsRUFPWEMsV0FQVyxFQVFYQyxLQVJXLEVBU1hDLFNBVFcsRUFVWEMsa0JBVlcsRUFXWEMsVUFYVyxFQVlYQyxPQVpXLEVBYVhDLGFBYlcsRUFjWEMsWUFkVyxFQWVYQyxjQWZXLEVBZ0JYQyxTQWhCVyxFQWlCWEMsV0FqQlcsRUFrQlhDLDJCQWxCVyxFQW1CWEMsS0FuQlcsRUFvQlhDLE1BcEJXLEVBcUJYQyxlQXJCVyxFQXNCWEMsU0F0QlcsRUF1QlhDLGFBdkJXLEVBd0JYQyxtQkF4QlcsRUF5QlZDLEdBekJVLENBeUJOLFVBQVVDLE1BQVYsRUFBa0I7SUFDdkIsSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFFBQXRCLEVBQWdDO01BQy9CLE9BQU87UUFDTkMsSUFBSSxFQUFFRCxNQURBO1FBRU5FLFNBQVMsRUFBRTdCLFVBRkw7UUFHTjhCLFFBQVEsRUFBRTtVQUNUQyxnQkFBZ0IsRUFBRSxFQURUO1VBRVRDLFVBQVUsRUFBRSxFQUZIO1VBR1RDLE1BQU0sRUFBRTtRQUhDO01BSEosQ0FBUDtJQVNBOztJQUNELE9BQU9OLE1BQVA7RUFDQSxDQXRDVyxDQURiOztFQXlDQSxTQUFTTyxXQUFULEdBQXVCO0lBQ3RCO0lBQ0FqQyxTQUFTLENBQUNrQyxPQUFWLENBQWtCLFVBQVVDLE1BQVYsRUFBa0I7TUFDbkNDLHFCQUFxQixDQUFDRCxNQUFELENBQXJCO0lBQ0EsQ0FGRDtFQUdBLEMsQ0FFRDs7O0VBQ0EsU0FBU0UsYUFBVCxHQUF5QjtJQUN4QnJDLFNBQVMsQ0FBQ2tDLE9BQVYsQ0FBa0IsVUFBVUMsTUFBVixFQUFrQjtNQUNuQ0csZUFBZSxDQUFDQyxNQUFoQixDQUF1QixJQUF2QixFQUE2QkosTUFBTSxDQUFDUCxTQUFwQyxFQUErQ08sTUFBTSxDQUFDUixJQUF0RDtJQUNBLENBRkQ7RUFHQSxDLENBRUQ7OztFQUNBTSxXQUFXO1NBRUk7SUFDZE8sUUFBUSxFQUFFUCxXQURJO0lBRWRRLFVBQVUsRUFBRUo7RUFGRSxDIn0=