'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

var openClaimTab = function(editorTabsId, claimId){
	var claimObj = {};
	//loop through all the claim tabs, set them to false unless they match
	for (var c = 0; c < newEditorTabsRefs[editorTabsId].tab_list.length; c++) {
		if (newEditorTabsRefs[editorTabsId].tab_list[c]._id == claimId) {
			newEditorTabsRefs[editorTabsId].tab_list[c].open = true;
			claimObj = newEditorTabsRefs[editorTabsId].tab_list[c].claim;
		} else {
			newEditorTabsRefs[editorTabsId].tab_list[c].open = false;
		}
	}
	eventManager.fire('editor_tab_opened', { owner: editorTabsId, data: claimObj });
}

var removeClaimFromList = function(editorTabsId, claimId){
	var claimTabRemoved = false;
	var claimObj = {};
	//loop through to find the relevant claim obj
	for (var c = 0; c < newEditorTabsRefs[editorTabsId].tab_list.length; c++) {
		if (newEditorTabsRefs[editorTabsId].tab_list[c]._id == claimId) {
			claimObj = newEditorTabsRefs[editorTabsId].tab_list[c].claim;
			newEditorTabsRefs[editorTabsId].tab_list.splice(c,1);
			claimTabRemoved = true;
			eventManager.fire('editor_tab_closed', {	editorTabsId, claimObj });

			//now check if there are any other claims tabs to open instead
			if (newEditorTabsRefs[editorTabsId].tab_list.length > 0) {
				if (typeof newEditorTabsRefs[editorTabsId].tab_list[c] !== 'undefined') {
					//if a tab fell into the place that was just spliced, open it
					openClaimTab(editorTabsId, newEditorTabsRefs[editorTabsId].tab_list[c]._id);	
				} else {
					//otherwise open the one before it
					openClaimTab(editorTabsId, newEditorTabsRefs[editorTabsId].tab_list[c-1]._id);
				}
			} 
			break;
		}
	}

	if (!claimTabRemoved) {
		console.warn('Claim tab to remove not found');	
	}


}

var editorTabsState = {
	_id: 'anon',
	tab_list: []
}

var newEditorTabsRefs = {};


module.exports = {
	getState(editorTabsId){
		if (newEditorTabsRefs.hasOwnProperty(editorTabsId)) {
			return newEditorTabsRefs[editorTabsId];
		}
		var returnState = stateFactory.create(editorTabsState);
		returnState._id = editorTabsId;
		newEditorTabsRefs[editorTabsId] = returnState;
		return returnState;
	},
	getExistingState(editorTabsId){
		return newEditorTabsRefs[editorTabsId];
	},
	newTab(editorTabsId, claimObj){

	},
	addDetail(editorTabsId, claimDetail){
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < newEditorTabsRefs[editorTabsId].tab_list.length; c++) { //c for claim
			if (newEditorTabsRefs[editorTabsId].tab_list[c]._id == claimDetail._id) {
				//it is, our job is done
				alreadySet = true;
				break;
			}
		}

		if (!alreadySet) {
			eventManager.fire('editor_tab_claim_added', {owner: editorTabsId, data: claimDetail});
			newEditorTabsRefs[editorTabsId].tab_list.push(claimDetail);
		}

		openClaimTab(editorTabsId, claimDetail._id);
	},
	openClaimTab(editorTabsId, claimId){
		openClaimTab(editorTabsId, claimId);
	},
	removeClaimFromList(editorTabsId, claimId){
		removeClaimFromList(editorTabsId, claimId);
	}
}