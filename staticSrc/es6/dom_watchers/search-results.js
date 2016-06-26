'use strict';

var eventManager = require('../utils/event_manager');
var tabStateCtrl = require('../state/tabs');
var actionStateCtrl = require('../state/actions');
var workingListStateCtrl = require('../state/working_list');

module.exports = {
	init: function(){

		//whenever the search results are set, activate the results tab
		eventManager.subscribe('search_results_set', function(){
			tabStateCtrl.activateTab('editor', 'results');
		});

		actionStateCtrl.addAction('move_result_to_working_list', function(rivet){
			var resultIndex = rivet.currentTarget.attributes['data-result-index'].value;
			var claimObj = WL_STATE.search.results[resultIndex];
			workingListStateCtrl.addClaimToList(claimObj);
		});
	}
}