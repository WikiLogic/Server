'use strict';

/* Everyting aout handling tab state!
 * The array is for rivets to loop through in the DOM
 * The named attributes are for ease - if we know the name, there's no need to loop.
 * the array object also holds any kind of data that might need to be attached to a tab
 * When the event is fired, the tab object is passed along with the event so subscribers can see any details
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
	console.groupCollapsed('Adding tab', newTab, 'to group', groupName);
	console.log(typeof WL_STATE.tabs[groupName][newTab.tabName]);
	//check that tab doesn't already exist
	if (typeof WL_STATE.tabs[groupName][newTab.tabName] == 'object') {
		console.warn('A tab of that name already exists in this tab group: ', WL_STATE.tabs[groupName]);
		activateTab(groupName, newTab.tabName);
		console.groupEnd(); //END Adding tab to group
		return;
	} 

	//yeay! New tab!
	console.log('pushing to tabs array');
	//first add the tab to the tab group array
	WL_STATE.tabs[groupName].tabs.push({
		name: newTab.tabName, 
		active: false, 
		type: newTab.tabType,
		data: newTab.data
	});

	console.log('setting named object')
	//now add the named tab state object for rivets
	WL_STATE.tabs[groupName][newTab.tabName] = {
		active: false,
		tabIndex: WL_STATE.tabs[groupName].tabs.length - 1
	};

	activateTab(groupName, newTab.tabName);
	console.groupEnd(); //END Adding tab to group
}

var activateTab = function(groupName, tabToActivate){
	console.groupCollapsed('activating tab');
	console.log('Tab group: ', groupName);
	console.log('tabToActivate: ', tabToActivate);
	
	//get the new group state
	var newTabGroup = tabGroupReducer.activateTab(WL_STATE.tabs[groupName], tabToActivate);
	console.log('reducer result: ', newTabGroup);
	
	//add back to state so rivets can render
	WL_STATE.tabs[groupName] = newTabGroup;	
	
	//get the tab object that was set
	var tabIndex = WL_STATE.tabs[groupName][tabToActivate].tabIndex;
	var openedTab = WL_STATE.tabs[groupName].tabs[tabIndex];
	console.log('The tab object: ', openedTab, tabIndex);
	
	//fire the event and pass the tab data!
	console.groupEnd(); //END activating tab
	eventManager.fire('tab_opened', openedTab);
}

var removeTab = function(groupName, tabName){
	
	var newTabGroup = objectHelpers.cloneThisObject(WL_STATE.tabs[groupName]);

	//remove from array
	var tabIndex = newTabGroup[tabName].tabIndex;
	newTabGroup.tabs.splice(tabIndex, 1);
	console.log('newTabGroup.results', newTabGroup.results);
	//and remove the names attribute
	delete newTabGroup[tabName];
	console.log('newTabGroup.results', newTabGroup.results);

	//now we have to update the indexes listed on the named objects. Loop through remaining tabs from the one closed
	for (var t = 0; t < (newTabGroup.tabs.length - tabIndex); t++ ) { //t for tab
		//loop will run for the number of tabs that were shifted over
		//to start from the first shifted tab, just use the tabindex!
		var nameToUpdateIndex = newTabGroup.tabs[tabIndex + t].name;
		newTabGroup[nameToUpdateIndex].tabIndex = tabIndex + t;
	}

	WL_STATE.tabs[groupName] = newTabGroup;
}

var activateTempTab = function(groupName){
	//clone the tab group state
	var newTabGroup = objectHelpers.cloneThisObject(WL_STATE.tabs[groupName]);

	//set all the tabs to false.
	for (var t = 0; t < newTabGroup.tabs.length; t++) {
		//tab array item to false
		newTabGroup.tabs[t].active = false;
		//and it's named counterpart
		newTabGroup[newTabGroup.tabs[t].name].active = false;
	}

	//set the tempTab to true
	newTabGroup.tempTab.active = true;	

	//and apply to state!
	WL_STATE.tabs[groupName] = newTabGroup;

	eventManager.fire('tab_opened', newTabGroup.tempTab);
}

//the 'public' interface
module.exports = {

	createTabGroup(groupName){
		createTabGroup(groupName);
	},

	addTabToTabGroup(groupName, newTab){
		addTabToTabGroup(groupName, newTab);
	},

	activateTab(groupName, tabToActivate){
		activateTab(groupName, tabToActivate);
	},

	removeTab(groupName, tabName){
		console.groupCollapsed('removing "' + tabName + '" from "' + groupName);
		//first check if this is the tab they're currently on
		if (WL_STATE.tabs[groupName][tabName].active) {
			//yep, they are. We're going to have to move them to another tab
			console.log('current tab');
			var moveToIndex = -1;
			
			//first - are there any other tabs to move them to or is this the last one?
			if (WL_STATE.tabs[groupName].tabs.length == 1 ) {
				console.log('only tab');
				//meh, nothing we can do
				if (typeof WL_STATE.tabs[groupName].tempTab !== 'null') {
					console.log('but there is a temp tab, opening that');
					activateTempTab(groupName);
				}

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
		}
		removeTab(groupName, tabName);
		
		console.groupEnd();
	},

	addTempTabToGroup(groupName, newTab){
		console.groupCollapsed('Adding Temp Tab: ', newTab, 'to Group:', groupName);
		//Recreates the sublime text tab behaviour(ish). One click adds temp tab, a second adds it permanently 
		//newTab = { tabName: <string>, tabType: <string>, data: <obj> }


		 //first check there isn't a main tab of this name
		if (typeof WL_STATE.tabs[groupName][newTab.tabName] == 'object') {
			console.log('There is already a main tab of this name.');
			//there is, turn it on
			activateTab(groupName, newTab.tabName);
			console.groupEnd();//END Adding Temp Tab
			return;
		}

		//second, check if the requested temp tab is already the temp tab. and it's active
		if (WL_STATE.tabs[groupName].tempTab.name == newTab.tabName && WL_STATE.tabs[groupName].tempTab.has_content) {
			console.log('Second request for the currently open temp tab');
			//cool - they want it that bad, lets make it an actual tab!
			addTabToTabGroup(groupName, newTab);
			activateTab(groupName, newTab.tabName);
			//clear out the temp tab
			WL_STATE.tabs[groupName].tempTab.active = false;
			WL_STATE.tabs[groupName].tempTab.has_content = false;
			WL_STATE.tabs[groupName].tempTab.type = '';
			WL_STATE.tabs[groupName].tempTab.data = {};
			console.groupEnd();//END Adding Temp Tab
			return;
		}
		
		console.log('setting new temp tab');
		//Well - we've got this far, that only means we have a new temp tab!
		WL_STATE.tabs[groupName].tempTab = {}; //cleared
		WL_STATE.tabs[groupName].tempTab[newTab.tabName] = true; //rivets trick for identifying special cases - eg the welcome tab
		WL_STATE.tabs[groupName].tempTab.name = newTab.tabName;
		WL_STATE.tabs[groupName].tempTab.has_content = true;
		WL_STATE.tabs[groupName].tempTab.type = newTab.tabType;
		WL_STATE.tabs[groupName].tempTab.data = newTab.data;
		activateTempTab(groupName);
		console.groupEnd();//END Adding Temp Tab

	},

	activateTempTab(groupName){
		activateTempTab(groupName);
	},

	closeTempTab(groupName){
		console.log('closing temp tab');
		//if it's open and there is a tab available to move the user to, move the user there
		if (WL_STATE.tabs[groupName].tempTab.active && WL_STATE.tabs[groupName].tabs.length > 0) {
			console.log('temp tab is open, moving the user to another tab');
			var lastTabInArray = WL_STATE.tabs[groupName].tabs[WL_STATE.tabs[groupName].tabs.length - 1];
			activateTab(groupName, lastTabInArray.name);
		} 
		WL_STATE.tabs[groupName].tempTab = null;
	}
};