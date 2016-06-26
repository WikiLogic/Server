'use strict';

var eventManager = require('../utils/event_manager');

/* The Editor Detail state controller
 *
 */

var setNewClaimDetail = function(claimObj){
	WL_STATE.editor_detail.claim = claimObj;
}

module.exports = {

	init: function(){
		WL_STATE.editor_detail = {
			claim: {},
			show: false
		};

		//also, subscribe to tab changes, just in case they decide to open an 'editor' tab, sneeky 
		eventManager.subscribe('tab_opened', function(tab){
			if (tab.type == 'claim') {
				//now send the claim object to the editor, wait, I AM EDITOR
				setNewClaimDetail(tab.data);
				WL_STATE.editor_detail.show = true;
			} else {
				WL_STATE.editor_detail.show = false;
			}
		});
	},

	setNewClaimDetail: function(claimObj){
		setNewClaimDetail(claimObj);
	}

};