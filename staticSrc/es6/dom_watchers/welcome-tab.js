'use strict';

/*
 * This module is responsibe for the welcome tab
 */

var welcomeTabStateCtrl = require('../state/welcome_tab'); welcomeTabStateCtrl.init();
var actionStateCtrl = require('../state/actions');


module.exports = {
	init: function(){

		actionStateCtrl.addAction('close_welcome_tab', function(rivet){
			welcomeTabStateCtrl.hideWelcomeTab();
		});

		actionStateCtrl.addAction('open_welcome_tab', function(rivet){
			welcomeTabStateCtrl.openWelcomeTab();
		});

	}
}