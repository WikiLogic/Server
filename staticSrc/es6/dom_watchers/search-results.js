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

		actionStateCtrl.addAction('add_to_working_list', function(rivet){
			var claimObj = {
				description: 'todo - get claim object from search results'
			};
			workingListStateCtrl.addClaimToList(claimObj);
		});
	}
}