'use strict';

var eventManager = require('../utils/event_manager');
var tabStateCtrl = require('../state/tabs');
var actionStateCtrl = require('../state/actions');
var workingListStateCtrl = require('../state/working_list');

module.exports = {
	init: function(){

		//whenever the search results are set, activate the results tab (which is what this guy is watching)
		eventManager.subscribe('search_results_set', function(){
			console.log('search_results_set subscriber (search results dom watcher), requesting "results tab"');
			tabStateCtrl.activateTab('editor', 'results');
		});

		actionStateCtrl.addAction('move_result_to_working_list', function(rivet){
			console.group('action function: sending claim to working list');
			var resultIndex = rivet.currentTarget.attributes['data-result-index'].value;
			console.log('resultIndex: ', resultIndex);
			var claimObj = WL_STATE.search.results[resultIndex];
			workingListStateCtrl.addClaimToList(claimObj);
			console.groupEnd();
		});
	}
}