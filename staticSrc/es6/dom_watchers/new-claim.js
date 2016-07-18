'use strict';

/*
 * This module is responsibe for the new claim
 */

var newClaimStateCtrl = require('../state/new_claim');
var claimApi = require('../api/claim');
var eventManager = require('../utils/event_manager');

var domActions = {

}

module.exports = {
	init: function(){

		$('.js-new-claim').each(function(){
			var newClaimId = $(this).data('new-claim-id');
			var newClaimState = newClaimStateCtrl.getNewState(newClaimId);
			rivets.bind(
				$(this),
				{ new_claim: newClaimState, actions: domActions }
			);
		});
		
		//watch for search results being set, then check if there are any exact matches. If not, barge in!
		eventManager.subscribe('search_results_set', function(searchState){

			var exactMatchFound = false;

			for (var r = 0; r < searchState.results.length; r++){
				if (searchState.results[r].description == searchState.term) {
					exactMatchFound = true;
					break;
				}
			}

			if (!exactMatchFound){
				//turn on the relevant new claim form!!
				console.warn('TODO: turn on the new claim form with the search term');
				var newClaimId = searchState._id; //this is deliberate
				newClaimStateCtrl.setDescription(newClaimId, searchState.term);
			}

		});


	}
}