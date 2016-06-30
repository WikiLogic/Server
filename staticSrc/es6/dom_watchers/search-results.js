'use strict';

/* Search results tab and content DOM watcher
 *
 */

var eventManager = require('../utils/event_manager');
var tabStateCtrl = require('../state/tabs');
var actionStateCtrl = require('../state/actions');
var workingListStateCtrl = require('../state/working_list');

module.exports = {
	init: function(){

		//whenever the search results are set, activate the results tab (which is what this guy is watching)
		eventManager.subscribe('search_results_set', function(){
			console.log('search_results_set subscriber (search results dom watcher), requesting "results tab"');
			tabStateCtrl.addTabToTabGroup('editor', {
				tabName: 'results',
				tabType: '',
				data: {}
			});
		});

		actionStateCtrl.addAction('move_result_to_working_list', function(rivet){
			console.groupCollapsed('Sending claim to working list');
			var resultIndex = rivet.currentTarget.attributes['data-result-index'].value;
			console.log('resultIndex: ', resultIndex);
			var claimObj = WL_STATE.search.results[resultIndex];
			console.log('claimObj: ', claimObj)
			workingListStateCtrl.addClaimToList(claimObj);
			console.groupEnd();
		});
	}
}