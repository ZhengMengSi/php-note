/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/macros/CommonHelper"],
	function(CommonHelper) {
		"use strict";
		/**
		 * Helper class used by MDC controls for OData(V4) specific handling
		 *
		 * @private
		 * @experimental This module is only for internal/experimental use!
		 */
		var TableHelper = {
			/**
			 * Check if Annotation is a Presentation Variant Annotation
			 *
			 * @param {object} oAnnotation - Annotation to test
			 * @returns {bool} test result
			 * @private
			 * @sap-restricted
			 */

			_isPresentationVariantAnnotation: function(oAnnotation) {
				return oAnnotation && oAnnotation.$Type === "com.sap.vocabularies.UI.v1.PresentationVariantType";
			},
			createButtonTemplating: function(oThis, bCreationRow) {
				var oTargetCollection = oThis.collection,
					oNavigationProperty,
					bNavigationInsertRestrictions,
					sCurrentCollectionName = oThis.navigationPath,
					sTargetCollectionPath = CommonHelper.getTargetCollection(oThis.collection, oThis.navigationPath),
					aRestrictedProperties = oThis.parentEntitySet.getObject(
						oThis.parentEntitySet.getPath() + "@Org.OData.Capabilities.V1.NavigationRestrictions/RestrictedProperties"
					);
				for (var i in aRestrictedProperties) {
					oNavigationProperty = aRestrictedProperties[i];
					if (
						oNavigationProperty.NavigationProperty.$NavigationPropertyPath === sCurrentCollectionName &&
						oNavigationProperty.InsertRestrictions &&
						oNavigationProperty.InsertRestrictions.Insertable
					) {
						bNavigationInsertRestrictions = oNavigationProperty.InsertRestrictions.Insertable;
					}
				}
				if (!oThis.onCreate || (oThis.creationMode === "CreationRow" && bCreationRow === false)) {
					return false;
				} else if (
					oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction")
				) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (oTargetCollection.getObject(sTargetCollectionPath + "@com.sap.vocabularies.Common.v1.DraftRoot/NewAction")) {
					return (
						oTargetCollection.getObject(
							sTargetCollectionPath +
								"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction@Org.OData.Core.V1.OperationAvailable"
						) !== false
					);
				} else if (bNavigationInsertRestrictions === false) {
					return false;
				} else if (bNavigationInsertRestrictions) {
					// if navigation insert restrictions are present and not static false then we render the button
					return true;
				}
				return (
					oTargetCollection.getObject(sTargetCollectionPath + "@Org.OData.Capabilities.V1.InsertRestrictions/Insertable") !==
					false
				);
			},

			deleteButtonTemplating: function(oThis) {
				var oTargetCollection = oThis.collection;
				if (oThis.selectedContextsModel && oThis.id && oThis.onDelete) {
					if (oThis.showDelete !== undefined && oThis.showDelete !== null) {
						return oThis.showDelete;
					}
					return !(
						oTargetCollection.getObject(
							oTargetCollection.getPath() + "@Org.OData.Capabilities.V1.DeleteRestrictions/Deletable"
						) === false
					);
				}
				return false;
			},
			/**
			 * Returns a string of comma separated fields to add presentation variant to $select query of the table.
			 * The fields are the ones listed into PresentationVariantType RequestAtLeast
			 *
			 * @param {object} oPresentationVariant - Annotation related to com.sap.vocabularies.UI.v1.PresentationVariant
			 * @returns {string} - CSV of fields listed into RequestAtLeast
			 * @private
			 * @sap-restricted
			 */
			addPresentationVariantToSelectQuery: function(oPresentationVariant) {
				var aRequested = [];
				if (
					!(
						oPresentationVariant &&
						TableHelper._isPresentationVariantAnnotation(oPresentationVariant) &&
						oPresentationVariant.RequestAtLeast &&
						oPresentationVariant.RequestAtLeast.length > 0
					)
				) {
					return "";
				}
				oPresentationVariant.RequestAtLeast.forEach(function(oRequested) {
					aRequested.push(oRequested.$PropertyPath);
				});
				return aRequested.join(",");
			},
			/**
			 * Returns a string of comma separated fields to add operation to the $select query of the table.
			 * The fields are the ones used as path in OperationAvaiable annotations for actions
			 * that are present in the UI.LineItem annotation.
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - CSV of path based OperationAvailable fields for actions of this table.
			 * @private
			 * @sap-restricted
			 */
			addOperationAvailableFieldsToSelectQuery: function(aLineItemCollection, oContext) {
				var selectedFieldsArray = [],
					selectFields = "";
				aLineItemCollection.forEach(function(oRecord) {
					var sActionName = oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
						sActionName.indexOf("/") < 0 &&
						!oRecord.Determining
					) {
						if (CommonHelper.getActionPath(oContext.context, false, sActionName, true) === null) {
							selectedFieldsArray.push(sActionName);
						} else {
							var oResult = CommonHelper.getActionPath(oContext.context, false, sActionName);
							if (oResult.sProperty) {
								selectedFieldsArray.push(oResult.sProperty.substr(oResult.sBindingParameter.length + 1));
							}
						}
					}
				});
				selectFields = selectedFieldsArray.join(",");
				return selectFields;
			},
			/**
			 * Returns a stringified JSON object where key-value pairs corresspond to the name of the
			 * action used in UI.DataFieldForAction and the property used as path in OperationAvailable
			 * annotation for this action. If static null is annotated, null is stored as the value.
			 * e.g. an entry of the JSON object would be "someNamespace.SomeBoundAction: SomeProperty".
			 *
			 * @param {Array} aLineItemCollection - array of records in UI.LineItem
			 * @param {object} oContext - context object of the LineItem
			 * @returns {string} - Stringified JSON object
			 * @private
			 * @sap-restricted
			 */
			getOperationAvailableMap: function(aLineItemCollection, oContext) {
				var oActionOperationAvailableMap = {},
					oResult;
				aLineItemCollection.forEach(function(oRecord) {
					var sActionName = oRecord.Action;
					if (
						oRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
						sActionName.indexOf("/") < 0 &&
						!oRecord.Determining
					) {
						oResult = CommonHelper.getActionPath(oContext.context, false, sActionName, true);
						if (oResult === null) {
							oActionOperationAvailableMap[sActionName] = null;
						} else {
							oResult = CommonHelper.getActionPath(oContext.context, false, sActionName);
							if (oResult.sProperty) {
								oActionOperationAvailableMap[sActionName] = oResult.sProperty.substr(oResult.sBindingParameter.length + 1);
							}
						}
					}
				});
				return JSON.stringify(oActionOperationAvailableMap);
			},
			/**
			 * Returns a stringified JSON object containing  Presentation Variant sort conditions
			 * @param {object} oPresentationVariant Presentation variant Annotation
			 * @returns {string} Stringified JSON object
			 */
			getSortConditions: function(oPresentationVariant) {
				if (
					oPresentationVariant &&
					TableHelper._isPresentationVariantAnnotation(oPresentationVariant) &&
					oPresentationVariant.SortOrder
				) {
					var aSortConditions = {};
					oPresentationVariant.SortOrder.forEach(function(oCondition) {
						aSortConditions[oCondition.Property.$PropertyPath] = oCondition.Descending
							? { descending: true }
							: { ascending: true };
					});
					return JSON.stringify(aSortConditions);
				}
				return undefined;
			},
			/**
			 * Return UI Line Item Context
			 * @param {object} oPresentationContext Presentation context object (Presentation variant or UI.LineItem)
			 * @param {object} oContext - context object of the LineItem
			 */
			getUiLineItem: function(oPresentationContext) {
				var oPresentation = oPresentationContext.getObject(oPresentationContext.sPath),
					oModel = oPresentationContext.getModel();
				if (TableHelper._isPresentationVariantAnnotation(oPresentation)) {
					var sLineItemPath,
						aVisualizations = oPresentation.Visualizations;
					for (var i = 0; i < aVisualizations.length; i++) {
						if (aVisualizations[i].$AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.LineItem") !== -1) {
							sLineItemPath = aVisualizations[i].$AnnotationPath;
							break;
						}
					}
					return oModel.getMetaContext(oPresentationContext.getPath().split("@")[0] + sLineItemPath);
				}
				return oPresentationContext;
			},
			/**
			 * Get all fields from collection path
			 * @param sEntitySetPath{string} Path of EntitySet
			 * @param oMetaModel{object} MetaModel instance
			 * @returns {array} properties
			 */
			getCollectionFields: function(sEntitySetPath, oMetaModel) {
				var aProperties = [],
					oObj,
					oEntityType;
				oEntityType = oMetaModel.getObject(sEntitySetPath + "/");
				for (var sKey in oEntityType) {
					oObj = oEntityType[sKey];
					if (oObj && oObj.$kind === "Property") {
						aProperties.push({
							name: sKey,
							label: oMetaModel.getObject(sEntitySetPath + "/" + sKey + "@com.sap.vocabularies.Common.v1.Label"),
							type: oObj.$Type
						});
					}
				}
				return aProperties;
			},
			getRestrictionsPath: function(oCollection, sOperationAvailableFields, oPresentationVariant) {
				var sPResentationVariantFields = TableHelper.addPresentationVariantToSelectQuery(oPresentationVariant);
				var sSelectedFields =
					sOperationAvailableFields +
					(sOperationAvailableFields && sPResentationVariantFields ? "," : "") +
					sPResentationVariantFields;
				if (
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"] &&
					oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path
				) {
					var sRestriction = oCollection["@Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.$Path;
					sSelectedFields = sSelectedFields ? "," + sRestriction : sRestriction;
				}
				return !sSelectedFields ? "" : ", $select: '" + sSelectedFields + "'";
			},
			/**
			 * Calculates the column width for specific use cases.
			 *
			 *  There are issues when the cell in the column is a measure and has a UoM or currency associated to it
			 *	In edit mode this results in two fields and that doesn't work very well for the cell and the fields get cut.
			 *  So we are currently hardcoding width in several cases in edit mode where there are problems
			 * @param {*} oAnnotations - Annotations of the field
			 * @param {string} sDataFieldType - Type of the field
			 * @param {string} sFieldControl - Field control value
			 * @param {boolean} bIsDraftMode - True, if draft mode is enabled
			 * @param {string} sDataType - Datatype of the field
			 * @param {number} nMaxLength - Maximum length of the field
			 * @returns {string} - The column width for specific conditions, otherwise undefined.
			 */
			getColumnWidth: function(
				oAnnotations,
				sDataFieldType,
				sFieldControl,
				bIsDraftMode,
				sDataType,
				nMaxLength,
				oColumnWidth,
				sFieldID
			) {
				var sWidth,
					bHasTextAnnotation = false,
					bIsUnitOrCurrency =
						typeof oAnnotations !== "undefined" &&
						(oAnnotations.hasOwnProperty("@Org.OData.Measures.V1.Unit") ||
							oAnnotations.hasOwnProperty("@Org.OData.Measures.V1.ISOCurrency"));

				if (oColumnWidth && oColumnWidth[sFieldID] && oColumnWidth[sFieldID].width) {
					sWidth = oColumnWidth[sFieldID].width;
				} else if (CommonHelper.getEditMode(oAnnotations, sDataFieldType, sFieldControl, bIsDraftMode) === "Display") {
					bHasTextAnnotation = oAnnotations && oAnnotations.hasOwnProperty("@com.sap.vocabularies.Common.v1.Text");
					if (sDataType === "Edm.String" && !bHasTextAnnotation && nMaxLength && nMaxLength < 10) {
						// Add additional .75 em (~12px) to avoid showing ellipsis in some cases!
						nMaxLength += 0.75;
						if (nMaxLength < 3) {
							// use a min width of 3em (default)
							nMaxLength = 3;
						}
						sWidth = nMaxLength + "em";
					}
				} else if (sDataType === "Edm.Date" || sDataType === "Edm.DateTimeOffset") {
					sWidth = "9em";
				} else if (bIsUnitOrCurrency) {
					sWidth = "18em";
				} else if (sDataType === "Edm.Boolean") {
					sWidth = "8em";
				} else if (
					oAnnotations &&
					oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") &&
					oAnnotations.hasOwnProperty("@com.sap.vocabularies.UI.v1.IsImageURL") === true
				) {
					sWidth = "7em";
				}
				return sWidth;
			},
			/**
			 * Method to add a margin class at the end of control
			 * @function
			 * @name getMarginClass
			 * @param {*} oCollection - DataPoint's Title
			 * @param {*} oDataField - DataPoint's Value
			 * @return {String} - returns classes for adjusting margin between controls.
			 */
			getMarginClass: function(oCollection, oDataField, sVisualization) {
				if (JSON.stringify(oCollection[oCollection.length - 1]) == JSON.stringify(oDataField)) {
					//If rating indicator is last element in fieldgroup, then the 0.5rem margin added by sapMRI class of interactive rating indicator on top and bottom must be nullified.
					if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
						return "sapUiNoMarginBottom sapUiNoMarginTop";
					}
					return "";
				} else {
					//If rating indicator is NOT the last element in fieldgroup, then to maintain the 0.5rem spacing between controls (as per UX spec),
					//only the top margin added by sapMRI class of interactive rating indicator must be nullified.
					if (sVisualization == "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
						return "sapUiNoMarginTop";
					}
					return "sapUiTinyMarginBottom";
				}
			},
			/**
			 * Method to determine if the programming model is sticky
			 * @function
			 * @name isStickySessionSupported
			 * @param {Object} oContext - DataPoint's Title
			 * @return {Boolean} - returns true if sticky, else false
			 */
			isStickySessionSupported: function(oCollection, oInterface) {
				var sMetaPath = oInterface.context
					.getModel()
					.getMetaPath(oInterface.context)
					.split("/")[1];
				var oMeta = oInterface.context
					.getModel()
					.getObject("/" + sMetaPath + "@com.sap.vocabularies.Session.v1.StickySessionSupported");
				return oMeta ? true : false;
			}
		};

		TableHelper.getOperationAvailableMap.requiresIContext = true;
		TableHelper.addOperationAvailableFieldsToSelectQuery.requiresIContext = true;
		return TableHelper;
	},
	/* bExport= */ true
);
