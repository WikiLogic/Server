'use strict';

var actionStateCtrl = require('../state/actions');
var workingListStateCtrl = require('../state/working_list');
workingListStateCtrl.init();
var tabStateCtrl = require('../state/tabs');
var editorDetailStateCtrl = require('../state/editor_detail');

/* Working-list DOM watcher
 * This module is responsibe for handling the 'working list'
 * This is a list of claims that live in the editor's sidebar
 * They act like files in Sublime's sidebar - click to add a temp tab
 * double click to add a permenant tab.
 */

module.exports = {
	init: function(){
		
		actionStateCtrl.addAction('set_claim_detail_tab', function(rivet){
			var workingListIndex = rivet.currentTarget.attributes['data-index'].value;
			var claimObj = WL_STATE.working_list.claims[workingListIndex];
			
			//add temp tab
			tabStateCtrl.addTempTabToGroup('editor', {
				tabName: claimObj.description,
				tabType: 'claim',
				data: claimObj
			});

			//set content
			editorDetailStateCtrl.setNewClaimDetail(claimObj);
		});

	}
}