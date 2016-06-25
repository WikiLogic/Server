'use strict';

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
		WL_STATE.working_list.claims.push(claimObj);
		WL_STATE.working_list.is_empty = false;
	},
	removeClaimFromList: function(claimId){
		
	}
}