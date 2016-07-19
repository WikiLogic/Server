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

		$('.js-working-list').each(function(){
			var workingListId = $(this).data('working-list-id');
			var workingListState = workingListStateCtrl.getNewState(workingListId);
			rivets.bind(
				$(this),
				{ working_list: workingListState, actions: domActions }
			);
		});
		
		eventManager.subscribe('search_result_clicked', function(event){
			if (event.searchId == "main_results"){
				workingListStateCtrl.addClaim("main_list", event.resultObj);
			}
		});

	}
}