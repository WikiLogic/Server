'use strict';

/* Current Editor DOM Watcher
 * This takes care of setting which claim is to be displayed in the body of the editor.
 * It also deals with the interactions from that claim
 */

var editorDetailStateCtrl = require('../state/editor_detail'); editorDetailStateCtrl.init();
var actionStateCtrl = require('../state/actions');

module.exports = {
	init: function(){
		console.log('initting editor detail DOM watcher');
		editorDetailStateCtrl.init();

		
	}
}