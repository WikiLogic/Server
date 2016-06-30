'use strict';
/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

module.exports = {
	init: function(){
		console.log('initting editor list state controller');
		WL_STATE.editor_list = {
			claim_tabs: []
		};
	},
	addClaimToList: function(claimObj){
		console.group('Adding claim to editor list', claimObj);
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < WL_STATE.editor_list.claim_tabs.length; c++) { //c for claim
			if (WL_STATE.editor_list.claim_tabs[c].claim._id == claimObj._id) {
				//it is, our job is done
				console.log('That claim is already in the editor list');
				alreadySet = true;
				break;
			}
		}

		if (!alreadySet) {
			//Yesy! new claim to work with!
			console.log('pushing new claim ref to the editor list');
			var newClaimTabObj = {
				open: false,
				claim: claimObj
			}
			WL_STATE.editor_list.claim_tabs.push(newClaimTabObj);
		}
		console.groupEnd(); //END Adding claim to editor list
	},
	openClaimTab: function(claimId){
		console.log('opening claim tab id: ', claimId);
		//loop through all the claim tabs, set them to false unless they match
		for (var c = 0; c < WL_STATE.editor_list.claim_tabs.length; c++) {
			if (WL_STATE.editor_list.claim_tabs[c].claim._id == claimId) {
				console.log('open!');
				WL_STATE.editor_list.claim_tabs[c].open = true;
			} else {
				console.log('close');
				WL_STATE.editor_list.claim_tabs[c].open = false;
			}
		}
	},
	removeClaimFromList: function(claimId){
		console.group('Removing claim from editor list', claimId);
		var claimTabRemoved = false;
		//loop through to find the relevant claim obj
		for (var c = 0; c < WL_STATE.editor_list.claim_tabs.length; c++) {
			if (WL_STATE.editor_list.claim_tabs[c].claim._id == claimId) {
				console.log('removing claim tab from array');
				WL_STATE.editor_list.claim_tabs.splice(c,1);
				claimTabRemoved = true;
				break;
			}
		}
		if (!claimTabRemoved) {
			console.warn('Claim tab to remove not found');
		}
		console.groupEnd(); //ENd Removing claim from working list
	}
}