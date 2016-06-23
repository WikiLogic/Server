'use strict';

var $ = require('jquery');
var actionStateCtrl = require('../state/actions');

/* Working-list DOM watcher
 * This module is responsibe for handling the 'working list'
 * This is a list of claims that live in the editor's sidebar
 * They act like files in Sublime's sidebar - click to add a temp tab
 * double click to add a permenant tab.
 */

module.exports = {
	init: function(){
		
		actionStateCtrl.addAction('workingListItemClick', function(rivet){
			console.log("rivet: ", rivet);
		});

	}
}