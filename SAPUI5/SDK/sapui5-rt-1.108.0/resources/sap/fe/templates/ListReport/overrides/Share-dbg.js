/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/SemanticDateOperators", "sap/ui/core/routing/HashChanger"], function (Log, CommonUtils, SemanticDateOperators, HashChanger) {
  "use strict";

  function getCountUrl(oController) {
    var _oController$_getTabl;

    var oTable = (_oController$_getTabl = oController._getTable) === null || _oController$_getTabl === void 0 ? void 0 : _oController$_getTabl.call(oController);

    if (!oTable) {
      return "";
    }

    var oBinding = oTable.getRowBinding() || oTable.getBinding("items");
    var sDownloadUrl = oBinding && oBinding.getDownloadUrl() || "";
    var aSplitUrl = sDownloadUrl.split("?");
    var baseUrl = "".concat(aSplitUrl[0], "/$count?"); // getDownloadUrl() returns url with $select, $expand which is not supported when /$count is used to get the record count. only $apply, $search, $filter is supported
    // ?$count=true returns count in a format which is not supported by FLP yet.
    // currently supported format for v4 is ../count.. only (where tile preview will still not work)

    var aSupportedParams = [];

    if (aSplitUrl.length > 1) {
      var urlParams = aSplitUrl[1];
      urlParams.split("&").forEach(function (urlParam) {
        var aUrlParamParts = urlParam.split("=");

        switch (aUrlParamParts[0]) {
          case "$apply":
          case "$search":
          case "$filter":
            aSupportedParams.push(urlParam);
        }
      });
    }

    return baseUrl + aSupportedParams.join("&");
  }

  function getShareEmailUrl() {
    var oUShellContainer = sap.ushell && sap.ushell.Container;

    if (oUShellContainer) {
      return oUShellContainer.getFLPUrlAsync(true).then(function (sFLPUrl) {
        return sFLPUrl;
      }).catch(function (sError) {
        Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
      });
    } else {
      return Promise.resolve(document.URL);
    }
  }

  function getSaveAsTileServiceUrl(oController) {
    var oFilterBar = oController._getFilterBarControl();

    if (oFilterBar) {
      var oConditions = oFilterBar.getFilterConditions();
      var bSaveAsTileServiceUrlAllowed = SemanticDateOperators.hasSemanticDateOperations(oConditions);

      if (bSaveAsTileServiceUrlAllowed) {
        return getCountUrl(oController);
      }
    }

    return "";
  }

  function getJamUrl() {
    var sHash = HashChanger.getInstance().getHash();
    var sBasePath = HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
    var sJamUrl = sHash ? sBasePath + sHash : window.location.hash; // in case we are in cFLP scenario, the application is running
    // inside an iframe, and there for we need to get the cFLP URL
    // and not 'document.URL' that represents the iframe URL

    if (sap.ushell && sap.ushell.Container && sap.ushell.Container.runningInIframe && sap.ushell.Container.runningInIframe()) {
      sap.ushell.Container.getFLPUrl(true).then(function (sUrl) {
        return sUrl.substr(0, sUrl.indexOf("#")) + sJamUrl;
      }).catch(function (sError) {
        Log.error("Could not retrieve cFLP URL for the sharing dialog (dialog will not be opened)", sError);
      });
    } else {
      return window.location.origin + window.location.pathname + sJamUrl;
    }
  }

  var ShareOverride = {
    adaptShareMetadata: function (oShareMetadata) {
      var _this = this;

      Promise.resolve(getJamUrl()).then(function (sJamUrl) {
        var oAppComponent = CommonUtils.getAppComponent(_this.base.getView());
        var oMetadata = oAppComponent.getMetadata();
        var oUIManifest = oMetadata.getManifestEntry("sap.ui");
        var sIcon = oUIManifest && oUIManifest.icons && oUIManifest.icons.icon || "";
        var oAppManifest = oMetadata.getManifestEntry("sap.app");
        var sTitle = oAppManifest && oAppManifest.title || ""; // TODO: check if there is any semantic date used before adding serviceURL as BLI:FIORITECHP1-18023

        oShareMetadata.tile = {
          icon: sIcon,
          title: sTitle,
          queryUrl: getSaveAsTileServiceUrl(_this.base.getView().getController())
        };
        oShareMetadata.title = document.title;
        oShareMetadata.jam.url = sJamUrl; // MS Teams collaboration does not want to allow further changes to the URL
        // so update colloborationInfo model at LR override to ignore further extension changes at multiple levels

        var collaborationInfoModel = _this.base.getView().getModel("collaborationInfo");

        collaborationInfoModel.setProperty("/url", oShareMetadata.url);
        collaborationInfoModel.setProperty("/appTitle", oShareMetadata.title);
      }).catch(function (error) {
        Log.error(error);
      });
      return Promise.resolve(getShareEmailUrl()).then(function (sFLPUrl) {
        oShareMetadata.email.url = sFLPUrl;
        return oShareMetadata;
      });
    }
  };
  return ShareOverride;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJnZXRDb3VudFVybCIsIm9Db250cm9sbGVyIiwib1RhYmxlIiwiX2dldFRhYmxlIiwib0JpbmRpbmciLCJnZXRSb3dCaW5kaW5nIiwiZ2V0QmluZGluZyIsInNEb3dubG9hZFVybCIsImdldERvd25sb2FkVXJsIiwiYVNwbGl0VXJsIiwic3BsaXQiLCJiYXNlVXJsIiwiYVN1cHBvcnRlZFBhcmFtcyIsImxlbmd0aCIsInVybFBhcmFtcyIsImZvckVhY2giLCJ1cmxQYXJhbSIsImFVcmxQYXJhbVBhcnRzIiwicHVzaCIsImpvaW4iLCJnZXRTaGFyZUVtYWlsVXJsIiwib1VTaGVsbENvbnRhaW5lciIsInNhcCIsInVzaGVsbCIsIkNvbnRhaW5lciIsImdldEZMUFVybEFzeW5jIiwidGhlbiIsInNGTFBVcmwiLCJjYXRjaCIsInNFcnJvciIsIkxvZyIsImVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJkb2N1bWVudCIsIlVSTCIsImdldFNhdmVBc1RpbGVTZXJ2aWNlVXJsIiwib0ZpbHRlckJhciIsIl9nZXRGaWx0ZXJCYXJDb250cm9sIiwib0NvbmRpdGlvbnMiLCJnZXRGaWx0ZXJDb25kaXRpb25zIiwiYlNhdmVBc1RpbGVTZXJ2aWNlVXJsQWxsb3dlZCIsIlNlbWFudGljRGF0ZU9wZXJhdG9ycyIsImhhc1NlbWFudGljRGF0ZU9wZXJhdGlvbnMiLCJnZXRKYW1VcmwiLCJzSGFzaCIsIkhhc2hDaGFuZ2VyIiwiZ2V0SW5zdGFuY2UiLCJnZXRIYXNoIiwic0Jhc2VQYXRoIiwiaHJlZkZvckFwcFNwZWNpZmljSGFzaCIsInNKYW1VcmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhhc2giLCJydW5uaW5nSW5JZnJhbWUiLCJnZXRGTFBVcmwiLCJzVXJsIiwic3Vic3RyIiwiaW5kZXhPZiIsIm9yaWdpbiIsInBhdGhuYW1lIiwiU2hhcmVPdmVycmlkZSIsImFkYXB0U2hhcmVNZXRhZGF0YSIsIm9TaGFyZU1ldGFkYXRhIiwib0FwcENvbXBvbmVudCIsIkNvbW1vblV0aWxzIiwiZ2V0QXBwQ29tcG9uZW50IiwiYmFzZSIsImdldFZpZXciLCJvTWV0YWRhdGEiLCJnZXRNZXRhZGF0YSIsIm9VSU1hbmlmZXN0IiwiZ2V0TWFuaWZlc3RFbnRyeSIsInNJY29uIiwiaWNvbnMiLCJpY29uIiwib0FwcE1hbmlmZXN0Iiwic1RpdGxlIiwidGl0bGUiLCJ0aWxlIiwicXVlcnlVcmwiLCJnZXRDb250cm9sbGVyIiwiamFtIiwidXJsIiwiY29sbGFib3JhdGlvbkluZm9Nb2RlbCIsImdldE1vZGVsIiwic2V0UHJvcGVydHkiLCJlbWFpbCJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiU2hhcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgdHlwZSBTaGFyZSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udHJvbGxlcmV4dGVuc2lvbnMvU2hhcmVcIjtcbmltcG9ydCBTZW1hbnRpY0RhdGVPcGVyYXRvcnMgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvU2VtYW50aWNEYXRlT3BlcmF0b3JzXCI7XG5pbXBvcnQgSGFzaENoYW5nZXIgZnJvbSBcInNhcC91aS9jb3JlL3JvdXRpbmcvSGFzaENoYW5nZXJcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IExpc3RSZXBvcnRDb250cm9sbGVyIGZyb20gXCIuLi9MaXN0UmVwb3J0Q29udHJvbGxlci5jb250cm9sbGVyXCI7XG5mdW5jdGlvbiBnZXRDb3VudFVybChvQ29udHJvbGxlcjogTGlzdFJlcG9ydENvbnRyb2xsZXIpIHtcblx0Y29uc3Qgb1RhYmxlID0gb0NvbnRyb2xsZXIuX2dldFRhYmxlPy4oKTtcblx0aWYgKCFvVGFibGUpIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXHRjb25zdCBvQmluZGluZyA9IG9UYWJsZS5nZXRSb3dCaW5kaW5nKCkgfHwgb1RhYmxlLmdldEJpbmRpbmcoXCJpdGVtc1wiKTtcblx0Y29uc3Qgc0Rvd25sb2FkVXJsID0gKG9CaW5kaW5nICYmIChvQmluZGluZyBhcyBhbnkpLmdldERvd25sb2FkVXJsKCkpIHx8IFwiXCI7XG5cdGNvbnN0IGFTcGxpdFVybCA9IHNEb3dubG9hZFVybC5zcGxpdChcIj9cIik7XG5cdGNvbnN0IGJhc2VVcmwgPSBgJHthU3BsaXRVcmxbMF19LyRjb3VudD9gO1xuXHQvLyBnZXREb3dubG9hZFVybCgpIHJldHVybnMgdXJsIHdpdGggJHNlbGVjdCwgJGV4cGFuZCB3aGljaCBpcyBub3Qgc3VwcG9ydGVkIHdoZW4gLyRjb3VudCBpcyB1c2VkIHRvIGdldCB0aGUgcmVjb3JkIGNvdW50LiBvbmx5ICRhcHBseSwgJHNlYXJjaCwgJGZpbHRlciBpcyBzdXBwb3J0ZWRcblx0Ly8gPyRjb3VudD10cnVlIHJldHVybnMgY291bnQgaW4gYSBmb3JtYXQgd2hpY2ggaXMgbm90IHN1cHBvcnRlZCBieSBGTFAgeWV0LlxuXHQvLyBjdXJyZW50bHkgc3VwcG9ydGVkIGZvcm1hdCBmb3IgdjQgaXMgLi4vY291bnQuLiBvbmx5ICh3aGVyZSB0aWxlIHByZXZpZXcgd2lsbCBzdGlsbCBub3Qgd29yaylcblx0Y29uc3QgYVN1cHBvcnRlZFBhcmFtczogYW55W10gPSBbXTtcblx0aWYgKGFTcGxpdFVybC5sZW5ndGggPiAxKSB7XG5cdFx0Y29uc3QgdXJsUGFyYW1zID0gYVNwbGl0VXJsWzFdO1xuXHRcdHVybFBhcmFtcy5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbiAodXJsUGFyYW06IGFueSkge1xuXHRcdFx0Y29uc3QgYVVybFBhcmFtUGFydHMgPSB1cmxQYXJhbS5zcGxpdChcIj1cIik7XG5cdFx0XHRzd2l0Y2ggKGFVcmxQYXJhbVBhcnRzWzBdKSB7XG5cdFx0XHRcdGNhc2UgXCIkYXBwbHlcIjpcblx0XHRcdFx0Y2FzZSBcIiRzZWFyY2hcIjpcblx0XHRcdFx0Y2FzZSBcIiRmaWx0ZXJcIjpcblx0XHRcdFx0XHRhU3VwcG9ydGVkUGFyYW1zLnB1c2godXJsUGFyYW0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBiYXNlVXJsICsgYVN1cHBvcnRlZFBhcmFtcy5qb2luKFwiJlwiKTtcbn1cblxuZnVuY3Rpb24gZ2V0U2hhcmVFbWFpbFVybCgpIHtcblx0Y29uc3Qgb1VTaGVsbENvbnRhaW5lciA9IHNhcC51c2hlbGwgJiYgc2FwLnVzaGVsbC5Db250YWluZXI7XG5cdGlmIChvVVNoZWxsQ29udGFpbmVyKSB7XG5cdFx0cmV0dXJuIG9VU2hlbGxDb250YWluZXJcblx0XHRcdC5nZXRGTFBVcmxBc3luYyh0cnVlKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHNGTFBVcmw6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gc0ZMUFVybDtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHNFcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkNvdWxkIG5vdCByZXRyaWV2ZSBjRkxQIFVSTCBmb3IgdGhlIHNoYXJpbmcgZGlhbG9nIChkaWFsb2cgd2lsbCBub3QgYmUgb3BlbmVkKVwiLCBzRXJyb3IpO1xuXHRcdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShkb2N1bWVudC5VUkwpO1xuXHR9XG59XG5mdW5jdGlvbiBnZXRTYXZlQXNUaWxlU2VydmljZVVybChvQ29udHJvbGxlcjogYW55KSB7XG5cdGNvbnN0IG9GaWx0ZXJCYXIgPSBvQ29udHJvbGxlci5fZ2V0RmlsdGVyQmFyQ29udHJvbCgpO1xuXHRpZiAob0ZpbHRlckJhcikge1xuXHRcdGNvbnN0IG9Db25kaXRpb25zID0gb0ZpbHRlckJhci5nZXRGaWx0ZXJDb25kaXRpb25zKCk7XG5cdFx0Y29uc3QgYlNhdmVBc1RpbGVTZXJ2aWNlVXJsQWxsb3dlZCA9IFNlbWFudGljRGF0ZU9wZXJhdG9ycy5oYXNTZW1hbnRpY0RhdGVPcGVyYXRpb25zKG9Db25kaXRpb25zKTtcblx0XHRpZiAoYlNhdmVBc1RpbGVTZXJ2aWNlVXJsQWxsb3dlZCkge1xuXHRcdFx0cmV0dXJuIGdldENvdW50VXJsKG9Db250cm9sbGVyKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFwiXCI7XG59XG5mdW5jdGlvbiBnZXRKYW1VcmwoKSB7XG5cdGNvbnN0IHNIYXNoID0gSGFzaENoYW5nZXIuZ2V0SW5zdGFuY2UoKS5nZXRIYXNoKCk7XG5cdGNvbnN0IHNCYXNlUGF0aCA9IChIYXNoQ2hhbmdlci5nZXRJbnN0YW5jZSgpIGFzIGFueSkuaHJlZkZvckFwcFNwZWNpZmljSGFzaFxuXHRcdD8gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoKFwiXCIpXG5cdFx0OiBcIlwiO1xuXHRjb25zdCBzSmFtVXJsID0gc0hhc2ggPyBzQmFzZVBhdGggKyBzSGFzaCA6IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHQvLyBpbiBjYXNlIHdlIGFyZSBpbiBjRkxQIHNjZW5hcmlvLCB0aGUgYXBwbGljYXRpb24gaXMgcnVubmluZ1xuXHQvLyBpbnNpZGUgYW4gaWZyYW1lLCBhbmQgdGhlcmUgZm9yIHdlIG5lZWQgdG8gZ2V0IHRoZSBjRkxQIFVSTFxuXHQvLyBhbmQgbm90ICdkb2N1bWVudC5VUkwnIHRoYXQgcmVwcmVzZW50cyB0aGUgaWZyYW1lIFVSTFxuXHRpZiAoc2FwLnVzaGVsbCAmJiBzYXAudXNoZWxsLkNvbnRhaW5lciAmJiBzYXAudXNoZWxsLkNvbnRhaW5lci5ydW5uaW5nSW5JZnJhbWUgJiYgc2FwLnVzaGVsbC5Db250YWluZXIucnVubmluZ0luSWZyYW1lKCkpIHtcblx0XHRzYXAudXNoZWxsLkNvbnRhaW5lci5nZXRGTFBVcmwodHJ1ZSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChzVXJsOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIHNVcmwuc3Vic3RyKDAsIHNVcmwuaW5kZXhPZihcIiNcIikpICsgc0phbVVybDtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHNFcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihcIkNvdWxkIG5vdCByZXRyaWV2ZSBjRkxQIFVSTCBmb3IgdGhlIHNoYXJpbmcgZGlhbG9nIChkaWFsb2cgd2lsbCBub3QgYmUgb3BlbmVkKVwiLCBzRXJyb3IpO1xuXHRcdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBzSmFtVXJsO1xuXHR9XG59XG5cbmNvbnN0IFNoYXJlT3ZlcnJpZGUgPSB7XG5cdGFkYXB0U2hhcmVNZXRhZGF0YTogZnVuY3Rpb24gKHRoaXM6IFNoYXJlLCBvU2hhcmVNZXRhZGF0YTogYW55KSB7XG5cdFx0UHJvbWlzZS5yZXNvbHZlKGdldEphbVVybCgpKVxuXHRcdFx0LnRoZW4oKHNKYW1Vcmw6IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4ge1xuXHRcdFx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KHRoaXMuYmFzZS5nZXRWaWV3KCkpO1xuXHRcdFx0XHRjb25zdCBvTWV0YWRhdGEgPSBvQXBwQ29tcG9uZW50LmdldE1ldGFkYXRhKCk7XG5cdFx0XHRcdGNvbnN0IG9VSU1hbmlmZXN0ID0gb01ldGFkYXRhLmdldE1hbmlmZXN0RW50cnkoXCJzYXAudWlcIik7XG5cdFx0XHRcdGNvbnN0IHNJY29uID0gKG9VSU1hbmlmZXN0ICYmIG9VSU1hbmlmZXN0Lmljb25zICYmIG9VSU1hbmlmZXN0Lmljb25zLmljb24pIHx8IFwiXCI7XG5cdFx0XHRcdGNvbnN0IG9BcHBNYW5pZmVzdCA9IG9NZXRhZGF0YS5nZXRNYW5pZmVzdEVudHJ5KFwic2FwLmFwcFwiKTtcblx0XHRcdFx0Y29uc3Qgc1RpdGxlID0gKG9BcHBNYW5pZmVzdCAmJiBvQXBwTWFuaWZlc3QudGl0bGUpIHx8IFwiXCI7XG5cdFx0XHRcdC8vIFRPRE86IGNoZWNrIGlmIHRoZXJlIGlzIGFueSBzZW1hbnRpYyBkYXRlIHVzZWQgYmVmb3JlIGFkZGluZyBzZXJ2aWNlVVJMIGFzIEJMSTpGSU9SSVRFQ0hQMS0xODAyM1xuXHRcdFx0XHRvU2hhcmVNZXRhZGF0YS50aWxlID0ge1xuXHRcdFx0XHRcdGljb246IHNJY29uLFxuXHRcdFx0XHRcdHRpdGxlOiBzVGl0bGUsXG5cdFx0XHRcdFx0cXVlcnlVcmw6IGdldFNhdmVBc1RpbGVTZXJ2aWNlVXJsKHRoaXMuYmFzZS5nZXRWaWV3KCkuZ2V0Q29udHJvbGxlcigpKVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRvU2hhcmVNZXRhZGF0YS50aXRsZSA9IGRvY3VtZW50LnRpdGxlO1xuXHRcdFx0XHRvU2hhcmVNZXRhZGF0YS5qYW0udXJsID0gc0phbVVybDtcblx0XHRcdFx0Ly8gTVMgVGVhbXMgY29sbGFib3JhdGlvbiBkb2VzIG5vdCB3YW50IHRvIGFsbG93IGZ1cnRoZXIgY2hhbmdlcyB0byB0aGUgVVJMXG5cdFx0XHRcdC8vIHNvIHVwZGF0ZSBjb2xsb2JvcmF0aW9uSW5mbyBtb2RlbCBhdCBMUiBvdmVycmlkZSB0byBpZ25vcmUgZnVydGhlciBleHRlbnNpb24gY2hhbmdlcyBhdCBtdWx0aXBsZSBsZXZlbHNcblx0XHRcdFx0Y29uc3QgY29sbGFib3JhdGlvbkluZm9Nb2RlbDogSlNPTk1vZGVsID0gdGhpcy5iYXNlLmdldFZpZXcoKS5nZXRNb2RlbChcImNvbGxhYm9yYXRpb25JbmZvXCIpIGFzIEpTT05Nb2RlbDtcblx0XHRcdFx0Y29sbGFib3JhdGlvbkluZm9Nb2RlbC5zZXRQcm9wZXJ0eShcIi91cmxcIiwgb1NoYXJlTWV0YWRhdGEudXJsKTtcblx0XHRcdFx0Y29sbGFib3JhdGlvbkluZm9Nb2RlbC5zZXRQcm9wZXJ0eShcIi9hcHBUaXRsZVwiLCBvU2hhcmVNZXRhZGF0YS50aXRsZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcjogYW55KSB7XG5cdFx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoZ2V0U2hhcmVFbWFpbFVybCgpKS50aGVuKGZ1bmN0aW9uIChzRkxQVXJsOiBhbnkpIHtcblx0XHRcdG9TaGFyZU1ldGFkYXRhLmVtYWlsLnVybCA9IHNGTFBVcmw7XG5cdFx0XHRyZXR1cm4gb1NoYXJlTWV0YWRhdGE7XG5cdFx0fSk7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlT3ZlcnJpZGU7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFPQSxTQUFTQSxXQUFULENBQXFCQyxXQUFyQixFQUF3RDtJQUFBOztJQUN2RCxJQUFNQyxNQUFNLDRCQUFHRCxXQUFXLENBQUNFLFNBQWYsMERBQUcsMkJBQUFGLFdBQVcsQ0FBMUI7O0lBQ0EsSUFBSSxDQUFDQyxNQUFMLEVBQWE7TUFDWixPQUFPLEVBQVA7SUFDQTs7SUFDRCxJQUFNRSxRQUFRLEdBQUdGLE1BQU0sQ0FBQ0csYUFBUCxNQUEwQkgsTUFBTSxDQUFDSSxVQUFQLENBQWtCLE9BQWxCLENBQTNDO0lBQ0EsSUFBTUMsWUFBWSxHQUFJSCxRQUFRLElBQUtBLFFBQUQsQ0FBa0JJLGNBQWxCLEVBQWIsSUFBb0QsRUFBekU7SUFDQSxJQUFNQyxTQUFTLEdBQUdGLFlBQVksQ0FBQ0csS0FBYixDQUFtQixHQUFuQixDQUFsQjtJQUNBLElBQU1DLE9BQU8sYUFBTUYsU0FBUyxDQUFDLENBQUQsQ0FBZixhQUFiLENBUnVELENBU3ZEO0lBQ0E7SUFDQTs7SUFDQSxJQUFNRyxnQkFBdUIsR0FBRyxFQUFoQzs7SUFDQSxJQUFJSCxTQUFTLENBQUNJLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7TUFDekIsSUFBTUMsU0FBUyxHQUFHTCxTQUFTLENBQUMsQ0FBRCxDQUEzQjtNQUNBSyxTQUFTLENBQUNKLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJLLE9BQXJCLENBQTZCLFVBQVVDLFFBQVYsRUFBeUI7UUFDckQsSUFBTUMs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