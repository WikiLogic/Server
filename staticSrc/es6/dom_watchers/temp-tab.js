'use strict';

/* Temp Tab DOM Watcher
 * 
 */
var tempTabStateCtrl = require('../state/temp_tab');
tempTabStateCtrl.init();
var actionStateCtrl = require('../state/actions');


module.exports = {
	init: function(){

		actionStateCtrl.addAction('open_temp_tab', function(rivet){
			tempTabStateCtrl.openTempTab();
		});

		actionStateCtrl.addAction('close_temp_tab', function(rivet){
			tempTabStateCtrl.closeTempTab();
		});

	}
}