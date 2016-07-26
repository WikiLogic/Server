'use strict';

var editorListStateCtrl = require('../state/editor_list'); editorListStateCtrl.init();
var actionStateCtrl = require('../state/actions');

/*
 * This module is responsibe for the editor's claim tabs
 */

module.exports = {
	init: function(presetTabs){
		console.log('initting editor list DOM watcher');

		actionStateCtrl.addAction('editor_tab_open', function(rivet){
		console.group('open editor tab');
			var claimId = rivet.currentTarget.attributes['data-claimtab-id'].value;
			editorListStateCtrl.openClaimTab(claimId);
		console.groupEnd();
		});

		actionStateCtrl.addAction('editor_tab_close', function(rivet){
		console.group('close editor tab');
			var claimId =  rivet.currentTarget.attributes['data-claimtab-id'].value;
			editorListStateCtrl.removeClaimFromList(claimId);
		console.groupEnd();
		});

		actionStateCtrl.addAction('add_claim_to_editor_list', function(rivet){
		console.groupCollapsed('adding claim to editor list');
			var claimFound = false;
			//first we need to get a refrence of the claim object
			//Which list is it in?
			var location = rivet.currentTarget.attributes['data-from-list'].value;
			var claimId =  rivet.currentTarget.attributes['data-claim-id'].value;
			if (location == 'working_list') {
				for (var c = 0; c < WL_STATE.working_list.claims.length; c++) { //c for claim
					if (WL_STATE.working_list.claims[c]._id == claimId) {
						var claimRef = WL_STATE.working_list.claims[c];
						claimFound = true;
						break;
					}
				}
			} else {
				console.error('not set up to pull claims from', location);
			}

			if (claimFound) {
				editorListStateCtrl.addClaimToList(claimRef);
			} else {
				console.warn(claimId, ' not found in ', location);
			}
		console.groupEnd();
		});

	}
}