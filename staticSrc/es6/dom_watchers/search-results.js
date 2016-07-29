'use strict';

var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');
var actionStateCtrl = require('../state/actions');
var eventManager = require('../utils/event_manager');


var domActions = {
	result_clicked: function(rivet){
		//get the search id
		var searchId = rivet.currentTarget.attributes['data-search-id'].value;
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		//tell the state
		searchStateCtrl.result_clicked(searchId, claimId);
	}
}

module.exports = {

	init: function(){
		console.log('search-results');
		$('.js-search-results').each(function(){
			//bind the state (don't make a new one for results, only the search input should do that);
			var searchId = $(this).data('search-id');
			var searchState = searchStateCtrl.getExistingState(searchId);
			searchState.actions.result_clicked = domActions.result_clicked;
			rivets.bind(
				$(this),
				{ search: searchState }
			);

		});

		eventManager.subscribe('new_claim_published', function(event){
			if (event.owner == "main_results") {
				searchStateCtrl.addResult("main_results", event.data);
			}
		});

		eventManager.subscribe('new_claims_found', function(event){
			if (event.owner == "main_results") {
				for (var r = 0; r < event.data.length; r++) {
					searchStateCtrl.addResult("main_results", event.data[r]);
				}
			}
		});
	}

}
