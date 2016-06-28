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

				//So it's already in the working list! Guess we'll just have to turn it on to show them :)
				tabStateCtrl.addTempTabToGroup('editor', {
					tabName: claimObj.description,
					tabtype: 'claim',
					data: claimObj
				});

				//and our job is done
				alreadySet = true;

				//also, just some insurance
				WL_STATE.working_list.is_empty = false;

				//I'm bored
				break;
			}
		}

		if (!alreadySet) {
			//Well, we've got to do some work now - add it to the list
			WL_STATE.working_list.claims.push(claimObj);

			//and let it know where we're putting it (for rivets) - this step can go if you know how to get the index in rivets alone
			var lastPosition = WL_STATE.working_list.claims.length - 1;
			WL_STATE.working_list.claims[lastPosition].index = lastPosition;

			//even if it wasn't before, this makes it doubly not so
			WL_STATE.working_list.is_empty = false;
		}
		
	},
	removeClaimFromList: function(claimId){
		
	}
}