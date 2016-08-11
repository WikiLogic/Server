'use strict';

var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

var addTab = function(tabGroup, tabName){
	var tabIndex = tabGroupStateRefs[tabGroup].tabs.indexOf(tabName);
	if (tabIndex > -1) {
		console.warn('that tab already exists');
		return tabGroupStateRefs[tabGroup].tabs[tabIndex];
	} else {
		var newTab = {
			title: tabName,
			open: false
		}
		tabGroupStateRefs[tabGroup].tabs.push(newTab);
		return newTab;
	}
}

var openTab = function(tabGroup, tabName){
	for (var t = 0; t < tabGroupStateRefs[tabGroup].tabs.length; t++) {
		if (tabGroupStateRefs[tabGroup].tabs[t].title == tabName) {
			tabGroupStateRefs[tabGroup].tabs[t].open = true;
		} else {
			tabGroupStateRefs[tabGroup].tabs[t].open = false;	
		}
	}
}

var tabGroupState = {
	_id: 'anon',
	tabs: []
}
var tabGroupStateRefs = {};

module.exports = {
	addTab(tabGroup, tabName, defaultTab){
		if (!tabGroupStateRefs.hasOwnProperty(tabGroup)) {
			//build new tabs if they don't yet exist
			tabGroupStateRefs[tabGroup] = stateFactory.create(tabGroupState);
			tabGroupStateRefs[tabGroup]._id = tabGroup;
		}
		
		var newTab = addTab(tabGroup, tabName);
		if (defaultTab) {
			openTab(tabGroup, tabName);
		}
		return newTab;
	},
	openTab(tabGroup, tabName){
		if (tabGroupStateRefs.hasOwnProperty(tabGroup)) {
			openTab(tabGroup, tabName);
		} else {
			console.warn('Eh - that tab group does not exist...');
		}
	},
	getTabState(tabGroup, tabName){
		for (var t = 0; t < tabGroupStateRefs[tabGroup].tabs.length; t++) {
			if (tabGroupStateRefs[tabGroup].tabs[t].title == tabName) {
				return tabGroupStateRefs[tabGroup].tabs[t];
			}
		}
		console.warn('no tab exists');
	}
}