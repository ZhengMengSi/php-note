import { TitleLevel } from "sap/ui/core/library";

/**
 * Helper class used by MDC controls for OData(V4) specific handling
 *
 * @private
 * @experimental This module is only for internal/experimental use!
 */
const FormHelper = {
	/*
	 * Method that checks, if a reference facet needs to be assigned to either "blocks" or "moreBlocks" (tagged by subsection property "partOfPreview!)
	 * @function isReferenceFacetPartOfPreview
	 * @memberof sap.fe.macros.form.FormHelper.js
	 * @param {Object} - oReferenceFacet : Reference facet that needs to be assigned
	 * @param {String} - sPartOfPreview : Subsection property "partOfPreview" that needs to aligned with the reference facet's annotation "PartOfPreview!
	 * @return : {boolean} True, if the ReferenceFacet has the same annotation as the subsection's property "partOfPreview"
	 */
	isReferenceFacetPartOfPreview: function (oReferenceFacet: any, sPartOfPreview: any) {
		sPartOfPreview = sPartOfPreview.toString();
		if (oReferenceFacet.$Type === "com.sap.vocabularies.UI.v1.ReferenceFacet") {
			const annotatedTerm = oReferenceFacet["@com.sap.vocabularies.UI.v1.PartOfPreview"];
			return (sPartOfPreview === "true" && annotatedTerm !== false) || (sPartOfPreview === "false" && annotatedTerm === false);
		}
		return false;
	},

	/**
	 * Creates and returns a select query with the selected fields from the parameters passed.
	 *
	 * @param aSemanticKeys SemanticKeys included in the entity set
	 * @returns The fields to be included in the select query
	 */
	create$Select: function (aSemanticKeys: any[]) {
		let sSelectedFields = "";
		aSemanticKeys.forEach(function (oSemanticKey: any) {
			sSelectedFields += sSelectedFields ? `,${oSemanticKey.$PropertyPath}` : oSemanticKey.$PropertyPath;
		});
		return sSelectedFields;
	},

	/**
	 * Generates the binding expression for the form.
	 *
	 * @param sNavigationPath The navigation path defined for the entity
	 * @param aSemanticKeys SemanticKeys included in the entity set
	 * @returns The Binding expression including path and $select query as parameter depending on the function parameters
	 */
	generateBindingExpression: function (sNavigationPath: string, aSemanticKeys: any[]) {
		if (!sNavigationPath && !aSemanticKeys) {
			return "";
		}
		const oBinding: any = {
			path: sNavigationPath || ""
		};
		if (aSemanticKeys) {
			oBinding.parameters = { $select: FormHelper.create$Select(aSemanticKeys) };
		}
		return JSON.stringify(oBinding);
	},

	/**
	 * Calculates the title level for the containers in this form.
	 *
	 * If there is no form title, the form containers get the same header level as the form, otherwise the levels are incremented to reflect the deeper nesting.
	 *
	 * @param [title] The title of the form
	 * @param [titleLevel] The title level of the form
	 * @returns The title level of the form containers
	 */
	getFormContainerTitleLevel: function (title?: string, titleLevel?: TitleLevel): TitleLevel | undefined {
		if (!title) {
			return titleLevel;
		}
		switch (titleLevel) {
			case TitleLevel.H1:
				return TitleLevel.H2;
			case TitleLevel.H2:
				return TitleLevel.H3;
			case TitleLevel.H3:
				return TitleLevel.H4;
			case TitleLevel.H4:
				return TitleLevel.H5;
			case TitleLevel.H5:
			case TitleLevel.H6:
				return TitleLevel.H6;
			default:
				return TitleLevel.Auto;
		}
	}
};

export default FormHelper;
