'use strict';

var actionStateCtrl = require('../state/actions');

/*
 * This module is responsibe for the editor's claim tabs
 */

module.exports = {
	init: function(presetTabs){

		actionStateCtrl.addAction('editorTabOpen', function(rivet){
			console.log('open editor tab');
		});

		actionStateCtrl.addAction('editorTabClose', function(rivet){
			console.log('close editor tab');
		});

		actionStateCtrl.addAction('add_claim_to_editor_list', function(rivet){
			var workingListIndex = rivet.currentTarget.attributes['data-index'].value;
			var claimObj = WL_STATE.working_list.claims[workingListIndex];
			
			//add temp tab
			tabStateCtrl.addTempTabToGroup('editor', {
				tabName: claimObj.description,
				tabType: 'claim',
				data: claimObj
			});
		});

	}
}