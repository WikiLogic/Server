'use strict';

var objectHelpers = require('../reducers/object_helpers');

/*
 * This module deals with adding actions to the global state object
 * these are the actions that rivets will call from the DOM,
 * we do this as we would otherwise have to rerun jQuery every 
 * time rivets updates.
 */

module.exports = {

	addAction(name, action){
		
		if (!WL_STATE.hasOwnProperty('actions')) {
			WL_STATE.actions = {};
		}

		window.WL_STATE.actions[name] = action;
	}

};