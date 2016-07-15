'use strict';

/*
 * This module is responsibe for the helper tab
 * For now this si a single global state option. 
 * Help is either on or off
 * It's like setting WL to "easy mode"
 */

var helperTabStateCtrl = require('../state/helper_tab'); helperTabStateCtrl.init();
var actionStateCtrl = require('../state/actions');

var domActions = {
	close_helper_tab: function(){
		helperTabStateCtrl.hideHelperTab();
	},
	open_helper_tab: function(){
		helperTabStateCtrl.openHelperTab();
	}
}

module.exports = {
	init: function(){
		console.log('initting helper tab DOM watcher');

		$('.js-help-tab').each(function(){
			rivets.bind(
				$(this),
				{ helper_tab: WL_STATE.helper_tab, actions: domActions }
			);
		});

	}
}