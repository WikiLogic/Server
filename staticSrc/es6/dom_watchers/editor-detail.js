'use strict';
/*
 * This module is responsibe for the detail view of a claim
 */

var editorDetailStateCtrl = require('../state/editor_tabs');
var eventManager = require('../utils/event_manager');

var domActions = {

}

module.exports = {
	init: function(){
		console.log('editor-detail');


		eventManager.subscribe('editor_tab_claim_added', function(event){
			//currently only for the main editor
			if (event.owner == "main_tabs") {
				console.warn('TODO: bind editor detail');
/*
				$('.js-editor-detail').each(function(){
					var domClaimId = $(this).data('claim-id');
					var side = $(this).data('argument-side');
					var newargumentId = "new_" + side + "_" + domClaimId;
					//check if this claim already has a new argument state
					if (!newArgumentStateCtrl.hasExistingState(domClaimId)) {
						var newArgumentState = newArgumentStateCtrl.getNewState(newargumentId);
						newArgumentState.actions = domActions;
						console.log('binding: ', newargumentId);
						rivets.bind(
							$(this),
							{ new_argument: newArgumentState }
						);
					};

					//also watch the input
					$(this).find('.js-new-reason').on('keyup', function(e){
						if (e.which == 13) {
							//enter!
							var newReasonText = $(this).val();
							var argumentId = $(this).data('argument-id');
							newArgumentStateCtrl.enterNewReason(argumentId, newReasonText);
						} else {
							//not the enter key - we could start pre fetching results...
							//maybe a good place to debounce a search
							//newArgumentStateCtrl.setNewReason(argumentId, term);

						}
					});
				});
				*/

			}
		});

	}
}