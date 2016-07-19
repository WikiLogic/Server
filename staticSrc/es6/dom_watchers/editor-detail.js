'use strict';

/* Current Editor DOM Watcher
 * This takes care of setting which claim is to be displayed in the body of the editor.
 * It also deals with the interactions from that claim
 */

var editorDetailStateCtrl = require('../state/editor_detail');
var actionStateCtrl = require('../state/actions');
var eventManager = require('../utils/event_manager');

var domActions = {

}

module.exports = {
	init: function(){

		$('.js-editor-detail').each(function(){
			var editorDetailId = $(this).data('editor-detail-id');
			var editorDetailState = editorDetailStateCtrl.getNewState(editorDetailId);
			rivets.bind(
				$(this),
				{ editor_detail: editorDetailState, actions: domActions }
			);
		});

		eventManager.subscribe('editor_tab_opened', function(event){
			if (event.editorTabsId == "main_tabs") {
				editorDetailStateCtrl.setNewClaimDetail("main_editor", event.claimObj);
			}
		});
		
	}
}