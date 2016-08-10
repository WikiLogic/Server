'use strict';

/* The Search Input state controller
 * This holds onto the search details (not the results!)
 */

var eventManager = require('../utils/event_manager');
var searchApi = require('../api/search');
var stateFactory = require('../utils/state_factory');

var searchState = {
	_id: 'anon',
	term: '',
	results: []
}

var searchStateRef = {}

module.exports = {
	getState(searchId){
		if (searchState.hasOwnProperty(searchId)) {
			return searchStateRef[searchId];
		} else {
			var returnSearchState = stateFactory.create(searchState);
			returnSearchState._id = searchId;
			searchStateRef[searchId] = returnSearchState;
			return returnSearchState;
		}
	},
	getExistingState(searchId){
		return searchStateRef[searchId];
	},
	setTerm(searchId, newterm){
		searchStateRef[searchId].term = newterm.trim();
		eventManager.fire('search_term_set', { search: searchStateRef[searchId] });
	},
	runSearch(searchId){
		eventManager.fire('search_requested', {	search: searchStateRef[searchId] });

		searchApi.searchByString(searchStateRef[searchId].term).done(function(data){
			//send to the search results
			searchStateRef[searchId].results = data;
			eventManager.fire('search_results_set', {owner: searchId, data: searchStateRef[searchId]});
		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});		
	},
	searchMostRecent(searchId){
		searchApi.searchMostRecent().done(function(data){
			searchStateRef[searchId].results = data;
			eventManager.fire('search_results_set', {owner: searchId, data: searchStateRef[searchId]});
		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});
	},
	searchMostCapricious(searchId){
		console.warn('TODO search most capricious');
	},
	searchMostCritical(searchId){
		console.warn('TODO search most critical');
	},
	result_clicked(searchId, claimId){
		//get the result object
		var clickedResult = {};

		for (var r = 0; r < searchStateRef[searchId].results.length; r++){
			if (searchStateRef[searchId].results[r]._id == claimId){
				eventManager.fire('search_result_clicked', {
					searchId: searchId,
					resultObj: searchStateRef[searchId].results[r]
				});
				break;
			}
		}
	},
	addResult(searchId, claimObj){
		console.log('adding result!');
		searchStateRef[searchId].results.push(claimObj);
	}

};