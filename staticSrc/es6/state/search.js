'use strict';

/* The Search Input state controller
 * This holds onto the search details (not the results!)
 */

var eventManager = require('../utils/event_manager');
var searchApi = require('../api/search');

var searchState = {
	_id: 'anon',
	term: '',
	results: []
}

var searchStateRef = {}

module.exports = {
	getNewState: function(searchId){
		var returnSearchState = Object.create(searchState);
		returnSearchState._id = searchId;
		searchStateRef[searchId] = returnSearchState;
		return returnSearchState;
	},
	getExistingState: function(searchId){
		console.log('searchStateRef[searchId]: ', searchStateRef[searchId]);
		return searchStateRef[searchId];
	},
	setTerm: function(searchId, newterm){
		searchStateRef[searchId].term = newterm;
		eventManager.fire('search_term_set', { search: searchStateRef[searchId] });
	},
	runSearch: function(searchId){
		eventManager.fire('search_requested', {	search: searchStateRef[searchId] });

		searchApi.searchByString(searchStateRef[searchId].term).done(function(data){
			//send to the search results
			searchStateRef[searchId].results = data;
			eventManager.fire('search_results_set', { search: searchStateRef[searchId] });
		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});		
	}

};