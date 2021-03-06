'use strict';

/* Working_list State controller
 *
 */
 
var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

var workingListState = {
	claims: []
}

var workingListStateRefs = {};

module.exports = {
	getNewState(workingListId){
		var returnListState = stateFactory.create(workingListState);
		returnListState._id = workingListId;
		workingListStateRefs[workingListId] = returnListState;
		return returnListState;
	},
	getExistingState(workingListId){
		return workingListStateRefs[workingListId];
	},
	addClaim(workingListId, claimObj){
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < workingListStateRefs[workingListId].claims.length; c++) { //c for claim
			if (workingListStateRefs[workingListId].claims[c]._id == claimObj._id) {
				//it is, our job is done
				alreadySet = true;
				eventManager.fire('working_list_duplicate_requested', {owner: workingListId, data: workingListStateRefs[workingListId].claims[c]});
				break;
			}
		}

		if (!alreadySet) {
			//Yesy! new claim to work with!
			workingListStateRefs[workingListId].claims.push(claimObj);
		}
		
	},
	itemClicked(workingListId, claimId){
		//get the claim object, fire it with an event
		for (var i = 0; i < workingListStateRefs[workingListId].claims.length; i++) {
			if (workingListStateRefs[workingListId].claims[i]._id == claimId) {
				eventManager.fire('working_list_claim_clicked', {
					owner: workingListId,
					data: workingListStateRefs[workingListId].claims[i]
				});
				break;
			}
		}
	},
	removeClaimFromList(claimId){
		
	}
}