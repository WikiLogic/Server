'use strict';

/*
 * This module is responsibe for the help
 * For now this si a single global state option. 
 * Help is either on or off
 * It's like setting WL to "easy mode"
 */

var toggleStateCtrl = require('../state/toggles');
var actionStateCtrl = require('../state/actions');

var domActions = {
	close_toggle: function(rivet){
		var toggleId =  rivet.currentTarget.attributes['data-toggle-id'].value;
		toggleStateCtrl.close(toggleId);
	},
	open_toggle: function(rivet){
		var toggleId =  rivet.currentTarget.attributes['data-toggle-id'].value;
		toggleStateCtrl.open(toggleId);
	}
}

module.exports = {
	init: function(){
		console.log('initting toggle DOM watcher');

		//the controllers (turning help on/off)
		$('.js-toggle-controller').each(function(){
			var toggleId = $(this).data('toggle-id');
			var toggleState = toggleStateCtrl.getNewState(toggleId);
			rivets.bind(
				$(this),
				{ toggle: toggleState, actions: domActions }
			);
		});

		//the views (showing content based on help state settings)
		$('.js-toggle-content').each(function(){
			var toggleId = $(this).data('toggle-id');
			var toggleState = toggleStateCtrl.getExistingState(toggleId);
			rivets.bind(
				$(this),
				{ toggle: toggleState }
			);
		})

	}
}