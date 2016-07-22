'use strict';

/* The Editor List State Controller
 * This state drives the editor's tabs and sends the correct content to the editor detail
 */

var eventManager = require('../utils/event_manager');
var newArgumentStateCtrl = require('./new_argument');

var editorDetailState = {
	_id: 'anon',
	show: false,
	claimObj: {},
	new_for: {},
	new_against: {},
	sort_for: {},
	sort_against: {}
}

var editorDetailRefs = {};


module.exports = {
	getNewState: function(editorDetailId){
		var returnState = Object.create(editorDetailState);
		returnState._id = editorDetailId;
		editorDetailRefs[editorDetailId] = returnState;
		console.info('New Editor Detail State: ', editorDetailRefs[editorDetailId]);
		return returnState;
	},
	getExistingState: function(editorDetailId){
		return editorDetailRefs[editorDetailId];
	}
}