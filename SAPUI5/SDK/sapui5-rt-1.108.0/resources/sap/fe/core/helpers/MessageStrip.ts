import ResourceBundle from "sap/base/i18n/ResourceBundle";
import CommonUtils from "sap/fe/core/CommonUtils";
import DelegateUtil from "sap/fe/macros/DelegateUtil";
import Control from "sap/ui/core/Control";
import Core from "sap/ui/core/Core";
import { system } from "sap/ui/Device";

function getLabels(aIgnoredFields: string[], sEntityTypePath: string, oFilterControl: Control, oResourceBundle: ResourceBundle): string[] {
	const oMetaModel = oFilterControl.getModel().getMetaModel(),
		aIgnoredLabels = aIgnoredFields.map(function (sProperty) {
			const oMacroResourceBundle = Core.getLibraryResourceBundle("sap.fe.macros") as ResourceBundle;
			if (sProperty === "$search") {
				return oMacroResourceBundle ? oMacroResourceBundle.getText("M_FILTERBAR_SEARCH") : "";
			}
			if (sProperty === "$editState") {
				return oResourceBundle ? oResourceBundle.getText("FILTERBAR_EDITING_STATUS") : "";
			}
			const sLabel = oMetaModel.getObject(`${sEntityTypePath}${sProperty}@com.sap.vocabularies.Common.v1.Label`);
			return DelegateUtil.getLocalizedText(sLabel, oFilterControl);
		});
	return aIgnoredLabels;
}
function getALPText(aIgnoredLabels: string[], oFilterBar: Control, bIsSearchIgnored: boolean) {
	let sResourceKey = "";
	let aParameters: string[] = [];
	const oResourceBundle = _getResourceBundle();

	if (!oResourceBundle) {
		return "";
	}

	const view = CommonUtils.getTargetView(oFilterBar);
	const oChart = view.getController().getChartControl();
	const bIsDraftSupported = oChart.data("draftSupported") === "true";
	const oMacroResourceBundle = Core.getLibraryResourceBundle("sap.fe.macros") as ResourceBundle;
	bIsSearchIgnored = bIsSearchIgnored && aIgnoredLabels.includes(oMacroResourceBundle.getText("M_FILTERBAR_SEARCH"));
	const sDefaultResourceKey = `C_LR_MULTIVIZ_CHART_${_getArgumentSize(aIgnoredLabels)}_IGNORED_FILTER_${_getSizeText()}`;

	if (bIsDraftSupported && ((aIgnoredLabels.length === 2 && bIsSearchIgnored) || aIgnoredLabels.length === 1)) {
		sResourceKey =
			aIgnoredLabels.length === 1
				? "C_MULTIVIZ_CHART_IGNORED_FILTER_DRAFT_DATA"
				: "C_LR_MULTIVIZ_CHART_IGNORED_FILTER_DRAFT_DATA_AND_SEARCH";
	} else {
		sResourceKey = sDefaultResourceKey;
		aParameters = [aIgnoredLabels.join(", ")];
	}
	return oResourceBundle.getText(sResourceKey, aParameters);
}

function getText(aIgnoredLabels: string[], oFilterBar: Control, sTabTitle: string, fnGetLocalizedText: Function): string {
	const oResourceBundle = _getResourceBundle();
	return oResourceBundle
		? oResourceBundle.getText(`C_LR_MULTITABLES_${_getArgumentSize(aIgnoredLabels)}_IGNORED_FILTER_${_getSizeText()}`, [
				aIgnoredLabels.join(", "),
				fnGetLocalizedText(sTabTitle, oFilterBar)
		  ])
		: "";
}

function _getSizeText() {
	return system.desktop ? "LARGE" : "SMALL";
}

function _getArgumentSize(aIgnoredLabels: any[]) {
	return aIgnoredLabels.length === 1 ? "SINGLE" : "MULTI";
}

function _getResourceBundle(): ResourceBundle | undefined {
	return Core.getLibraryResourceBundle("sap.fe.templates") as ResourceBundle;
}

const MessageStripHelper = {
	getALPText: getALPText,
	getText: getText,
	getLabels: getLabels
};

export default MessageStripHelper;
