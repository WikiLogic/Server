'use strict';

/* Current Editor DOM Watcher
 * This takes care of setting which claim is to be displayed in the body of the editor.
 * It also deals with the interactions from that claim
 */

var claimDetailStateCtrl = require('../state/claim_detail');
var eventManager = require('../utils/event_manager');

var domActions = { };


module.exports = {
	init: function(){
		console.log('editor-detail');

		$('.js-claim-detail').each(function(){
			var claimDetailId = $(this).data('claim-detail-id');
			var claimDetailState = claimDetailStateCtrl.getNewState(claimDetailId);
			claimDetailState.actions = domActions;
			rivets.bind(
				$(this),
				{ claim_detail: claimDetailState }
			);
		});

		eventManager.subscribe('editor_tab_opened', function(event){
			if (event.editorTabsId == "main_tabs") {
				claimDetailStateCtrl.setNewClaimDetail("main_claim_detail", event.claimObj);
				claimDetailStateCtrl.show("main_claim_detail");
			}
		});

		eventManager.subscribe('editor_tab_closed', function(event){
			if (event.editorTabsId == "main_tabs") {
				claimDetailStateCtrl.hide("main_claim_detail");
			}
		});

		
		
	}
}