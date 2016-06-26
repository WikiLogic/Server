'use strict';

var tabStateCtrl = require('./tabs');

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
		var alreadySet = false;
		//console.log('claimObj: ', claimObj._id);
		//first check that it's not already in the working list
		for (var wli = 0; wli < WL_STATE.working_list.claims.length; wli++) { //wli for Working List Item
			if (WL_STATE.working_list.claims[wli]._id == claimObj._id) {
				alreadySet = true;
				WL_STATE.working_list.is_empty = false;
				//set temp tab
				tabStateCtrl.addTempTabToGroup('editor', claimObj.description);
				break;
			}
		}

		if (!alreadySet) {
			//add the claim to the working list
			WL_STATE.working_list.claims.push(claimObj);
			//and save a refrence to it's new index
			var lastPosition = WL_STATE.working_list.claims.length - 1;
			WL_STATE.working_list.claims[lastPosition].index = lastPosition;
			WL_STATE.working_list.is_empty = false;
		}
		
	},
	removeClaimFromList: function(claimId){
		
	}
}