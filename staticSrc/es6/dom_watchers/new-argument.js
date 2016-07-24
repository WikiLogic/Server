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
	}
}



module.exports = {
	init: function(){
		console.log('new-argument');

		eventManager.subscribe('new_editor_detail_state', function(event){

			//hooking in our own new argument objects
			event.data.new_for = [];
			event.data.new_for[0] = newArgumentStateCtrl.getNewState("new_for_" + event.owner);
			event.data.new_for[0].actions = domActions;

			event.data.new_against = [];
			event.data.new_against[0] = newArgumentStateCtrl.getNewState("new_against_" + event.owner);
			event.data.new_against[0].actions = domActions;
		});
		
	}
}