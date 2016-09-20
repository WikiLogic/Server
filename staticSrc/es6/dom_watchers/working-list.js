'use strict';

var workingListStateCtrl = require('../state/working_list');
var eventManager = require('../utils/event_manager');
/* Working-list DOM watcher
 * This module is responsibe for handling the 'working list'
 * This is a list of claims that live in the editor's sidebar
 * They act like files in Sublime's sidebar - click them to set them as tabs
 */

var domActions = {
	clicked: function(rivet){
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		var workingListId = rivet.currentTarget.attributes['data-working-list-id'].value;
		workingListStateCtrl.itemClicked(workingListId, claimId);
	}
};

module.exports = {
	init: function(){
		console.log('working-list');
		$('.js-working-list').each(function(){
			var workingListId = $(this).data('working-list-id');
			var workingListState = workingListStateCtrl.getNewState(workingListId);
			workingListState.actions = domActions;
			rivets.bind(
				$(this),
				{ working_list: workingListState }
			);
		});
		
		eventManager.subscribe('claim_starred', function(event){
			workingListStateCtrl.addClaim("main_list", event.data.claim);
		});

		eventManager.subscribe('claim_unstarred', function(event){
			console.warn('TODO: remove unstarred claim from working list');
			//workingListStateCtrl.addClaim("main_list", event.data.claim);
		});

		eventManager.subscribe('reason_clicked', function(event){
			workingListStateCtrl.addClaim("main_list", event.claimObj);
		});


	}
}