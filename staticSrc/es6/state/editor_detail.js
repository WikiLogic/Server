'use strict';

var eventManager = require('../utils/event_manager');

/* The Editor Detail state controller
 *
 */

module.exports = {

	init: function(){
		WL_STATE.editor_detail = {
			claim: {},
			tab_active: true
		}
	},

	setNewClaimDetail: function(claimObj){
		WL_STATE.editor_detail.claim = claimObj;
	}

};