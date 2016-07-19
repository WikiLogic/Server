'use strict';

var eventManager = require('../utils/event_manager');
/* Working_list State controller
 *
 */

var workingListState = {
	claims: []
}

var workingListStateRefs = {};

module.exports = {
	getNewState: function(workingListId){
		var returnListState = Object.create(workingListState);
		returnListState._id = workingListId;
		workingListStateRefs[workingListId] = returnListState;
		return returnListState;
	},
	getExistingState: function(workingListId){
		return workingListStateRefs[workingListId];
	},
	addClaim: function(workingListId, claimObj){
		console.group('Adding claim to working list', claimObj);
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < workingListStateRefs[workingListId].claims.length; c++) { //c for claim
			if (workingListStateRefs[workingListId].claims[c]._id == claimObj._id) {
				//it is, our job is done
				console.warn('That claim is already in the working list');
				alreadySet = true;
				break;
			}
		}

		if (!alreadySet) {
			console.log('pushing new claim ref to working list');
			//Yesy! new claim to work with!
			workingListStateRefs[workingListId].claims.push(claimObj);
		}
		console.groupEnd(); //END Adding claim to editor list
		
	},
	itemClicked: function(workingListId, claimId){
		console.log('item clicked: ', claimId);
		//get the claim object, fire it with an event
		for (var i = 0; i < workingListStateRefs[workingListId].claims.length; i++) {
			if (workingListStateRefs[workingListId].claims[i]._id == claimId) {
				eventManager.fire('working_list_claim_clicked', {
					workingListId: workingListId,
					claim: workingListStateRefs[workingListId].claims[i]
				});
				break;
			}
		}
	},
	removeClaimFromList: function(claimId){
		
	}
}