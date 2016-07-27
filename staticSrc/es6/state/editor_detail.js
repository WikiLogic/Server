'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');
var newArgumentStateCtrl = require('./new_argument');
var stateFactory = require('../utils/state_factory');
var claimApi = require('../api/claim');

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

var fillArgumentClaims = function(editorDetailId){
	console.log('editorDetailId: ', editorDetailId);
	console.log('editorDetailRefs: ', editorDetailRefs);
	console.log('editorDetailRefs[editorDetailId]: ', editorDetailRefs[editorDetailId]);
	//build an array of id's & request them
	var idArray = [];
	var allArgumentss = [...editorDetailRefs[editorDetailId].claim.supporting, ...editorDetailRefs[editorDetailId].claim.opposing];
	for (var a = 0; a < allArgumentss.length; a++){
		//now loop through the reasons
		for (var r = 0; r < allArgumentss[a].reasons.length; r++){
			var dup = false;

			//check that it's not a duplicate
			for (var i = 0; i < idArray.length; i++) {
				if (idArray[i] == allArgumentss[a].reasons[r]._id) {
					dup = true;
					break;
				}
			}

			if (!dup) {
				idArray.push(allArgumentss[a].reasons[r]._id);

				allArgumentss[a].reasons[r]._id = 'test';
			}
		}
	}

	claimApi.getClaimsByIdArray(idArray).done(function(data){
		console.log('got all the claims!');

	}).fail(function(err){
		console.error('ERROR: ', err);
	});
	
}

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
	populateReasons(editorDetailId){
		fillArgumentClaims(editorDetailId);
	}
}