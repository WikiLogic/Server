'use strict';

/* Search results tab and content DOM watcher
 *
 */

var searchResultsStateCtrl = require('../state/search_results'); searchResultsStateCtrl.init();
var actionStateCtrl = require('../state/actions');


module.exports = {
	init: function(){
		console.log('initting search results DOM watcher');
		

		actionStateCtrl.addAction('close_results_tab', function(rivet){
			searchResultsStateCtrl.hideResultsTab();
		});

		actionStateCtrl.addAction('open_results_tab', function(rivet){
			searchResultsStateCtrl.openResultsTab();
		});

	}
}