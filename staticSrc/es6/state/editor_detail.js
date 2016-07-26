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
		console.log('initting editor detail state controller');
		WL_STATE.editor_detail = {
			show: false,
			claim: {},
			new_for: {
				is_valid: false,
				reasons: [
					{

					}
				]
			},
			new_against: {
				is_valid: false,
				reasons: [{}]
			}
		};

		eventManager.subscribe('claim_tab_closed', function(claimObj){
			WL_STATE.editor_detail.show = false;
		});

		eventManager.subscribe('claim_tab_opened', function(claimObj){
			setNewClaimDetail(claimObj);
			WL_STATE.editor_detail.show = true;
		});
	},

	setNewClaimDetail: function(claimObj){
		setNewClaimDetail(claimObj);
	},

	addSupportingArgument: function(){
		console.log('stubbing new supporting argument group');
		WL_STATE.editor_detail.claim.supporting.push({
			status:false,
			reasons: []
		});
	},
	addOpposingArgument: function(){
		console.log('stubbing new opposing argument group');
		WL_STATE.editor_detail.claim.opposing.push({
			status:false,
			reasons: []
		});
	}

};