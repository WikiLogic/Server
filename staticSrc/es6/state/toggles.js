'use strict';
/* The Toggle State Controller
 * Thoughts from when this was just a help tab:
 * I'm thinking helpful text could be placed throughout the DOM and hide/show based on 
 * the help state & whatever the relevant containing state is. 
 * The main body of the help tab could itself be tabbed content with more in depth help
 */

var stateFactory = require('../utils/state_factory');

 var toggleState = {
 	_id: 'anon',
 	open: true
 }

 var toggleStateRef = {};

module.exports = {
	getNewState(toggleId){
		var returnToggleState = stateFactory.create(toggleState);
		returnToggleState._id = toggleId;
		toggleStateRef[toggleId] = returnToggleState;
		console.info('New State: ', toggleStateRef[toggleId]);
		return returnToggleState;
	},
	getExistingState(toggleId){
		return toggleStateRef[toggleId];
	},
	open(toggleId){
		toggleStateRef[toggleId].open = true;
	},
	close(toggleId){
		toggleStateRef[toggleId].open = false;
	}
}