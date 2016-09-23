'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');
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
			}
		}
	}

	claimApi.getClaimsByIdArray(idArray).done(function(data){
		//loop through all the arguments
		for (var a = 0; a < allArgumentss.length; a++){
			//& their reasons
			for (var r = 0; r < allArgumentss[a].reasons.length; r++){
				//add the relevant claim
				for (var c = 0; c < data.length; c++){
					if (data[c]._id == allArgumentss[a].reasons[r]._id) {
						allArgumentss[a].reasons[r].claim = data[c];
						break;
					}
				}
			}
		}
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
	},
	updateArgument(claimObj){
		//claimObj is from the server, it has new arguments
		editorDetailRefs[claimObj._id].claim.supporting = claimObj.supporting;
		editorDetailRefs[claimObj._id].claim.opposing = claimObj.opposing;
	}
}