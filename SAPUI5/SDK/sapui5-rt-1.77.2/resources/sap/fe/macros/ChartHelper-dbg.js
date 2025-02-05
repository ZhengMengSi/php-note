/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the chart/item and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	["sap/ui/model/json/JSONModel", "./ODataMetaModelUtil"],
	function(JSONModel, util) {
		"use strict";

		function formatJSONToString(oCrit) {
			if (!oCrit) {
				return undefined;
			}

			var sCriticality = JSON.stringify(oCrit);
			sCriticality = sCriticality.replace(new RegExp("{", "g"), "\\{");
			sCriticality = sCriticality.replace(new RegExp("}", "g"), "\\}");
			return sCriticality;
		}

		function getEntitySetPath(oAnnotationContext) {
			var sAnnoPath = oAnnotationContext.getPath(),
				iAnnoIndex = sAnnoPath.lastIndexOf("@com.sap.vocabularies.UI.v1.Chart"),
				sPathEntitySetPath = sAnnoPath.substr(0, iAnnoIndex);

			return sPathEntitySetPath;
		}

		/**
		 * Helper class for sap.fe.macros Chart phantom control for prepecosseing.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behaviour is not finalised
		 * and hence this should not be used for productive usage.
		 * Especially this class is not intended to be used for the FE scenario,
		 * here we shall use sap.fe.macros.ChartHelper that is especially tailored for V4
		 * meta model
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.62
		 * @alias sap.fe.macros.ChartHelper
		 */
		var ChartHelper = {};

		var mChartType = {
			"com.sap.vocabularies.UI.v1.ChartType/Column": "column",
			"com.sap.vocabularies.UI.v1.ChartType/ColumnStacked": "stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/ColumnDual": "dual_column",
			"com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual": "dual_stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/ColumnStacked100": "100_stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual100": "100_dual_stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/Bar": "bar",
			"com.sap.vocabularies.UI.v1.ChartType/BarStacked": "stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/BarDual": "dual_bar",
			"com.sap.vocabularies.UI.v1.ChartType/BarStackedDual": "dual_stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/BarStacked100": "100_stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/BarStackedDual100": "100_dual_stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/Area": "area",
			"com.sap.vocabularies.UI.v1.ChartType/AreaStacked": "stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/AreaStacked100": "100_stacked_column",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalArea": "bar",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked": "stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked100": "100_stacked_bar",
			"com.sap.vocabularies.UI.v1.ChartType/Line": "line",
			"com.sap.vocabularies.UI.v1.ChartType/LineDual": "dual_line",
			"com.sap.vocabularies.UI.v1.ChartType/Combination": "combination",
			"com.sap.vocabularies.UI.v1.ChartType/CombinationStacked": "stacked_combination",
			"com.sap.vocabularies.UI.v1.ChartType/CombinationDual": "dual_combination",
			"com.sap.vocabularies.UI.v1.ChartType/CombinationStackedDual": "dual_stacked_combination",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStacked": "horizontal_stacked_combination",
			"com.sap.vocabularies.UI.v1.ChartType/Pie": "pie",
			"com.sap.vocabularies.UI.v1.ChartType/Donut": "donut",
			"com.sap.vocabularies.UI.v1.ChartType/Scatter": "scatter",
			"com.sap.vocabularies.UI.v1.ChartType/Bubble": "bubble",
			"com.sap.vocabularies.UI.v1.ChartType/Radar": "line",
			"com.sap.vocabularies.UI.v1.ChartType/HeatMap": "heatmap",
			"com.sap.vocabularies.UI.v1.ChartType/TreeMap": "treemap",
			"com.sap.vocabularies.UI.v1.ChartType/Waterfall": "waterfall",
			"com.sap.vocabularies.UI.v1.ChartType/Bullet": "bullet",
			"com.sap.vocabularies.UI.v1.ChartType/VerticalBullet": "vertical_bullet",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalWaterfall": "horizontal_waterfall",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationDual": "dual_horizontal_combination",
			"com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStackedDual": "dual_horizontal_stacked_combination"
		};

		var mMeasureRole = {
			"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1": "axis1",
			"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2": "axis2",
			"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3": "axis3",
			"com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis4": "axis4"
		};

		var mDimensionRole = {
			"com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category": "category",
			"com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series": "series",
			"com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category2": "category2"
		};

		ChartHelper.formatChartType = function(oChartType) {
			return mChartType[oChartType.$EnumMember];
		};

		ChartHelper.formatDimensions = function(oAnnotationContext) {
			var oAnnotation = oAnnotationContext.getObject(""),
				oMetaModel = oAnnotationContext.getModel(),
				sEntitySetPath = getEntitySetPath(oAnnotationContext),
				aDimensions = [],
				i,
				j;

			//perhaps there are no dimension attributes
			oAnnotation.DimensionAttributes = oAnnotation.DimensionAttributes || [];

			for (i = 0; i < oAnnotation.Dimensions.length; i++) {
				var sKey = oAnnotation.Dimensions[i].$PropertyPath;
				var oDimension = {
					key: sKey,
					label: oMetaModel.getObject(sEntitySetPath + sKey + "@com.sap.vocabularies.Common.v1.Label"),
					role: "category"
				};

				for (j = 0; j < oAnnotation.DimensionAttributes.length; j++) {
					var oAttribute = oAnnotation.DimensionAttributes[j];

					if (oDimension.key === oAttribute.Dimension.$PropertyPath) {
						oDimension.role = mDimensionRole[oAttribute.Role.$EnumMember] || oDimension.role;
						break;
					}
				}

				oDimension.criticality = util
					.fetchCriticality(oMetaModel, oMetaModel.createBindingContext(sEntitySetPath + sKey))
					.then(formatJSONToString);

				aDimensions.push(oDimension);
			}

			var oDimensionModel = new JSONModel(aDimensions);
			oDimensionModel.$$valueAsPromise = true;
			return oDimensionModel.createBindingContext("/");
		};

		ChartHelper.formatMeasures = function(oAnnotationContext) {
			var oAnnotation = oAnnotationContext.getObject(""),
				oMetaModel = oAnnotationContext.getModel(),
				sEntitySetPath = getEntitySetPath(oAnnotationContext),
				aMeasures = [],
				i,
				j,
				sDataPoint,
				oDataPoint;

			//retrieve aggregation information from entity set
			var aAnalytics = oMetaModel.getObject(sEntitySetPath + "@com.sap.vocabularies.Analytics.v1.AggregatedProperties") || [],
				mAnalytics = {};

			for (i = 0; i < aAnalytics.length; i++) {
				mAnalytics[aAnalytics[i].Value] = aAnalytics[i];
			}

			//perhaps there are no Measure attributes
			oAnnotation.MeasureAttributes = oAnnotation.MeasureAttributes || [];

			for (i = 0; i < oAnnotation.Measures.length; i++) {
				var sKey = oAnnotation.Measures[i].$PropertyPath;
				var oMeasure = {
					key: sKey,
					label: oMetaModel.getObject(sEntitySetPath + sKey + "@com.sap.vocabularies.Common.v1.Label"),
					role: "axis1"
				};

				var oAnalytics = mAnalytics[sKey];
				if (oAnalytics) {
					oMeasure.propertyPath = oAnalytics.AggregatableProperty.$PropertyPath;
					oMeasure.aggregationMethod = oAnalytics.AggregationMethod;
					oMeasure.label = oAnalytics["@com.sap.vocabularies.Common.v1.Label"] || oMeasure.label;
				}

				for (j = 0; j < oAnnotation.MeasureAttributes.length; j++) {
					var oAttribute = oAnnotation.MeasureAttributes[j];

					if (oMeasure.key === oAttribute.Measure.$PropertyPath) {
						oMeasure.role = mMeasureRole[oAttribute.Role.$EnumMember] || oMeasure.role;

						//still to add data point, but MDC Chart API is missing
						sDataPoint = oAttribute.DataPoint ? oAttribute.DataPoint.$AnnotationPath : null;
						if (sDataPoint != null) {
							oDataPoint = oMetaModel.getObject(sEntitySetPath + sDataPoint);
							if (oDataPoint.Value.$Path == oMeasure.key) {
								oMeasure.dataPoint = formatJSONToString(util.createDataPointProperty(oDataPoint));
							}
						}
						continue;
					}
				}

				aMeasures.push(oMeasure);
			}

			var oMeasureModel = new JSONModel(aMeasures);
			return oMeasureModel.createBindingContext("/");
		};

		return ChartHelper;
	},
	/* bExport= */ false
);
