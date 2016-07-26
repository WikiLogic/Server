'use strict';

/* This module is responsibe for the new claim
 * It looks like these might generally be attached to some search results
 * It could then be a good idea to have the id of the new claim to match that of the results to which it is attached
 * then when we're responding to the search_results_set event, we can assume the id matches. nifty? or spaghetti? 
 */

var newClaimStateCtrl = require('../state/new_claim');
var claimApi = require('../api/claim');
var eventManager = require('../utils/event_manager');

var domActions = {

}

module.exports = {
	init: function(){
		console.log('new-claim');
		$('.js-new-claim').each(function(){
			var newClaimId = $(this).data('new-claim-id');
			var newClaimState = newClaimStateCtrl.getNewState(newClaimId);
			newClaimState.actions = domActions;
			rivets.bind(
				$(this),
				{ new_claim: newClaimState }
			);
		});
		
		//watch for search results being set, then check if there are any exact matches. If not, barge in!
		eventManager.subscribe('search_results_set', function(event){

			//currently only running for the main results
			if (event.owner == "main_results") {
				var exactMatchFound = false;

				for (var r = 0; r < event.data.results.length; r++){
					if (event.data.results[r].description == event.data.term) {
						exactMatchFound = true;
						break;
					}
				}

				if (exactMatchFound){
					newClaimStateCtrl.hide("main_results");
				} else {
					newClaimStateCtrl.setDescription("main_results", event.data.term);
					newClaimStateCtrl.show("main_results");
				}

			}

		});
	}
}