/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/support/CommonHelper", "sap/fe/core/converters/helpers/IssueManager"], function (CommonHelper, IssueManager) {
  "use strict";

  var _exports = {};
  var IssueCategory = IssueManager.IssueCategory;
  var Audiences = CommonHelper.Audiences;
  var getIssueByCategory = CommonHelper.getIssueByCategory;
  var Categories = CommonHelper.Categories;

  var oCollectionFacetMissingIDIssue = {
    id: "collectionFacetMissingId",
    title: "CollectionFacet: Missing IDs",
    minversion: "1.85",
    audiences: [Audiences.Application],
    categories: [Categories.Usage],
    description: "A collection facet requires an ID in the annotation file to derive a control ID from it.",
    resolution: "Always provide a unique ID to a collection facet.",
    resolutionurls: [{
      "text": "CollectionFacets",
      "href": "https://ui5.sap.com/#/topic/facfea09018d4376acaceddb7e3f03b6"
    }],
    check: function (oIssueManager, oCoreFacade) {
      getIssueByCategory(oIssueManager, oCoreFacade, IssueCategory.Facets, "MissingID");
    }
  };

  function getRules() {
    return [oCollectionFacetMissingIDIssue];
  }

  _exports.getRules = getRules;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJvQ29sbGVjdGlvbkZhY2V0TWlzc2luZ0lESXNzdWUiLCJpZCIsInRpdGxlIiwibWludmVyc2lvbiIsImF1ZGllbmNlcyIsIkF1ZGllbmNlcyIsIkFwcGxpY2F0aW9uIiwiY2F0ZWdvcmllcyIsIkNhdGVnb3JpZXMiLCJVc2FnZSIsImRlc2NyaXB0aW9uIiwicmVzb2x1dGlvbiIsInJlc29sdXRpb251cmxzIiwiY2hlY2siLCJvSXNzdWVNYW5hZ2VyIiwib0NvcmVGYWNhZGUiLCJnZXRJc3N1ZUJ5Q2F0ZWdvcnkiLCJJc3N1ZUNhdGVnb3J5IiwiRmFjZXRzIiwiZ2V0UnVsZXMiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNvbGxlY3Rpb25GYWNldE1pc3NpbmdJRC5zdXBwb3J0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhdGVnb3JpZXMsIGdldElzc3VlQnlDYXRlZ29yeSwgQXVkaWVuY2VzIH0gZnJvbSBcInNhcC9mZS9jb3JlL3N1cHBvcnQvQ29tbW9uSGVscGVyXCI7XG5pbXBvcnQgeyBJc3N1ZUNhdGVnb3J5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmNvbnN0IG9Db2xsZWN0aW9uRmFjZXRNaXNzaW5nSURJc3N1ZSA9IHtcblx0aWQ6IFwiY29sbGVjdGlvbkZhY2V0TWlzc2luZ0lkXCIsXG5cdHRpdGxlOiBcIkNvbGxlY3Rpb25GYWNldDogTWlzc2luZyBJRHNcIixcblx0bWludmVyc2lvbjogXCIxLjg1XCIsXG5cdGF1ZGllbmNlczogW0F1ZGllbmNlcy5BcHBsaWNhdGlvbl0sXG5cdGNhdGVnb3JpZXM6IFtDYXRlZ29yaWVzLlVzYWdlXSxcblx0ZGVzY3JpcHRpb246IFwiQSBjb2xsZWN0aW9uIGZhY2V0IHJlcXVpcmVzIGFuIElEIGluIHRoZSBhbm5vdGF0aW9uIGZpbGUgdG8gZGVyaXZlIGEgY29udHJvbCBJRCBmcm9tIGl0LlwiLFxuXHRyZXNvbHV0aW9uOiBcIkFsd2F5cyBwcm92aWRlIGEgdW5pcXVlIElEIHRvIGEgY29sbGVjdGlvbiBmYWNldC5cIixcblx0cmVzb2x1dGlvbnVybHM6IFt7IFwidGV4dFwiOiBcIkNvbGxlY3Rpb25GYWNldHNcIiwgXCJocmVmXCI6IFwiaHR0cHM6Ly91aTUuc2FwLmNvbS8jL3RvcGljL2ZhY2ZlYTA5MDE4ZDQzNzZhY2FjZWRkYjdlM2YwM2I2XCIgfV0sXG5cdGNoZWNrOiBmdW5jdGlvbihvSXNzdWVNYW5hZ2VyOiBhbnksIG9Db3JlRmFjYWRlOiBhbnkgLypvU2NvcGU6IGFueSovKSB7XG5cdFx0Z2V0SXNzdWVCeUNhdGVnb3J5KG9Jc3N1ZU1hbmFnZXIsIG9Db3JlRmFjYWRlLCBJc3N1ZUNhdGVnb3J5LkZhY2V0cywgXCJNaXNzaW5nSURcIik7XG5cdH1cbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0UnVsZXMoKSB7XG5cdHJldHVybiBbb0NvbGxlY3Rpb25GYWNldE1pc3NpbmdJRElzc3VlXTtcbn1cbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7OztFQUVBLElBQU1BLDhCQUE4QixHQUFHO0lBQ3RDQyxFQUFFLEVBQUUsMEJBRGtDO0lBRXRDQyxLQUFLLEVBQUUsOEJBRitCO0lBR3RDQyxVQUFVLEVBQUUsTUFIMEI7SUFJdENDLFNBQVMsRUFBRSxDQUFDQyxTQUFTLENBQUNDLFdBQVgsQ0FKMkI7SUFLdENDLFVBQVUsRUFBRSxDQUFDQyxVQUFVLENBQUNDLEtBQVosQ0FMMEI7SUFNdENDLFdBQVcsRUFBRSwwRkFOeUI7SUFPdENDLFVBQVUsRUFBRSxtREFQMEI7SUFRdENDLGNBQWMsRUFBRSxDQUFDO01BQUUsUUFBUSxrQkFBVjtNQUE4QixRQUFRO0lBQXRDLENBQUQsQ0FSc0I7SUFTdENDLEtBQUssRUFBRSxVQUFTQyxhQUFULEVBQTZCQyxXQUE3QixFQUErRDtNQUNyRUMsa0JBQWtCLENBQUNGLGFBQUQsRUFBZ0JDLFdBQWhCLEVBQTZCRSxhQUFhLENBQUNDLE1BQTNDLEVBQW1ELFdBQW5ELENBQWxCO0lBQ0E7RUFYcUMsQ0FBdkM7O0VBYU8sU0FBU0MsUUFBVCxHQUFvQjtJQUMxQixPQUFPLENBQUNuQiw4QkFBRCxDQUFQO0VBQ0EifQ==