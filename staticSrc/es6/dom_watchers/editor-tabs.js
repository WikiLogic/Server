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
	},
	new_reason_keypress: function(){
		console.log('here I am');
	}
}

module.exports = {
	init: function(){
		console.log('editor-tabs');
		$('.js-editor-tabs').each(function(){
			var editorTabsId = $(this).data('editor-tabs-id');
			var newEditorTabs = editorTabsStateCtrl.getNewState(editorTabsId);
			newEditorTabs.actions = domActions;
			rivets.bind(
				$(this),
				{ editor_tabs: newEditorTabs }
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

	}
}