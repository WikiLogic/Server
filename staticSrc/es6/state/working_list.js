'use strict';

var editorListStateCtrl = require('./editor_list');

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
	removeClaimFromList: function(claimId){
		
	}
}