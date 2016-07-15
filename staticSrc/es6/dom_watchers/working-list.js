'use strict';

var actionStateCtrl = require('../state/actions');
var workingListStateCtrl = require('../state/working_list');
workingListStateCtrl.init();
var tabStateCtrl = require('../state/tabs');

/* Working-list DOM watcher
 * This module is responsibe for handling the 'working list'
 * This is a list of claims that live in the editor's sidebar
 * They act like files in Sublime's sidebar - click them to set them as tabs
 */

module.exports = {
	init: function(){

		$('.js-working-list').each(function(){
			console.warn('todo: bind working list');
		});
		

		actionStateCtrl.addAction('add_claim_to_working_list', function(rivet){
			console.groupCollapsed('adding claim to working list');
			var claimFound = false;
			//first we need to get a refrence of the claim object
			//Which list is it in?
			var location = rivet.currentTarget.attributes['data-from-list'].value;
			var claimId =  rivet.currentTarget.attributes['data-claim-id'].value;
			if (location == 'search_results') {
				for (var c = 0; c < WL_STATE.search_results.results.length; c++) { //c for claim
					if (WL_STATE.search_results.results[c]._id == claimId) {
						var claimRef = WL_STATE.search_results.results[c];
						claimFound = true;
						break;
					}
				}
			} else {
				console.error('not set up to pull claims from', location);
			}

			if (claimFound) {
				workingListStateCtrl.addClaimToList(claimRef);
			} else {
				console.warn(claimId, ' not found in ', location);
			}
			console.groupEnd();
		});

	}
}