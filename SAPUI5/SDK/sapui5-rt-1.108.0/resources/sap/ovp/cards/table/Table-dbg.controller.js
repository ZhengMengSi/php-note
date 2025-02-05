sap.ui.define([
    "sap/ovp/cards/generic/Card.controller",
    "sap/ui/thirdparty/jquery",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/app/OVPUtils",
    "sap/ovp/cards/ovpLogger",
    "sap/ovp/filter/FilterUtils",
    "sap/ui/core/Core",
    "sap/ovp/cards/Integration/IntegrationCard"
], function (
    CardController,
    jQuery,
    OVPCardAsAPIUtils,
    CommonUtils,
    OVPUtils,
    OVPLogger,
    FilterUtils,
    Core,
    IntegrationCard
) {
    "use strict";

    var oLogger = new OVPLogger("OVP.table.Table");
    return CardController.extend("sap.ovp.cards.table.Table", {
        onInit: function () {
            //The base controller lifecycle methods are not called by default, so they have to be called
            //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
            CardController.prototype.onInit.apply(this, arguments);
            var that = this;
            this.eventhandler = function (sChannelId, sEventName, aFilters) {
                FilterUtils.applyFiltersToV2Card(aFilters, that);
            };
            this.GloabalEventBus = Core.getEventBus();
            if (this.oMainComponent && this.oMainComponent.isMacroFilterBar) {
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", that.eventhandler);
            }
        },

        onColumnListItemPress: function (oEvent) {
            var sNavMode = OVPUtils.bCRTLPressed ? OVPUtils.constants.explace : OVPUtils.constants.inplace;
            OVPUtils.bCRTLPressed = false;
            /*
             On Content click of OVP Cards used as an API in other Applications
             */
            if (OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                if (this.checkAPINavigation()) {
                    //The function is only called when there is a valid semantic object and action is available
                    CommonUtils.onContentClicked(oEvent);
                }
            } else {
                var aNavigationFields = this.getEntityNavigationEntries(
                    oEvent.getSource().getBindingContext(),
                    this.getCardPropertiesModel().getProperty("/annotationPath")
                );
                this.doNavigation(oEvent.getSource().getBindingContext(), aNavigationFields[0], sNavMode);
            }
        },

        //function to open quick view popover to show contact information
        /*
         <Vbox>                             --- parent
         <ContactDetailFragmentPopover>  --- [0]th child
         <Link>                          --- [1]st child
         <Vbox>
         here on click of link we are taking binding context path and binding it to contact detail fragment
         */
        onContactDetailsLinkPress: function (oEvent) {
            if (this.oPopover) {
                this.oPopover.setVisible(false);
            }
            var oSource, oBindingContext;
            oSource = oEvent.getSource();
            this.oPopover = oSource.getParent().getAggregation("items")[0];
            oBindingContext = oSource.getBindingContext();
            if (!oBindingContext) {
                return;
            }
            this.oPopover.bindElement(oBindingContext.getPath());
            this.oPopover.setVisible(true);
            this.oPopover.openBy(oSource);
        },

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function () {
            var table = this.getView().byId("ovpTable");
            return table.getBinding("items");
        },

        onAfterRendering: function () {
            CardController.prototype.onAfterRendering.apply(this, arguments);
            var oCompData = this.getOwnerComponent().getComponentData();
            var oCardPropertiesModel = this.getCardPropertiesModel();
            if (!OVPCardAsAPIUtils.checkIfAPIIsUsed(this) && oCardPropertiesModel.getProperty("/layoutDetail") === "resizable") {
                var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(oCompData.cardId);
                var iHeaderHeight = this.getHeaderHeight();
                var sCardId = this.oDashboardLayoutUtil.getCardDomId(oCompData.cardId);
                var element = document.getElementById(sCardId);
                if (!oCard.dashboardLayout.autoSpan) {
                    element.getElementsByClassName("sapOvpWrapper")[0].style.height =
                        oCard.dashboardLayout.rowSpan * this.oDashboardLayoutUtil.ROW_HEIGHT_PX +
                        1 -
                        (iHeaderHeight + 2 * this.oDashboardLayoutUtil.CARD_BORDER_PX) +
                        "px";
                }
                if (oCard.dashboardLayout.showOnlyHeader) {
                    element.classList.add("sapOvpMinHeightContainer");
                }
                //For resizable card layout show the no of columns based upon colspan
                this.addColumnInTable(jQuery(element), {
                    colSpan: oCard.dashboardLayout.colSpan
                });
            } else {
                var oTable = this.getView().byId("ovpTable");
                var aAggregation = oTable.getAggregation("columns");
                //For fixed card layout show only 3 columns
                for (var iCount = 0; iCount < 3; iCount++) {
                    if (aAggregation[iCount]) {
                        aAggregation[iCount].setStyleClass("sapTableColumnShow").setVisible(true);
                    }
                }
            }
            if (this.getView() && this.getView().byId("sapOvpCardInsights")) {
                this.getView().byId("sapOvpCardInsights").setEnabled(true);
            }
        },

        /**
         * Gets the card items binding info
         */
        getCardItemBindingInfo: function () {
            var oList = this.getView().byId("ovpTable");
            return oList.getBindingInfo("items");
        },

        /**
         * Handles no of columns to be shown in table when view-switch happens
         *
         * @method addColumnInTable
         * @param {String} sCardId - Card Id
         * @param {Object} oCardResizeData- card resize properties
         */
        addColumnInTable: function ($card, oCardResizeData) {
            if (oCardResizeData.colSpan >= 1) {
                if (jQuery($card).find("tr").length != 0) {
                    var table = Core.byId(jQuery($card).find(".sapMList").attr("id"));
                    var aggregation = table.getAggregation("columns");
                    var iColSpan = oCardResizeData.colSpan;
                    // No of columns to be shown calculated based upon colspan
                    var iIndicator = iColSpan + 1;
                    for (var i = 0; i < 6; i++) {
                        if (aggregation[i]) {
                            if (i <= iIndicator) {
                                //Show any particular column
                                aggregation[i].setStyleClass("sapTableColumnShow").setVisible(true);
                            } else {
                                //hide any particular column
                                aggregation[i].setStyleClass("sapTableColumnHide").setVisible(false);
                            }
                        }
                    }
                }
            }
        },

        /**
         * Method called upon card resize
         *
         * @method resizeCard
         * @param {Object} newCardLayout- resize data of the card
         * @return {Object} cardSizeProperties - card properties
         */
        resizeCard: function (newCardLayout, cardSizeProperties) {
            var iNoOfItems, iAvailableSpace, iHeightWithoutContainer, iAvailableSpace;
            try {
                var $card = document.getElementById(this.oDashboardLayoutUtil.getCardDomId(this.cardId)),
                    oBindingInfo = this.getCardItemBindingInfo(),
                    iHeaderHeight = this.getHeaderHeight(),
                    oOvpContent = this.getView().byId("ovpCardContentContainer").getDomRef();
                if (newCardLayout.showOnlyHeader) {
                    oOvpContent.classList.add("sapOvpContentHidden");
                    iNoOfItems = 0;
                } else {
                    oOvpContent.classList.remove("sapOvpContentHidden");
                    iHeightWithoutContainer = iHeaderHeight + cardSizeProperties.dropDownHeight;
                    iAvailableSpace =
                        newCardLayout.rowSpan * newCardLayout.iRowHeightPx - iHeightWithoutContainer - cardSizeProperties.itemHeight;
                    iNoOfItems = Math.abs(Math.floor(iAvailableSpace / cardSizeProperties.itemHeight));
                    $card.style.height = newCardLayout.rowSpan * newCardLayout.iRowHeightPx + "px";
                }
                oOvpContent.style.height =
                    newCardLayout.rowSpan * newCardLayout.iRowHeightPx - (iHeaderHeight + 2 * newCardLayout.iCardBorderPx) + "px";
                this.addColumnInTable(this.getView().getDomRef(), newCardLayout);
                if (iNoOfItems !== oBindingInfo.length) {
                    oBindingInfo.length = iNoOfItems;
                    newCardLayout.noOfItems = oBindingInfo.length;
                    this.getCardItemsBinding().refresh();
                } else {
                    //for resizing using keystrokes - to handle the case where the counter shows no value because the top condition is not met to refresh the card items binding
                    this._handleCountHeader();
                }
            } catch (error) {
                oLogger.warning("OVP resize: " + this.cardId + " catch " + error.toString());
            }
        },
         /**
         *
         * @param {sap.ui.base.Event} oEvent - Event from add to my insight button press
         */
          onShowInsightCardPreview: function(oEvent) {
            var oPopover = oEvent.getSource() && oEvent.getSource().getParent();
            if (oPopover) {
                oPopover.close();
            }
            var oCardView = this.getView();
            var oCardController = oCardView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var that = this;

            IntegrationCard.showCard({
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Table",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                itemBindingInfo: that.getCardItemBindingInfo(),
                view: oCardView
            }).then(function(oCardManifestConfiguration) {
                that.saveGeneratedCardManifest(oCardManifestConfiguration); // Saving the manifest will be handled in card controller.
            });
        }
    });
});
