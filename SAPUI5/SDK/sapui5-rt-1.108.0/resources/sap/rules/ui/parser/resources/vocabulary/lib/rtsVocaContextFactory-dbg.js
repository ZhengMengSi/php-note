sap.ui.define([
	"sap/rules/ui/parser/resources/vocabulary/lib/constants"
], function(vocabularyConstants) {
    "use strict";
    
    function rtsContextFactoryLib() {
		//Constructor to enable usage of public method on the client side.
		//This mechanism was used in HRF to enable association to corresponding namespace in the client side.
	}
	
	
	//private methods
	function getRTSContextJSON(inputParamObj){	
		
		var rtsContextJSON = sap.ui.require("sap/rules/ui/parser/resources/vocabulary/lib/rtsContextJSON");
		//var rtsContextJSON = sap.rules.ui.parser.resources.vocabulary.lib.rtsContextJSON.lib;
		
		var rtsContextJSONInstance = new rtsContextJSON.rtsContextJSONLib(inputParamObj.resourceContent, inputParamObj.resourceID);
		return rtsContextJSONInstance;
	}

	
	function getRTSContextHANA(inputParamObj){			

		var rtsContextHANALib = sap.ui.require("sap/rules/ui/parser/resources/vocabulary/lib/serverDBRTContext");
		//var rtsContextHANALib = sap.rules.ui.parser.resources.vocabulary.lib.serverDBRTContext;
		
		var rtsContextHANAInstance = new rtsContextHANALib.ServerVocaRTContext(inputParamObj.connection);
		return rtsContextHANAInstance; 
	}


	function getRTSContextHybrid(inputParamObj){			

		var rtsContextHYBRIDLib = sap.ui.require("sap/rules/ui/parser/resources/vocabulary/lib/serverJSONandDBRTcontext");
		//var rtsContextHYBRIDLib = sap.rules.ui.parser.resources.vocabulary.lib.serverJSONandDBRTcontext;
		
		var rtsContextHybridInstance = new rtsContextHYBRIDLib.ServerVocaDBandJsonRTContext(inputParamObj.connection, inputParamObj.resourceContent, inputParamObj.resourceID, inputParamObj.isThisPrivateVoca, inputParamObj.versionId);
		return rtsContextHybridInstance; 
	}

	
	rtsContextFactoryLib.prototype.getRTSContext = function (inputParamObj) {
		var context = null;
		
		switch (inputParamObj.vocaLoadingType) {
		case vocabularyConstants.vocaContextTypeEnum.JSON:
			context = getRTSContextJSON(inputParamObj); 
			break;
		case vocabularyConstants.vocaContextTypeEnum.HANA:
			context = getRTSContextHANA(inputParamObj);  
			break;
		case vocabularyConstants.vocaContextTypeEnum.HYBRID:
			context = getRTSContextHybrid(inputParamObj); 
			break;
		}
		return context;
	};
	
	return {
		rtsContextFactoryLib: rtsContextFactoryLib
	};
}, true);