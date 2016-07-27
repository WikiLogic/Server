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

		eventManager.subscribe('claim_updated', function(event){
			//event.owner we have no use for!
			searchStateCtrl.updateClaim(event.data);
		});
	}

}
