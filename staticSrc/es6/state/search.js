'use strict';

var eventManager = require('../utils/event_manager');

var setResults = function(resultsArray){
	WL_STATE.search.results = resultsArray;
	
	if (resultsArray.length == 0) {
		WL_STATE.search.is_empty = true;
	} else {
		WL_STATE.search.is_empty = false;
	}
	
	eventManager.fire('search_results_set');
}

module.exports = {

	init: function(){
		WL_STATE.search = {
			term: "",
			results: [],
			is_empty: true
		}
	},

	setNewTerm: function(newterm){
		WL_STATE.search.term = newterm;
	},

	setResults: function(resultsArray){
		setResults(resultsArray);
	}

};