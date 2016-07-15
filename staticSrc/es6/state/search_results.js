'use strict';

var eventManager = require('../utils/event_manager');

var resultStates = {}; //holds on to every instance of the search reults state object that we create 
var newSearchResultsState = {
	_id: 'anon',
	term: '',
	results: []
}

module.exports = {
	getNewState: function(resultsId){
		//make a new state object
		var returnState = Object.create(newSearchResultsState);
		//set the id on the new state
		returnState._id = resultsId;
		//save a refrence to the argument
		resultStates[resultsId] = returnState;
		//return the newly created argument
		return returnState;
	},

	setTerm: function(newTerm, resultStateId){
		resultStates[resultStateId].term = newTerm;
	},

	setResults: function(resultsArray, resultStateId){
		resultStates[resultStateId].results = resultsArray;
		eventManager.fire('search_results_set', {
			resultArray: resultsArray,
			resultStateId: resultStateId
		});
	}

};