'use strict';

/* Current Editor DOM Watcher
 * This takes care of setting which claim is to be displayed in the body of the editor.
 * It also deals with the interactions from that claim
 */

var editorDetailStateCtrl = require('../state/editor_detail');

module.exports = {
	init: function(){
		editorDetailStateCtrl.init();

		
	}
}