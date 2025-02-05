/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/zen/crosstab/rendering/RenderingConstants"
  ],
  function(jQuery, Log,RenderingConstants) {
    "use strict";
    var Utils = function (oCrosstab) {
      var that = this;
      var sQueuedHeaderWidthCommand = null;
      var oProfiles = {};
      var oScrollPosData = null;

      this.beginProfiling = function(sKey, sText) {
        var iTsBegin = Date.now();
        oProfiles[sKey] = {"iTsBegin" : iTsBegin, "sText" : sText};
      };

      this.endProfiling = function(sKey) {
        var iTsEnd = Date.now();
        var oProfile = oProfiles[sKey];
        if (oProfile) {
          Log.error("CROSSTAB PERF: " + sKey + ": " + oProfile.sText + ": DURATION: " + (iTsEnd - oProfile.iTsBegin) + "ms");
        }
      };
      this.getModelCoordinates = function (iAreaRow, iAreaCol, sAreaType) {
        var oModelCoordinates = {};
        oModelCoordinates.iRow = iAreaRow;
        oModelCoordinates.iCol = iAreaCol;

        var iColHeaderAreaRows = oCrosstab.getColumnHeaderArea().getRowCnt();
        var iRowHeaderAreaCols = oCrosstab.getRowHeaderArea().getColCnt();

        if (sAreaType === RenderingConstants.TYPE_DATA_AREA) {
          oModelCoordinates.iRow += iColHeaderAreaRows;
          oModelCoordinates.iCol += iRowHeaderAreaCols;
        } else if (sAreaType === RenderingConstants.TYPE_COLUMN_HEADER_AREA) {
          oModelCoordinates.iCol += iRowHeaderAreaCols;
        } else if (sAreaType === RenderingConstants.TYPE_ROW_HEADER_AREA) {
          oModelCoordinates.iRow += iColHeaderAreaRows;
        }
        return oModelCoordinates;
      };


      this.selectTextInInputField = function (oInputField, iSelectionStartPos, iSelectionEndPos) {
        if (iSelectionStartPos === -1 && iSelectionEndPos === -1) {
          oInputField.select();
        } else {
          var oDomInputField = oInputField[0];
          if (oCrosstab.isIE8Mode()) {
            if (oDomInputField.createTextRange !== "undefined") {
              var oRange = oDomInputField.createTextRange();
              oRange.collapse(true);
              // This must be done in exactly this order!
              oRange.moveEnd("character", iSelectionEndPos + 1);
              oRange.moveStart("character", iSelectionStartPos);
              oRange.select();
            }
          } else if (oDomInputField.selectionStart !== "undefined") {
            oDomInputField.selectionStart = iSelectionStartPos;
            oDomInputField.selectionEnd = iSelectionEndPos;
          }
        }
      };

      this.getSelectionParams = function (oDomContainerDiv) {
        var iStartPos = -1;
        var iEndPos = -1;
        if (oCrosstab.isIE8Mode()) {
          if (document.selection !== "undefined" && document.selection.type === "Text") {
            var oRange = document.selection.createRange();
            if (oRange && oRange.text.length > 0) {
              var oBodyRange = document.body.createTextRange();
              oBodyRange.moveToElementText(oDomContainerDiv);
              oBodyRange.setEndPoint("EndToStart", oRange);
              iStartPos = oBodyRange.text.length;
              iEndPos = iStartPos + oRange.text.length - 1;
            }
          }
        } else if (window.getSelection) {
          var sSelectedText = window.getSelection().toString();
          if (sSelectedText && sSelectedText.length > 0) {
            iStartPos = window.getSelection().anchorOffset;
            iEndPos = window.getSelection().focusOffset;
          }
        }
        return {
          iSelectionStartPos: iStartPos,
          iSelectionEndPos: iEndPos
        };
      };

      this.sendClientScrollPosUpdate = function(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd, bIsHeaderData) {
        var oCrossRequestManager = oCrosstab.getRenderEngine().getCrossRequestManager();
        if (oCrossRequestManager) {
          if (bIsHeaderData === true) {
            oCrossRequestManager.setHeaderScrollData({"iHPos" : iCurrentHScrollStep});
          } else {
            oCrossRequestManager.setScrollData(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd);
          }
        }
        that.sendScrollPosUpdate(iCurrentHScrollStep, bHScrolledToEnd, iCurrentVScrollStep, bVScrolledToEnd, bIsHeaderData);
      };

      this.saveScrollPosData = function(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData) {
        if (!oScrollPosData) {
          oScrollPosData = {};
        }
        oScrollPosData.iHScrollPos = piHScrollPos;
        oScrollPosData.bHScrolledToEnd = pbHScrolledToEnd;
        oScrollPosData.iVScrollPos = piVScrollPos;
        oScrollPosData.bVScrolledToEnd = pbVScrolledToEnd;
        oScrollPosData.bIsHeaderData = bIsHeaderData;
      };


      this.compareScrollPosData = function(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData) {
        if (oScrollPosData) {
          if (oScrollPosData.iHScrollPos === piHScrollPos && oScrollPosData.iVScrollPos === piVScrollPos &&
              oScrollPosData.bHScrolledToEnd === pbHScrolledToEnd && oScrollPosData.bVScrolledToEnd === pbVScrolledToEnd &&
              oScrollPosData.bIsHeaderData === bIsHeaderData) {

            return true;
          }
        }
        return false;
      };

      this.sendScrollPosUpdate = function(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData) {
        pbHScrolledToEnd = pbHScrolledToEnd || false;
        pbVScrolledToEnd = pbVScrolledToEnd || false;
        bIsHeaderData = bIsHeaderData || false;

        var sCommand = oCrosstab.getScrollNotifyCommand();

        if (sCommand && !this.compareScrollPosData(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData)) {
          sCommand = sCommand.replace("__CLIENT_VPOS__", piVScrollPos);
          sCommand = sCommand.replace("__CLIENT_VPOS_END__", pbVScrolledToEnd ? "X" : " ");
          // header data currently only for horizontal scrolling possible
          sCommand = sCommand.replace("__CLIENT_HPOS__", (bIsHeaderData ? "H" + piHScrollPos : piHScrollPos));
          sCommand = sCommand.replace("__CLIENT_HPOS_END__", pbHScrolledToEnd ? "X" : " ");

          this.saveScrollPosData(piHScrollPos, pbHScrolledToEnd, piVScrollPos, pbVScrolledToEnd, bIsHeaderData);

          that.executeCommandAction(sCommand);
        }
      };

      this.executeCommandAction = function(sCommand, bIsAutoHeaderWidthRequest, bIsPageRequest) {
        if (oCrosstab.getPropertyBag().isBookmarkProcessing() && !bIsPageRequest) {
          return;
        }

        if (bIsAutoHeaderWidthRequest === true) {
          if (oCrosstab.isQueueHeaderWidthRequest() === true) {
            // queue it and make sure always the latest is there
            sQueuedHeaderWidthCommand = sCommand;
            return;
          }
        }

        var fAction;
        if (sQueuedHeaderWidthCommand && sQueuedHeaderWidthCommand.length > 0) {
          // make sure that this gets sent first!
          fAction = new Function(sQueuedHeaderWidthCommand);
          fAction();
          // starting from now normal handling of header width stuff
          oCrosstab.setQueueHeaderWidthRequest(false);
          sQueuedHeaderWidthCommand = null;
        }
        fAction = new Function(sCommand);
        fAction();
      };

      this.translateCellCoordinatesForBackend = function (oCell, sDimName) {
        var oHeaderInfo = oCrosstab.getHeaderInfo();
        var oArea = oCell.getArea();
        var oCoord = {
          "row": oCell.getRow(),
          "col": oCell.getCol(),
          "axisName": oArea.getAxisName()
        };
        var iRowOffset = 0;

        if (oCrosstab.getNewLinesPos() === "TOP") {
          iRowOffset = oCrosstab.getNewLinesCnt();
        }

        if (oArea.isRowHeaderArea()) {
          if (!sDimName || sDimName && sDimName.length === 0) {
            sDimName = oHeaderInfo.getDimensionNameByCol(oCell.getCol());
          }
          if(sDimName){
            oCoord.col = oHeaderInfo.getAbsoluteColIndexForDimension(sDimName);
          }
          oCoord.row = oCoord.row - iRowOffset;
        } else if (oArea.isColHeaderArea()) {
          if (!sDimName || sDimName && sDimName.length === 0) {
            sDimName = oHeaderInfo.getDimensionNameByRow(oCell.getRow() - iRowOffset);
          }
          if(sDimName){
            oCoord.row = oHeaderInfo.getAbsoluteRowIndexForDimension(sDimName);
          }
        }
        return oCoord;
      };

      this.getCellIdFromContenDivId = function (sId) {
        var i = sId.indexOf("_contentDiv");
        if (i > -1) {
          sId = sId.slice(0, i);
        } else {
          i = sId.indexOf("_textContentDiv");
          if (i > -1) {
            sId = sId.slice(0, i);
          }
        }
        return sId;
      };

      this.isMsIE = function() {
        var bResult = jQuery.browser.msie || false;
        var oMatch = window.navigator.userAgent.match(/Trident\/7\./);

        bResult = bResult || (oMatch ? true : false);
        return bResult;
      };

      this.isMozilla = function() {
        // WARNING: IE11 reports itself as mozilla via jQuery, hence the additional Trident check!!
        var bResult = jQuery.browser.mozilla || false;
        var oMatch = window.navigator.userAgent.match(/Trident\/7\./);

        bResult = bResult && (oMatch ? false : true);
        return bResult;
      };

      this.translateScrollLeft = function(oDomElement, iScrollLeft) {
        var iActualScrollPos = iScrollLeft;

        if (oCrosstab.getPropertyBag().isRtl()) {
          if (jQuery.browser.webkit) {
            iActualScrollPos = oDomElement.scrollWidth - oDomElement.clientWidth - iScrollLeft;
          } else if (this.isMozilla()) {
            iActualScrollPos = -iScrollLeft;
          }
        }

        return iActualScrollPos;
      };

      this.getRtlAwareBoundingClientRect = function(oDomElement) {
        var oRect = oDomElement.getBoundingClientRect();

        oRect.begin = oRect.left;
        oRect.end = oRect.right;

        if (oCrosstab.getPropertyBag().isRtl()) {
          oRect.begin = jQuery(window).width() - oRect.right;
          oRect.end = jQuery(window).width() - oRect.left;
        }

        return oRect;
      };
    };

    Utils.isCozyMode = function() {
      var bIsCozyMode = false;

      if (Utils.isDispatcherAvailable() === true) {
        bIsCozyMode = sap.zen.Dispatcher.instance.isMainMode() && !sap.zen.Dispatcher.instance.isCompactMode();
      }
      return bIsCozyMode;
    };

    Utils.isMainMode = function() {
      return true;
    };

    Utils.unEscapeDisplayString = function (sHtmlString) {
      var sUnEscapedString = sHtmlString.replace(/<br\/>/g, "\r\n");
      sUnEscapedString = sUnEscapedString.replace(/&nbsp;/g, "&#x20;");
      sUnEscapedString = jQuery("<div></div>").html(sUnEscapedString).text();
      return sUnEscapedString;
    };

    Utils.prepareStringForRendering = function (sText) {
      var sPrePreparedString = sText.replace(/(\r\n)|(\n\r)|\r|\n/g, "<br/>");
      var sPreparedString = sPrePreparedString.replace(/(&#xd;&#xa;)|(&#xa;&#xd;)|&#xd;|&#xa;/g, "<br/>");
      var iNumberOfLineBreaks = Utils.getNumberOfLineBreaks(sPreparedString);

      sPreparedString = sPreparedString.replace(/&#x20;/g, "&nbsp;");
      return {"text" : sPreparedString, "iNumberOfLineBreaks" : iNumberOfLineBreaks};
    };

    Utils.cancelEvent = function (e) {
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        Utils.stopEventPropagation(e);
      }
    };

    Utils.stopEventPropagation = function (e) {
      if (e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        if (e.cancelBubble) {
          e.cancelBubble = true;
        }
      }
    };

    Utils.hasEntries = function (oAssocArray) {
      var bHasEntries = false;
      if (oAssocArray) {
        for ( var key in oAssocArray) {
          if (
            Object.prototype.hasOwnProperty.call(oAssocArray,key)
          ) {
            bHasEntries = true;
            break;
          }
        }
      }
      return bHasEntries;
    };

    Utils.padWithZeroes = function (iNumber, iLength) {
      var s = iNumber.toString();
      if (s.length < iLength) {
        s = ("0000000000" + s).slice(-iLength);
      }
      return s;
    };

    Utils.selectTextInElement = function (oDomTextContainer) {
      var oRange;
      var oSelection;
      if (oDomTextContainer.innerHTML) {
        if (document.createRange && window.getSelection) {
          oRange = document.createRange();
          oSelection = window.getSelection();
          try {
            oSelection.removeAllRanges();
          } catch (e) {
            // this might happen in IE -> browser bug. When it happens,
            // text will not be selected
          }
          try {
            oRange.selectNodeContents(oDomTextContainer);
            oSelection.addRange(oRange);
          } catch (e) {
            oRange.selectNode(oDomTextContainer);
            oSelection.addRange(oRange);
          }
        } else if (document.body.createTextRange) {
          // IE8
          oRange = document.body.createTextRange();
          oRange.moveToElementText(oDomTextContainer);
          oRange.select();
        }
      }
    };

    Utils.getWidthFromStyle = function (oJqElement) {
      var i = 0;
      var sStyle = "";
      var aStyleDef = null;
      var sWidth = null;
      var sStyles = oJqElement.attr("style");
      if (sStyles) {
        var aStyles = sStyles.split(";");
        if (aStyles) {
          for (i = 0; i < aStyles.length; i++) {
            sStyle = aStyles[i];
            if (sStyle) {
              aStyleDef = sStyle.split(":");
              if (aStyleDef[0] === "width") {
                sWidth = aStyleDef[1];
                break;
              }
            }
          }
        }
      }
      if (sWidth) {
        sWidth = jQuery.trim(sWidth);
      }
      return sWidth;
    };

    Utils.sign = function(x) {
      return x > 0 ? 1 : x < 0 ? -1 : 0;
    };

    Utils.getCssIntProperty = function(oJqElement, sCss) {
      var iCssProperty = 0;
      if (oJqElement && oJqElement.length > 0) {
        iCssProperty = parseInt(oJqElement.css(sCss), 10);
        if (isNaN(iCssProperty)) {
          iCssProperty = 0;
        }
      }
      return iCssProperty;
    };

    Utils.getWidthOfMarginBorderPadding = function(oJqElement) {
      var iMarginWidth = Utils.getCssIntProperty(oJqElement, "margin-left") + Utils.getCssIntProperty(oJqElement, "margin-right");
      var iBorderWidth = Utils.getCssIntProperty(oJqElement, "border-left") + Utils.getCssIntProperty(oJqElement, "border-right");
      var iPaddingWidth = Utils.getCssIntProperty(oJqElement, "padding-left") + Utils.getCssIntProperty(oJqElement, "padding-right");
      var iTotalWidth = iMarginWidth + iBorderWidth + iPaddingWidth;
      return iTotalWidth;
    };

    Utils.getNumberOfLineBreaks = function(sEscapedString) {
      var counter = 0;
      if (sEscapedString && sEscapedString.length > 0) {
        var regEx = /<br\/>/g;
        while (regEx.exec(sEscapedString) != null) {
          counter++;
        }
      }
      return counter;
    };
    Utils.getSizeOf = function(oObject) {
      var iSize = 0;
      for (var key in oObject) {
        if (
          Object.prototype.hasOwnProperty.call( oObject,key)
        ) {
          iSize++;
        }
      }
      return iSize;
    };
    Utils.isDispatcherAvailable = function() {
      var bDispatcherAvailable = false;
      if (typeof sap !== "undefined" && sap) {
        if (typeof sap.zen !== "undefined" && sap.zen) {
          if (typeof sap.zen.Dispatcher !== "undefined" && sap.zen.Dispatcher) {
            if (typeof sap.zen.Dispatcher.instance !== "undefined" && sap.zen.Dispatcher.instance) {
              bDispatcherAvailable = true;
            }
          }
        }
      }
      return bDispatcherAvailable;
    };

    Utils.swapText = function(sText, sSeparator) {
      var aTextParts;
      var i;
      var sNewText = "";
      if (sText.indexOf(sSeparator) > -1) {
        aTextParts = sText.split(sSeparator);
        for (i = aTextParts.length - 1; i >= 0; i--) {
          sNewText = sNewText + aTextParts[i];
          if (i >= 1) {
            sNewText = sNewText + sSeparator;
          }
        }
      } else {
        sNewText = sText;
      }
      return sNewText;
    };
    Utils.swapPivotKeyText = function(sText) {
      var sNewText;
      sNewText = Utils.swapText(sText, "&nbsp;&#x7c;&nbsp;");
      return sNewText;
    };
    return Utils;
  }, true
);
