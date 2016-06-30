'use strict';
/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

module.exports = {
	init: function(){
		WL_STATE.editor_list = {
			claims: []
		};
	},
	addClaimToList: function(claimObj){
		console.group('Adding claim to editor list', claimObj);
		var alreadySet = false;

		//first check that it's not already in the editor list
		for (var c = 0; c < WL_STATE.editor_list.claims.length; c++) { //c for claim
			if (WL_STATE.editor_list.claims[c]._id == claimObj._id) {
				//it is, our job is done
				alreadySet = true;
				break;
			}
		}

		if (!alreadySet) {
			//Yesy! new claim to work with!
			WL_STATE.editor_list.claims.push(claimObj);

			//and let it know where we're putting it (for rivets) - 
			//this step can go if you know how to get the index in rivets alone
			var lastPosition = WL_STATE.working_list.claims.length - 1;
			WL_STATE.working_list.claims[lastPosition].editorIndex = lastPosition;

			//even if it wasn't before, this makes it doubly not so
			WL_STATE.working_list.is_empty = false;
		}
		console.groupEnd(); //END Adding claim to editor list
	},
	removeClaimFromList: function(indexToRemove){
		console.group('Removing claim from working list', indexToRemove);
		WL_STATE.working_list.claims.slice(indexToRemove, 1);
		//now update the editor indexes 
		for (var c = indexToRemove; c < WL_STATE.working_list.claims.length; c++){ //c for claim
			WL_STATE.working_list.claims[c].editorIndex = c;
		}
		console.groupEnd(); //ENd Removing claim from working list
	}
}