'use strict';

var eventManager = require('../utils/event_manager');

var setResults = function(resultsArray){
	console.groupCollapsed('Setting search results: ', resultsArray);
	WL_STATE.search_results.results = resultsArray;
	
	if (resultsArray.length == 0) {
		closeResultsTab();
	} else {
		openResultsTab();
	}
	console.groupEnd(); //ENd Setting search results
	eventManager.fire('search_results_set', WL_STATE.search_results.results);
}

var openResultsTab = function(){
	WL_STATE.search_results.open_tab = true;
	WL_STATE.search_results.show_tab = true;
}

var closeResultsTab = function(){
	WL_STATE.search_results.open_tab = false;
}

var hideResultsTab = function(){
	WL_STATE.search_results.show_tab = false;
}


module.exports = {

	init: function(){
		console.log('initting search results state controller');
		WL_STATE.search_results = {
			term: "",
			results: [],
			show_tab: false,
			open_tab: false,
			is_empty: true
		}
	},

	setNewTerm: function(newterm){
		WL_STATE.search.term = newterm;
	},

	setResults: function(resultsArray){
		setResults(resultsArray);
	},

	openResultsTab: function(){
		openResultsTab();
	},
	closeResultsTab: function(){
		closeResultsTab();
	},
	hideResultsTab: function(){
		hideResultsTab90;
	}

};