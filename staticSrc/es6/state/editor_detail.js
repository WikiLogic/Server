'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');
var newArgumentStateCtrl = require('./new_argument');
var stateFactory = require('../utils/state_factory');

var editorDetailState = {
	_id: 'anon',
	show: false,
	claim: {},
	new_for: [],
	new_against: [],
	sort_for: {},
	sort_against: {}
}

var editorDetailRefs = {};

module.exports = {
	getNewState(editorDetailId){
		var returnState = stateFactory.create(editorDetailState);
		returnState._id = editorDetailId;
		editorDetailRefs[editorDetailId] = returnState;
		eventManager.fire('new_editor_detail_state', {owner: editorDetailId, data: editorDetailRefs[editorDetailId]});
		return returnState;
	},
	getExistingState(editorDetailId){
		return editorDetailRefs[editorDetailId];
	},
	updateArgument(claimObj){

		editorDetailRefs[claimObj._id].claim.supporting = claimObj.supporting;
		editorDetailRefs[claimObj._id].claim.opposing = claimObj.opposing;
	}
}