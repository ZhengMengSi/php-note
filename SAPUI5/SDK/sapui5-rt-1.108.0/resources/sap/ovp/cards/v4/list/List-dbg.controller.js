sap.ui.define([
    "sap/ovp/cards/v4/generic/Card.controller",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/json/JSONModel",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/CommonUtils",
    "sap/ovp/cards/v4/V4AnnotationHelper",
    "sap/ovp/app/OVPUtils",
    "sap/ovp/cards/ovpLogger",
    "sap/ovp/cards/jUtils",
    "sap/ovp/cards/Filterhelper",
    "sap/ovp/filter/FilterUtils",
    "sap/ui/core/Core"
], function (
    CardController,
    jQuery,
    JSONModel,
    OVPCardAsAPIUtils,
    CommonUtils,
    AnnotationHelper,
    OVPUtils,
    OVPLogger,
    jUtils,
    Filterhelper,
    FilterUtils,
    Core
) {
    "use strict";

    var oLogger = new OVPLogger("OVP.v4.list.List");

    return CardController.extend("sap.ovp.cards.v4.list.List", {
        counter: 0,
        arrayLength: 0,
        minMaxModel: {},
        onInit: function () {
            //The base controller lifecycle methods are not called by default, so they have to be called
            //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
            CardController.prototype.onInit.apply(this, arguments);
            this.counter = 0;
            this.minMaxModel = new JSONModel();
            this.minMaxModel.setData({
                minValue: 0,
                maxValue: 0
            });
            this.getView().setModel(this.minMaxModel, "minMaxModel");
            var that = this;
            this.eventhandler = function (channelid, event, aFilters) {
                FilterUtils.applyFiltersToV4Card(aFilters, that);
            };
            this.GloabalEventBus = Core.getEventBus();
            if (
                this.oMainComponent &&
                (this.oMainComponent.isMacroFilterBar || this.oMainComponent.oGlobalFilter)
            ) {
                this.GloabalEventBus.subscribe("OVPGlobalfilter", "OVPGlobalFilterSeacrhfired", that.eventhandler);
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
            var oPopover, oSource, oBindingContext;
            oSource = oEvent.getSource();
            oPopover = oSource.getParent().getAggregation("items")[0];
            oBindingContext = oSource.getBindingContext();
            if (!oBindingContext) {
                return;
            }
            oPopover.bindElement(oBindingContext.getPath());
            oPopover.openBy(oSource);
        },

        onAfterRendering: function () {
            CardController.prototype.onAfterRendering.apply(this, arguments);
            var isImageCard = this.getCardPropertiesModel().getProperty("/imageSupported");
            var densityStyle = this.getCardPropertiesModel().getProperty("/densityStyle");
            if (isImageCard) {
                var imageList = this.byId("ovpList");
                /**
                 * This function does some CSS changes after the card is rendered
                 */
                imageList.attachUpdateFinished(
                    function () {
                        this._addImageCss(densityStyle);
                    }.bind(this)
                );
            }
            if (
                !OVPCardAsAPIUtils.checkIfAPIIsUsed(this) &&
                this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable"
            ) {
                var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
                var iHeaderHeight = Math.max(this.getHeaderHeight(), oCard.dashboardLayout.headerHeight);
                var sCardId = this.oDashboardLayoutUtil.getCardDomId(this.cardId);
                var element = document.getElementById(sCardId);
                if (!oCard.dashboardLayout.autoSpan) {
                    element.getElementsByClassName("sapOvpWrapper")[0].style.height =
                        oCard.dashboardLayout.rowSpan * this.oDashboardLayoutUtil.ROW_HEIGHT_PX -
                        (iHeaderHeight + 2 * this.oDashboardLayoutUtil.CARD_BORDER_PX) +
                        "px";
                        oCard.dashboardLayout.autoSpan = true;
                }
                if (oCard.dashboardLayout.showOnlyHeader) {
                    element.classList.add("sapOvpMinHeightContainer");
                }
            }
            if (!OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var cardmanifestModel = this.getOwnerComponent().getModel("ui").getData().cards;
                var relfilters = [];
                var sEntityType = this.getEntitySet() && this.getEntitySet()["$Type"];
                var oContext = sEntityType && this.getMetaModel().getContext("/" + sEntityType);
                if (oContext) {
                    var entityType = oContext.getObject();
                    this.selectionVaraintFilter = Filterhelper.getSelectionVariantFilters(
                        cardmanifestModel,
                        oCardPropertiesModel,
                        this.getEntityType()
                    );
                }
                var oMainComponent = this.oCardComponentData.mainComponent;
                if (oMainComponent.getGlobalFilter()) {
                    relfilters = Filterhelper._getEntityRelevantFilters(
                        entityType,
                        oMainComponent.oGlobalFilter.getFilters()
                    );
                }
                if (oMainComponent.getMacroFilterBar()) {
                    var aFilters = oMainComponent.aFilters;
                    relfilters = Filterhelper._getEntityRelevantFilters(entityType, aFilters);
                }
                relfilters = Filterhelper.mergeFilters(relfilters, this.selectionVaraintFilter);
                if (this.getCardItemsBinding()) {
                    this.getCardItemsBinding().filter(relfilters);
                }
                if (this.getKPIBinding()) {
                    this.getKPIBinding().filter(relfilters);
                }
            }
        },
        _addImageCss: function (densityStyle) {
            var iL = this.byId("ovpList");
            var items = iL.getItems();
            var isIcon = false;
            var cls = iL.getDomRef().getAttribute("class");

            if (densityStyle === "cozy") {
                cls = cls + " sapOvpListImageCozy";
            } else {
                cls = cls + " sapOvpListImageCompact";
            }

            iL.getDomRef().setAttribute("class", cls);

            /**
             * Looping through all elements in the displayed list to find out
             * if it is icon or image type card,
             * the size of the icon/image varies accordingly
             */
            items.forEach(function (item) {
                if (item.getIcon().indexOf("icon") != -1) {
                    isIcon = true;
                }
            });

            items.forEach(function (item) {
                var listItemRef = item.getDomRef();
                var imgIcon;
                if (listItemRef && listItemRef.children[0] && listItemRef.children[0].children[0]) {
                    imgIcon = listItemRef.children[0].children[0];
                }
                var itemDescription = item.getDescription();
                var icon = item.getIcon();
                var tIcon = isIcon;
                var title = item.getTitle();

                var initials = title
                    .split(" ")
                    .map(function (str) {
                        return str ? str[0].toUpperCase() : "";
                    })
                    .join("")
                    .substring(0, 2);

                /**
                 * Condition for card in which images and icons are present
                 * we are checking if any list item is an image to set
                 * appropriate CSS
                 */
                if (icon != "" && icon.indexOf("icon") == -1) {
                    isIcon = false;
                }

                if (isIcon && listItemRef.children[0]) {
                    //CHECK-TO jUtils.addClassToAllElements(listItemRef.children[0], "sapOvpIconListItem");
                    jQuery(listItemRef.children[0]).addClass("sapOvpIconListItem");
                } else if (listItemRef.children[0]) {
                    //CHECK-TO jUtils.addClassToAllElements(listItemRef.children[0], "sapOvpImageListItem");
                    jQuery(listItemRef.children[0]).addClass("sapOvpImageListItem");
                }

                if (imgIcon && densityStyle === "cozy" && isIcon === false) {
                    if (imgIcon) {
                        var cls = imgIcon.getAttribute("class");
                        cls = cls + " sapOvpImageCozy";
                        imgIcon.setAttribute("class", cls);
                    }
                }

                var itemStyle = "";
                if (isIcon === true && itemDescription === "") {
                    itemStyle =
                        densityStyle === "compact"
                            ? "sapOvpListWithIconNoDescCompact"
                            : "sapOvpListWithIconNoDescCozy";
                } else if (isIcon === false && itemDescription === "") {
                    itemStyle =
                        densityStyle === "compact"
                            ? "sapOvpListWithImageNoDescCompact"
                            : "sapOvpListWithImageNoDescCozy";
                } else {
                    itemStyle =
                        densityStyle === "compact"
                            ? "sapOvpListWithImageIconCompact"
                            : "sapOvpListWithImageIconCozy";
                }

                item.addStyleClass(itemStyle);

                if (
                    listItemRef &&
                    listItemRef.children[0] &&
                    icon === "" &&
                    listItemRef.children[0].id !== "ovpIconImagePlaceHolder"
                ) {
                    var placeHolder = document.createElement("div");
                    placeHolder.innerText = initials;
                    placeHolder.setAttribute("id", "ovpIconImagePlaceHolder");
                    placeHolder.className = isIcon === true ? "sapOvpIconPlaceHolder" : "sapOvpImagePlaceHolder";
                    if (isIcon === false && densityStyle === "cozy") {
                        placeHolder.className = placeHolder.className + " sapOvpImageCozy";
                    }
                    listItemRef.insertBefore(placeHolder, listItemRef.children[0]);
                }
                isIcon = tIcon;
            });
        },
        onListItemPress: function (oEvent) {
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

        /**
         * Gets the card items binding object for the count footer
         */
        getCardItemsBinding: function () {
            var list = this.getView().byId("ovpList");
            return list && list.getBinding("items");
        },

        /**
         * This function loops through context values and gets
         * the Max & Min Value for the card in 'this'
         * context(ie different for different cards)
         * Requirement: In case of global filters applied context changes and Max and Min should also change
         * Drawback : Max and Min are calculated for each list Items again considering all items in context.
         * */
        _getMinMaxObjectFromContext: function (noOfItems) {
            this.counter++;
            var oEntitySet = this.getEntitySet(),
                sAnnotationPath = this.getCardPropertiesModel().getProperty("/annotationPath");
            sAnnotationPath = "@" + sAnnotationPath;

            var aRecords =
                this.getMetaModel().getData(sAnnotationPath).$Annotations[oEntitySet.$Type][sAnnotationPath];
            var AnnotationPath = "/" + oEntitySet.$Type + "/@" + sAnnotationPath;
            var context = this.getMetaModel().createBindingContext(AnnotationPath),
                minMaxObject = {
                    minValue: 0,
                    maxValue: 0
                };

            //Case 1:  In case of percentage
            if (AnnotationHelper.isFirstDataPointPercentageUnit(context, aRecords)) {
                minMaxObject.minValue = 0;
                minMaxObject.maxValue = 100;
                return minMaxObject;
            }

            //Case 2: Otherwise
            var dataPointValue = AnnotationHelper.getFirstDataPointValue(context, aRecords),
                barList = this.getView().byId("ovpList"),
                listItems = barList.getBinding("items"),
                itemsContextsArray = listItems.getCurrentContexts();
            for (var i = 0; noOfItems ? i < noOfItems : i < itemsContextsArray.length; i++) {
                /*To get original value by going through relative paths in case of slash*/
                var originalValue = itemsContextsArray[i].getValue(dataPointValue);
                var currentItemValue = parseFloat(originalValue, 10);
                if (currentItemValue < minMaxObject.minValue) {
                    minMaxObject.minValue = currentItemValue;
                } else if (currentItemValue > minMaxObject.maxValue) {
                    minMaxObject.maxValue = currentItemValue;
                }
            }
            return minMaxObject;
        },

        /**
         *  this function
         *  1.updates both min and max values in 'this' context
         *  and
         *  2.then updates the model attached to that particular card
         *  3.then refreshes the model to affect the changes
         *  */
        _updateMinMaxModel: function (noOfItems) {
            var minMaxObject = this._getMinMaxObjectFromContext(noOfItems);
            this.minMaxModel.setData({
                minValue: minMaxObject.minValue,
                maxValue: minMaxObject.maxValue
            });
            this.minMaxModel.refresh();
            return minMaxObject;
        },

        /**
         * this function call update method and return the value.
         * */
        returnBarChartValue: function (value) {
            this._updateMinMaxModel();
            var iValue = parseFloat(value, 10);
            return iValue;
        },

        /**
         * Gets the card items binding info
         */
        getCardItemBindingInfo: function () {
            var oList = this.getView().byId("ovpList");
            return oList.getBindingInfo("items");
        },
        /**
         * Method called upon card resize
         *
         * @method resizeCard
         * @param {Object} newCardLayout- resize data of the card
         * @return {Object} cardSizeProperties - card properties
         */
        resizeCard: function (newCardLayout, cardSizeProperties) {
            var iNoOfItems, iAvailableSpace, iHeightWithoutContainer;
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
                    iAvailableSpace = newCardLayout.rowSpan * newCardLayout.iRowHeightPx - iHeightWithoutContainer;
                    iNoOfItems = Math.abs(Math.floor(iAvailableSpace / cardSizeProperties.itemHeight));
                    $card.style.height = newCardLayout.rowSpan * newCardLayout.iRowHeightPx + "px";
                }
                oOvpContent.style.height =
                    newCardLayout.rowSpan * newCardLayout.iRowHeightPx -
                    (iHeaderHeight + 2 * newCardLayout.iCardBorderPx) +
                    "px";
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

        onExit: function () {
            CardController.prototype.onExit.apply(this, arguments);
        }
    });
});
