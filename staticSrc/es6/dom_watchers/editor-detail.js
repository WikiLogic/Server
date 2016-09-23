'use strict';
/*
 * This module is responsibe for the detail view of a claim
 */

var editorDetailStateCtrl = require('../state/editor_detail');
var editorTabsStateCtrl = require('../state/editor_tabs');
var eventManager = require('../utils/event_manager');
var claimApi = require('../api/claim');

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
	reason_clicked: function(rivet){
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		claimApi.getClaimById(claimId).done(function(data){
			eventManager.fire('reason_clicked', {owner:claimId, claimObj: data});	
		}).fail(function(err){
			console.error('Get claim by id failed: ', err);
		});
	}
}

module.exports = {
	init: function(){
		console.log('editor-detail');

		//set up the tabbing 
		$('.js-editor-tabs').each(function(){
			var editorTabsId = $(this).data('editor-tabs-id');
			var newEditorTabs = editorTabsStateCtrl.getState(editorTabsId);
			newEditorTabs.actions = domActions;
			rivets.bind(
				$(this),
				{ editor_tabs: newEditorTabs }
			);
		});

		//set up the tabbed content
		$('.js-editor-tabs-content').each(function(){
			var editorTabsId = $(this).data('editor-tabs-id');
			var tabbedEditorDetails = editorTabsStateCtrl.getState(editorTabsId);
			tabbedEditorDetails.actions = domActions;
			rivets.bind(
				$(this),
				{ editor_details: tabbedEditorDetails }
			);
		});

		//watch the working list to see when the user wants to look at a claim in detail.
		eventManager.subscribe([
			'working_list_claim_clicked',
			'working_list_duplicate_requested'
		], function(event){
			if (event.owner == "main_list") {
				var newEditorDetailState = editorDetailStateCtrl.getNewState(event.data._id);
				newEditorDetailState.claim = event.data;
				editorDetailStateCtrl.populateReasons(newEditorDetailState._id);
				//now add the detail to the editor tabs
				editorTabsStateCtrl.addDetail("main_tabs", newEditorDetailState);
			}
		});

		eventManager.subscribe('claim_updated_new_argument', function(event){
			editorDetailStateCtrl.updateArgument(event.data);
			editorDetailStateCtrl.populateReasons(event.data._id);
		});
		

	}
}