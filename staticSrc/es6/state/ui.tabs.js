'use strict';

var objectHelpers = require('../reducers/object_helpers');

/*
 * This module is responsibe for the state used by tabs: WL_STATE.ui.tabs
 * 
 * Example tab group state object: {
		tab_group: [
			{
				tab_name: "Tab 1",
				active: true
			},
			{
				tab_name: "Tab 2",
				active: false
			}
		]
	}
*/


module.exports = {

	createTabGroup: function(groupName){
		var checkError = false;

		//first check the name we've been passed is all good
		if (typeof(groupName) != 'string' || groupName == null || groupName == undefined) {
			console.error("There's someting weird about the tab group you're trying to add that tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		//now lets check that the group doesn't already exist
		if (typeof(WL_STATE.ui.tabs[groupName]) == 'array') {
			console.warn("Tab group already exists, not adding");
			checkError = true;
		}

		if (!checkError) {
			//yeay! New tab group!
			WL_STATE.ui.tabs[groupName] = [];
		}
	},

	addTabToTabGroup: function(groupName, tabName){
		var checkError = false;

		//first check the tab name is good
		if (typeof(tabName) != 'string' || tabName == undefined || tabName == null) {
			console.error("There's something weird about the name of the tab you're trying to create: ", tabName);
			checkError = true;
		}

		//and check the group name
		if (typeof(groupName) != 'string' || groupName == null || groupName == undefined) {
			console.error("There's someting weird about the tab group you're trying to add that tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		//and make sure the group exists and is valid
		if (typeof(WL_STATE.ui.tabs[groupName]) != 'array') {
			console.error("There's something weird about the tab group you're trying to add your tab to: ", WL_STATE.ui.tabs[groupName]);
			checkError = true;
		}

		if (!checkError) {
			//yeay! new tab :)
			var newTabObj = { tab_name: tabName	};

			//if it's the first
			if (WL_STATE.ui.tabs[groupName].length == 0){
				//turn it on
				newTabObj.active = true;
			} else {
				newTabObj.active = false;
			}
			
			WL_STATE.ui.tabs[groupName].push(newTabObj);
		}
	},

	activateTab: function(groupName, tabToActivate){
		//going to assume the creation process above caught any tab bugs so we can run this afap! giggity
		var newTabGroup = objectHelpers.cloneThisObject(WL_STATE.ui.tabs[groupName]);

		for (var t = 0; t < newTabGroup.length; t++) {

			if (newTabGroup[t].tab_name == tabToActivate) {
				newTabGroup[t].active = true;	
			} else {
				newTabGroup[t].active = false;
			}
	
		}

		WL_STATE.ui.tabs[groupName] = newTabGroup;
	}
};