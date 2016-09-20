'use strict';

/* Working_list State controller
 * Holds a list of the claims we are interested
 */
 
var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

var workingListState = {
	claims: []
}

var workingListStateRefs = {};

module.exports = {
	getState(workingListId){
		if (workingListStateRefs.hasOwnProperty(workingListId)) {
			return workingListStateRefs[workingListId];
		}
		var returnListState = stateFactory.create(workingListState);
		returnListState._id = workingListId;
		workingListStateRefs[workingListId] = returnListState;
		return returnListState;
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
	removeClaim(workingListId, claimId){
		for (var c = 0; c < workingListStateRefs[workingListId].claims.length; c++) { //c for claim
			if (workingListStateRefs[workingListId].claims[c]._id == claimObj._id) {
				//remove it
			}
		}
	}
}