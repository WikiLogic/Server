'use strict';

var actionStateCtrl = require('../state/actions');

/*
 * This module is responsibe for the editor's claim tabs
 */

module.exports = {
	init: function(presetTabs){

		actionStateCtrl.addAction('editorTabOpen', function(rivet){
			console.log('open editor tab');
		});

		actionStateCtrl.addAction('editorTabClose', function(rivet){
			console.log('close editor tab');
		});

	}
}