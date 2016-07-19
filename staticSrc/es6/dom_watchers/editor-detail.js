'use strict';

/* Current Editor DOM Watcher
 * This takes care of setting which claim is to be displayed in the body of the editor.
 * It also deals with the interactions from that claim
 */

var editorDetailStateCtrl = require('../state/editor_detail');
var eventManager = require('../utils/event_manager');

var domActions = {
	new_reason_keypress: function(rivet, e){

		var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
		var term = rivet.currentTarget.value;

		if (rivet.key == "Enter"){

			editorDetailStateCtrl.enterNewReason(argumentId, term);
			
			searchApi.searchByString(term).done(function(data){
				//add to search results
				newArgumentStateCtrl.setResults(argumentId, term, data);
			}).fail(function(err){
				console.error('search api error: ', err);
				//TODO: send to alerts
			});

		} else {
			//not the enter key - we could start pre fetching results...
			//maybe a good place to debounce a search
			editorDetailStateCtrl.setNewReason(argumentId, term);

		}
	}
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
				editorDetailStateCtrl.showEditor("main_editor");
			}
		});

		eventManager.subscribe('editor_tab_closed', function(event){
			if (event.editorTabsId == "main_tabs") {
				editorDetailStateCtrl.hideEditor("main_editor");
			}
		});

		
		
	}
}