'use strict';

/* The Search Input state controller
 * This holds onto the search details (not the results!)
 */

var stateFactory = require('../utils/state_factory');
var eventManager = require('../utils/event_manager');
var searchApi = require('../api/search');

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
	setTerm(searchId, term){
		searchStateRef[searchId].term = term;
	},
	setResults(searchId, results){
		searchStateRef[searchId].results = results;
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
	addResult(searchId, claimObj){
		console.log('adding result!');
		searchStateRef[searchId].results.push(claimObj);
	}

};