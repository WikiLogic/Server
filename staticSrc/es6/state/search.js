'use strict';

var eventManager = require('../utils/event_manager');

var setResults = function(resultsArray){
	WL_STATE.search.results = resultsArray;
	eventManager.fire('search_results_set');
}

module.exports = {

	init: function(){
		WL_STATE.search = {
			term: "",
			results: []
		}
	},

	setNewTerm: function(newterm){
		WL_STATE.search.term = newterm;
	},

	setResults: function(resultsArray){
		setResults(resultsArray);
	}

};