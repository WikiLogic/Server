'use strict';

/* Search results tab and content DOM watcher
 *
 */

var searchResultsStateCtrl = require('../state/search_results');
var actionStateCtrl = require('../state/actions');

module.exports = {
	init: function(){
		console.log('initting search results DOM watcher');
		//this state is so simple it doesn't need a state ctrl
		WL_STATE.search_results_tab = {
			open: false,
			results: searchResultsStateCtrl.getNewState('main_results')
		}

		actionStateCtrl.addAction('close_results_tab', function(rivet){
			WL_STATE.search_results_tab.open = false;
		});

		actionStateCtrl.addAction('open_results_tab', function(rivet){
			WL_STATE.search_results_tab.open = true;
		});
	}
}