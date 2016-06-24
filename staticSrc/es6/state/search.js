'use strict';

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
		WL_STATE.search.results = resultsArray;
	}

};