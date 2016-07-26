'use strict';

/*
 * This module is responsibe for the welcome tab
 */

var helperTabStateCtrl = require('../state/helper_tab'); helperTabStateCtrl.init();
var actionStateCtrl = require('../state/actions');


module.exports = {
	init: function(){
		console.log('initting helper tab DOM watcher');

		actionStateCtrl.addAction('close_helper_tab', function(rivet){
			helperTabStateCtrl.hideHelperTab();
		});

		actionStateCtrl.addAction('open_helper_tab', function(rivet){
			helperTabStateCtrl.openHelperTab();
		});

	}
}