'use strict';

/*
 * This module is responsibe for the new arguments form
 */

var newArgumentStateCtrl = require('../state/new_argument');
var eventManager = require('../utils/event_manager');

var domActions = {
	new_reason_keypress: function(rivet, e){
		console.log('new reason');
		var argumentId = $(rivet.currentTarget).closest('.js-argument-creation-form').data('argument-id');
		var term = rivet.currentTarget.value;

		if (rivet.key == "Enter"){
			newArgumentStateCtrl.enterNewReason(argumentId, term);

		} else {
			//not the enter key - we could start pre fetching results...
			//maybe a good place to debounce a search
			newArgumentStateCtrl.setNewReason(argumentId, term);

		}
	},
	save_reason_as_claim: function(rivet){
		console.group('Saving reason as new claim');
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		var newClaimString = newArgumentStateCtrl.getSearchTerm(argumentId);
		claimApi.newClaim(newClaimString).done(function(data){
			console.info('new claim has been added!', data);
			newArgumentStateCtrl.addReason(argumentId, data);
			//add it to this new argument
		}).fail(function(err){
			console.error('new claim api failed', err);

			//send err to the alert system
		});
		console.groupEnd();//END Saving reason as new claim
	},
	add_reason_to_argument: function(rivet){
		console.group('Adding reason to argument');
		//get the claim ref & argument id

		//send it to the argument state controller
		console.groupEnd(); //END Adding reason to argument
	},
	save_new_argument: function(rivet){
		console.group('saving New Argument Group');
		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		console.log('TODO: save argument to somewhere');
	
		console.groupEnd();//END adding New Argument Group
	}
}



module.exports = {
	init: function(){
		console.log('new-argument');

		//for each argument creation form, bind a new argument state object. There probably won't be any there yet.
		$('.js-argument-creation-form').each(function(){
			var newargumentId = $(this).data('claim-id');
			var newArgumentState = newArgumentStateCtrl.getNewState(newargumentId);
			newArgumentState.actions = domActions;
			rivets.bind(
				$(this),
				{ new_argument: newArgumentState }
			);
		});

		//Listen out for any new claims being added to the editor tabs, we'll need to bind them
		eventManager.subscribe('editor_tab_claim_added', function(event){
			
			//currently only for the main editor
			if (event.owner == "main_tabs") {
				console.warn('TODO: bind the claim detail');
				//event.data is the claim
				//look for it's bit of the DOM and bind it.
				//fair warning, rivets may not have run. This'll be the next challenge no doubt.
				$('.js-argument-creation-form').each(function(){
					var domClaimId = $(this).data('claim-id');
					var side = $(this).data('argument-side');
					var newargumentId = "new_" + side + "_" + domClaimId;
					//check if this claim already has a new argument state
					if (typeof newArgumentStateCtrl.getExistingState(domClaimId) == "undefined") {
						var newArgumentState = newArgumentStateCtrl.getNewState(newargumentId);
						newArgumentState.actions = domActions;
						rivets.bind(
							$(this),
							{ new_argument: newArgumentState }
						);
					};
				});
			}
		});
		
	}
}