/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/test/RecordReplay"
], function (BaseObject, RecordReplay) {
	"use strict";

	// memoize recently requested selectors
	var aSelectorCache = [];
	var SELECTOR_CACHE_LIMIT = 100;

	/**
	 * @class generates a control selector
	 */
	var ControlSelectorGenerator = BaseObject.extend("sap.ui.testrecorder.controlSelectors.ControlSelectorGenerator", {});

	/**
	 * generates a UIVeri5 selector for a control
	 *
	 * @param {object} mData data of the control for which to find a selector. Must contain either domElementId or controlId.
	 * @param {string} mData.domElementId ID of a DOM element that is part of the control DOM tree
	 * @param {string} mData.controlId ID of the control
	 * @param {object} oOptions.settings preferences for the selector
	 * @param {boolean} mData.settings.preferViewId true if selectors with view ID should have higher priority than selectors with global ID. Default value is false.
	 * @returns {Promise<string>} Promise for a control selector or error
	 */
	ControlSelectorGenerator.prototype.getSelector = function (mData) {
		var oDomElement = _getDomElement(mData);
		var mCacheKey = {
			domElementId: oDomElement.id
		};
		var mCachedSelector = this._findCached(mCacheKey);
		if (mCachedSelector) {
			return Promise.resolve(mCachedSelector);
		}
		return RecordReplay.findControlSelectorByDOMElement({
			domElement: oDomElement,
			settings: mData.settings
		}).then(function (mSelector) {
			this._cache(mCacheKey, mSelector);
			return mSelector;
		}.bind(this));
	};

	ControlSelectorGenerator.prototype._findCached = function (mData) {
		var mSelector;
		aSelectorCache.forEach(function (mPair) {
			if (mPair.key === mData.domElementId) {
				mSelector = mPair.value;
			}
		});
		return mSelector;
	};

	ControlSelectorGenerator.prototype._cache = function (mData, mSelector) {
		if (aSelectorCache.length === SELECTOR_CACHE_LIMIT) {
			// remove the oldest selector
			aSelectorCache.shift();
		}
		aSelectorCache.push({
			key: mData.domElementId,
			value: mSelector
		});
	};

	ControlSelectorGenerator.prototype.emptyCache = function () {
		aSelectorCache = [];
	};

	function _getDomElement(mData) {
		if (mData.domElement && typeof mData.domElement === "string") {
			// mData would contain DOM element ID: when control is selected by clicking on the page
			return document.getElementById(mData.domElement);
		} else if (mData.controlId) {
			// mDat would contain control ID: when control is selected from the recorder control tree
			return sap.ui.getCore().byId(mData.controlId).getFocusDomRef();
		}
	}

	return new ControlSelectorGenerator();
});
