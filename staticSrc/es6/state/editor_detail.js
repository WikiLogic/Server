'use strict';

var eventManager = require('../utils/event_manager');

/* The Editor Detail state controller
 *
 */


var editorDetailState = {
	claim: {},
	new_for: {
		is_valid: false,
		reasons: [
			{

			}
		]
	},
	new_against: {
		is_valid: false,
		reasons: [{}]
	}
}

var editorDetailRefs = {};

module.exports = {

	getNewState: function(editorDetailId){
		var returnState = Object.create(editorDetailState);
		returnState._id = editorDetailId;
		editorDetailRefs[editorDetailId] = returnState;
		return returnState;
	},
	getExistingState: function(editorDetailId){
		return editorDetailRefs[editorDetailId];
	},
	setNewClaimDetail: function(editorDetailId, claimObj){
		editorDetailRefs[editorDetailId].claim = claimObj;
		eventManager.fire('editor_detail_set', {editorDetailId, claimObj});
	},




	addSupportingArgument: function(){
		console.log('stubbing new supporting argument group');
		WL_STATE.editor_detail.claim.supporting.push({
			status:false,
			reasons: []
		});
	},
	addOpposingArgument: function(){
		console.log('stubbing new opposing argument group');
		WL_STATE.editor_detail.claim.opposing.push({
			status:false,
			reasons: []
		});
	}

};