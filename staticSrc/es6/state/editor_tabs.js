'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');


var openClaimTab = function(editorTabsId, claimId){
	console.log('opening claim tab id: ', claimId);
	var claimObj = {};
	//loop through all the claim tabs, set them to false unless they match
	for (var c = 0; c < newEditorTabsRefs[editorTabsId].claim_tabs.length; c++) {
		if (newEditorTabsRefs[editorTabsId].claim_tabs[c].claim._id == claimId) {
			console.log('open!');
			newEditorTabsRefs[editorTabsId].claim_tabs[c].open = true;
			claimObj = newEditorTabsRefs[editorTabsId].claim_tabs[c].claim;
		} else {
			console.log('close');
			newEditorTabsRefs[editorTabsId].claim_tabs[c].open = false;
		}
	}
	eventManager.fire('editor_tab_opened', {	editorTabsId, claimObj });
}

var removeClaimFromList = function(editorTabsId, claimId){
	console.group('Removing claim from editor list', claimId);
	var claimTabRemoved = false;
	var claimObj = {};
	//loop through to find the relevant claim obj
	for (var c = 0; c < newEditorTabsRefs[editorTabsId].claim_tabs.length; c++) {
		if (newEditorTabsRefs[editorTabsId].claim_tabs[c].claim._id == claimId) {
			console.log('removing claim tab from array');
			claimObj = newEditorTabsRefs[editorTabsId].claim_tabs[c].claim;
			newEditorTabsRefs[editorTabsId].claim_tabs.splice(c,1);
			claimTabRemoved = true;
			eventManager.fire('editor_tab_closed', {	editorTabsId, claimObj });

			//now check if there are any other claims tabs to open instead
			if (newEditorTabsRefs[editorTabsId].claim_tabs.length > 0) {
				console.log('there are other claim tabs to open');
				if (typeof newEditorTabsRefs[editorTabsId].claim_tabs[c] !== 'undefined') {
					//if a tab fell into the place that was just spliced, open it
					console.log('opening the tab that is now in the place of the one removed: ', newEditorTabsRefs[editorTabsId].claim_tabs[c]);
					openClaimTab(editorTabsId, newEditorTabsRefs[editorTabsId].claim_tabs[c].claim._id);	
				} else {
					//otherwise open the one before it
					console.log('opening the tab that\'s one back: ', newEditorTabsRefs[editorTabsId].claim_tabs[c-1]);
					openClaimTab(editorTabsId, newEditorTabsRefs[editorTabsId].claim_tabs[c-1].claim._id);
				}
			} 
			break;
		}
	}

	if (!claimTabRemoved) {
		console.warn('Claim tab to remove not found');	
	}

	console.groupEnd(); //ENd Removing claim from working list

}

var editorTabsState = {
	_id: 'anon',
	claim_tabs: []
}

var newEditorTabsRefs = {};


module.exports = {
	getNewState: function(editorTabsId){
		var returnState = Object.create(editorTabsState);
		returnState._id = editorTabsId;
		newEditorTabsRefs[editorTabsId] = returnState;
		console.info('New State: ', newEditorTabsRefs[editorTabsId]);
		return returnState;
	},
	getExistingState: function(editorTabsId){
		return newEditorTabsRefs[editorTabsId];
	},
	addClaim: function(editorTabsId, claimObj){
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < newEditorTabsRefs[editorTabsId].claim_tabs.length; c++) { //c for claim
			if (newEditorTabsRefs[editorTabsId].claim_tabs[c].claim._id == claimObj._id) {
				//it is, our job is done
				alreadySet = true;
				break;
			}
		}

		if (!alreadySet) {
			//Yesy! new claim to work with!
			var newClaimTabObj = {
				open: false,
				claim: claimObj
			}
			newEditorTabsRefs[editorTabsId].claim_tabs.push(newClaimTabObj);
			eventManager.fire('editor_tab_claim_added', {owner: editorTabsId, data: newClaimTabObj});
		}

		openClaimTab(editorTabsId, claimObj._id);
	},
	openClaimTab: function(editorTabsId, claimId){
		openClaimTab(editorTabsId, claimId);
	},
	removeClaimFromList: function(editorTabsId, claimId){
		removeClaimFromList(editorTabsId, claimId);
	}
}