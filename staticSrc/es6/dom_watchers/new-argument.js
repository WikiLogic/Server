'use strict';

/*
 * This module is responsibe for the new arguments form
 */

var newArgumentStateCtrl = require('../state/new_argument');
var eventManager = require('../utils/event_manager');

var domActions = {
	new_reason_keypress: function(rivet, e){
		//console.log('new reason');
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		var term = rivet.currentTarget.value;
		console.log('term: ', term); // <- does this just render too fast? Watch the console when you're typing. It's so weird.

		if (rivet.key == "Enter"){
			newArgumentStateCtrl.enterNewReason(argumentId, term);

		} else {
			//not the enter key - we could start pre fetching results...
			//maybe a good place to debounce a search
			newArgumentStateCtrl.setNewReason(argumentId, term);

		}
	},
	result_clicked: function(rivet){
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		var claimToAdd = newArgumentStateCtrl.getClaimFromSearch(argumentId, claimId);
		newArgumentStateCtrl.addReason(argumentId, claimToAdd);
	},
	remove_reason: function(rivet){
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		newArgumentStateCtrl.removeReason(argumentId, claimId);
	},
	save_search_term_as_claim: function(rivet){
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		newArgumentStateCtrl.saveTermAsClaim(argumentId);
	}
}



module.exports = {
	init: function(){
		console.log('new-argument');

		eventManager.subscribe('editor_tab_claim_added', function(event){

			//hooking in our own new argument objects
			event.data.claim.new_for = [];
			event.data.claim.new_for[0] = newArgumentStateCtrl.getNewState("new_for_" + event.data.claim._id);
			event.data.claim.new_for[0].parent_claim_description = event.data.claim.description;
			event.data.claim.new_for[0].actions = domActions;

			event.data.claim.new_against = [];
			event.data.claim.new_against[0] = newArgumentStateCtrl.getNewState("new_against_" + event.data.claim._id);
			event.data.claim.new_against[0].parent_claim_description = event.data.claim.description;
			event.data.claim.new_against[0].actions = domActions;
		});
		
	}
}