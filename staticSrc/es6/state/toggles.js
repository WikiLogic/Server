'use strict';
/* The Toggle State Controller
 * Thoughts from when this was just a help tab:
 * I'm thinking helpful text could be placed throughout the DOM and hide/show based on 
 * the help state & whatever the relevant containing state is. 
 * The main body of the help tab could itself be tabbed content with more in depth help
 */

 var toggleState = {
 	_id: 'anon',
 	open: true
 }

 var toggleStateRef = {};

module.exports = {
	getNewState: function(toggleId){
		var returnToggleState = Object.create(toggleState);
		returnToggleState._id = toggleId;
		toggleStateRef[toggleId] = returnToggleState;
		console.info('New State: ', toggleStateRef[toggleId]);
		return returnToggleState;
	},
	getExistingState: function(toggleId){
		return toggleStateRef[toggleId];
	},
	open: function(toggleId){
		toggleStateRef[toggleId].open = true;
	},
	close: function(toggleId){
		toggleStateRef[toggleId].open = false;
	}
}