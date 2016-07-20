'use strict';

var eventManager = require('../utils/event_manager');

/* The Clam Detail state controller
 */


var claimDetailState = {
	_id: 'anon',
	show: false,
	claim: {}
}

var claimDetailRefs = {};

module.exports = {

	getNewState: function(claimDetailId){
		var returnState = Object.create(claimDetailState);
		returnState._id = claimDetailId;
		claimDetailRefs[claimDetailId] = returnState;
		return returnState;
	},
	getExistingState: function(claimDetailId){
		return claimDetailRefs[claimDetailId];
	},
	setNewClaimDetail: function(claimDetailId, claimObj){
		claimDetailRefs[claimDetailId].claim = claimObj;
		eventManager.fire('claim_detail_set', {claimDetailId, claimObj});
	},
	show: function(claimDetailId){
		claimDetailRefs[claimDetailId].show = true;
	},
	hide: function(claimDetailId){
		claimDetailRefs[claimDetailId].show = false;
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