'use strict';

var eventManager = require('../utils/event_manager');
var newArgumentStateCtrl = require('./new_argument');

/* The Editor Detail state controller
 * The special case here is in adding new for/against arguments. 
 * All those details are delegated to the newArgumentStateCtrl which doesn't actually have it's own dom watcher.
 */


var editorDetailState = {
	_id: 'anon',
	open: false,
	claim: {},
	new_for: {},
	new_against: {}
}

var editorDetailRefs = {};

module.exports = {

	getNewState: function(editorDetailId){
		var returnState = Object.create(editorDetailState);
		returnState._id = editorDetailId;
		//in addition we have to get and attach two new argument group creation forms
		returnState.new_for = newArgumentStateCtrl.getNewState(editorDetailId + "_for");
		returnState.new_against = newArgumentStateCtrl.getNewState(editorDetailId + "_against");

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
	showEditor: function(editorDetailId){
		editorDetailRefs[editorDetailId].open = true;
	},
	hideEditor: function(editorDetailId){
		editorDetailRefs[editorDetailId].open = false;
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