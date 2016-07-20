'use strict';
/*
 * This module is responsibe for the editor's claim tabs
 */

var editorTabsStateCtrl = require('../state/editor_tabs');
var eventManager = require('../utils/event_manager');

var domActions = {
	editor_tab_open: function(rivet){
		var editorTabsId = rivet.currentTarget.attributes['data-editor-tabs-id'].value;
		var claimId = rivet.currentTarget.attributes['data-claimtab-id'].value;
		editorTabsStateCtrl.openClaimTab(editorTabsId, claimId);
	},
	editor_tab_close: function(rivet){
		var editorTabsId = rivet.currentTarget.attributes['data-editor-tabs-id'].value;
		var claimId = rivet.currentTarget.attributes['data-claimtab-id'].value;
		editorTabsStateCtrl.removeClaimFromList(editorTabsId, claimId);
	}
}

module.exports = {
	init: function(presetTabs){
		console.log('editor-tabs');
		$('.js-editor-tabs').each(function(){
			var editorTabsId = $(this).data('editor-tabs-id');
			var newEditorTabs = editorTabsStateCtrl.getNewState(editorTabsId);
			newEditorTabs.actions = domActions;
			rivets.bind(
				$(this),
				{ tabs: newEditorTabs }
			);
		});

		$('.js-editor-tabs-content').each(function(){
			var editorTabsId = $(this).data('editor-tabs-id');
			var editorTabsState = editorTabsStateCtrl.getExistingState(editorTabsId);
			rivets.bind(
				$(this),
				{ editor_tabs: editorTabsState }
			);
		});

		eventManager.subscribe('working_list_claim_clicked', function(event){
			if (event.owner == "main_list") {
				editorTabsStateCtrl.addClaim("main_tabs", event.data);
			}
		});

		eventManager.subscribe('working_list_duplicate_requested', function(event){
			if (event.owner == "main_list") {
				editorTabsStateCtrl.addClaim("main_tabs", event.data);
			}
		});

/*

		actionStateCtrl.addAction('add_claim_to_editor_list', function(rivet){
		console.groupCollapsed('adding claim to editor list');
			var claimFound = false;
			//first we need to get a refrence of the claim object
			//Which list is it in?
			var location = rivet.currentTarget.attributes['data-from-list'].value;
			var claimId =  rivet.currentTarget.attributes['data-claim-id'].value;
			if (location == 'working_list') {
				for (var c = 0; c < WL_STATE.working_list.claims.length; c++) { //c for claim
					if (WL_STATE.working_list.claims[c]._id == claimId) {
						var claimRef = WL_STATE.working_list.claims[c];
						claimFound = true;
						break;
					}
				}
			} else {
				console.error('not set up to pull claims from', location);
			}

			if (claimFound) {
				editorListStateCtrl.addClaimToList(claimRef);
			} else {
				console.warn(claimId, ' not found in ', location);
			}
		console.groupEnd();
		});
*/
	}
}