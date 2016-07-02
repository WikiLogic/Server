'use strict';

var editorListStateCtrl = require('./editor_list');

/* Working_list State controller
 *
 */

module.exports = {
	init: function(){
		WL_STATE.working_list = {
			claims: [],
			is_empty: true
		}
	},
	addClaimToList: function(claimObj){
		console.group('Adding claim to working list', claimObj);
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < WL_STATE.working_list.claims.length; c++) { //c for claim
			if (WL_STATE.working_list.claims[c]._id == claimObj._id) {
				//it is, our job is done
				console.warn('That claim is already in the working list');
				alreadySet = true;
				//open a tab
				editorListStateCtrl.addClaimToList(claimObj);
				break;
			}
		}

		if (!alreadySet) {
			console.log('pushing new claim ref to working list');
			//Yesy! new claim to work with!
			WL_STATE.working_list.claims.push(claimObj);

			//even if it wasn't before, this makes it doubly not so
			WL_STATE.working_list.is_empty = false;
		}
		console.groupEnd(); //END Adding claim to editor list
		
	},
	removeClaimFromList: function(claimId){
		
	}
}