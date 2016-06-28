'use strict';

/* Everyting aout handling tab state!
 * The array is for rivets to loop through in the DOM
 * The named attributes are for ease - if we know the name, there's no need to loop.
 * the array object also holds any kind of data that might need to be attached to a tab
 * 
 * Example tab group state object: {
		<tab_group_name>: {
			tabs: [ 
				{name: <tab_name>, active: false, type: 'claim', data: {claimObj}}, 
				{name: <tab2_name>, active: false, type: 'something', data: {stuff}} 
			],
			tempTab: { name: <tab_name>, set: false },
			<tab_name>: {set: true, index:0},
			<tab2_name>: {set: false, index:1}
		]
	}
*/

var objectHelpers = require('../reducers/object_helpers');
var stringHelpers = require('../reducers/string_helpers');
var eventManager = require('../utils/event_manager');
var tabGroupReducer = require('../reducers/tab_helpers');

var createTabGroup = function(groupName){
	//first check the group doesn't already exist
	if (WL_STATE.tabs.hasOwnProperty(groupName)) {
		console.warn('A tab group with that name already exists: ', WL_STATE.tabs[groupName]);
		return;
	}

	//yeay! New group!
	var newGroup = tabGroupReducer.createTabGroup(groupName);
	WL_STATE.tabs[groupName] = newGroup;
}

var addTabToTabGroup = function(groupName, newTab){

	//check that tab doesn't already exist
	if (WL_STATE.tabs[groupName].hasOwnProperty(newTab.tabName)) {
		console.warn('A tab of that name already exists in this tab group: ', WL_STATE.tabs[groupName]);
		return;
	} 

	//yeay! New tab!
	
	//first add the tab to the tab group array
	WL_STATE.tabs[groupName].tabs.push({
		name: newTab.tabName, 
		active: false, 
		type: newTab.tabType
	});

	//now add the named tab state object for rivets
	WL_STATE.tabs[groupName][newTab.tabName] = {
		set: false,
		data: newTab.data,
		tabIndex: WL_STATE.tabs[groupName].tabs.length - 1
	};
}

var activateTab = function(groupName, tabToActivate){

	//get the new group state
	var newTabGroup = tabGroupReducer.activateTab(WL_STATE.tabs[groupName], tabToActivate);

	//add back to state so rivets can render
	WL_STATE.tabs[groupName] = newTabGroup;	

	//fire the event and pass the tab data!
	eventManager.fire('tab_opened', WL_STATE.tabs[groupName][tabToActivate]);
}

var removeTab = function(groupName, tabName){
	//remove from array
	var tabIndex = WL_STATE.tabs[groupName][tabName].index;
	WL_STATE.tabs[groupName].tabs.splice(tabIndex, 1);
	
	//and remove the names attribute
	delete WL_STATE.tabs[groupName][tabName];
}

var activateTempTab = function(groupName){
	//clone the tab group state
	var newTabGroup = objectHelpers.cloneThisObject(WL_STATE.tabs[groupName]);

	//set all the tabs to false.
	for (var t = 0; t < newTabGroup.tabs.length; t++) {
		//tab array item to false
		newTabGroup.tabs[t].active = false;
		//and it's named counterpart
		newTabGroup[newTabGroup.tabs[t].name] = false;
	}

	//set the tempTab to true
	newTabGroup.tempTab.active = true;	

	eventManager.fire('tab_opened', newTabGroup.tempTab);

	//and apply to state!
	WL_STATE.tabs[groupName] = newTabGroup;
}

//the 'public' interface
module.exports = {

	init: function(){
		WL_STATE.tabs = {}
	},

	createTabGroup: function(groupName){
		createTabGroup(groupName);
	},

	addTabToTabGroup: function(groupName, newTab){
		addTabToTabGroup(groupName, newTab);
	},

	activateTab: function(groupName, tabToActivate){
		activateTab(groupName, tabToActivate);
	},

	removeTab: function(groupName, tabName){
		console.group('removing "' + tabName + '" from "' + groupName);
		console.log('WL_STATE.tabs[groupName]: ', WL_STATE.tabs[groupName]);
		//first check if this is the tab they're currently on
		if (WL_STATE.tabs[groupName][tabName].set) {
			//yep, they are. We're going to have to move them to another tab
			console.log('current tab');
			var moveToIndex = -1;
			
			//first - are there any other tabs to move them to or is this the last one?
			if (WL_STATE.tabs[groupName].tabs.length == 1 ) {
				console.log('only tab');
				//meh, nothing we can do

			//second - are they on the very last tab?
			} else if (Number(WL_STATE.tabs[groupName][tabName].tabIndex) == (WL_STATE.tabs[groupName].tabs.length - 1) ) {
				console.log('last tab of many');
				//ugh, we'll move them back one
				var moveToIndex = WL_STATE.tabs[groupName][tabName].tabIndex - 1;
				var moveToName = WL_STATE.tabs[groupName].tabs[moveToIndex].name;
				activateTab(groupName, moveToName);
				
			//third - they must be any where from the first to the second from last
			} else {
				console.log('not the last', WL_STATE.tabs[groupName][tabName]);
				//so... we'll move them forward one
				var moveToIndex = WL_STATE.tabs[groupName][tabName].tabIndex + 1;
				var moveToName = WL_STATE.tabs[groupName].tabs[moveToIndex].name;
				activateTab(groupName, moveToName);
			}

			//now we've done what we can, remove it
			removeTab(groupName, tabName);
		}
		console.groupEnd();
	},

	addTempTabToGroup: function(groupName, newTab){
		//Recreates the sublime text tab behaviour(ish). One click adds temp tab, a second adds it permanently 
		//newTab = { tabName: <string>, tabType: <string>, data: <obj> }


		 //first check there isn't a main tab of this name
		if (WL_STATE.tabs[groupName].hasOwnProperty(newTab.tabName)) {
			//there is, turn it on
			activateTab(groupName, newTab.tabName);
			return;
		}

		//second, check if the requested temp tab is already the temp tab. and it's active
		if (WL_STATE.tabs[groupName].tempTab.name == newTab.tabName && WL_STATE.tabs[groupName].tempTab.set) {
			//cool - they want it that bad, lets make it an actual tab!
			addTabToTabGroup(groupName, newTab);
			activateTab(groupName, newTab.tabName);
			WL_STATE.tabs[groupName].tempTab.active = false;
			WL_STATE.tabs[groupName].tempTab.set = false;
			WL_STATE.tabs[groupName].tempTab.type = '';
			WL_STATE.tabs[groupName].tempTab.data = {};
			return;
		}
		
		//Well - we've got this far, that only means we have a new temp tab!
		WL_STATE.tabs[groupName].tempTab = {}; //cleared
		WL_STATE.tabs[groupName].tempTab[newTab.tabName] = true; //rivets trick for identifying special cases - eg the welcome tab
		WL_STATE.tabs[groupName].tempTab.name = newTab.tabName;
		WL_STATE.tabs[groupName].tempTab.set = true;
		WL_STATE.tabs[groupName].tempTab.type = newTab.tabType;
		WL_STATE.tabs[groupName].tempTab.data = newTab.data;
		activateTempTab(groupName);

	},

	activateTempTab: function(groupName){
		activateTempTab(groupName);
	},

	closeTempTab: function(groupName){
		console.log('closing temp tab');
	}
};