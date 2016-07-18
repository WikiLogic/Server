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
		return searchStateRef[searchId];
	},
	setNewTerm: function(searchId, newterm){
		searchStateRef[searchId].term = newterm;
		eventManager.fire('search_term_set', {
			search: searchStateRef[searchId]
		});
	}

};