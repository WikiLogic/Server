'use strict';

var alertStateCtrl = require('../state/alerts');
var eventManager = require('../utils/event_manager');


domActions = {
	close_alert(rivet){
		console.log('cloasing alert!');
	},
	open_alert(rivet){
		console.log('opening alert!');
	}
}

module.exports = {
	init: function(){
		console.log('alerts');
		
		$('.js-alerts').each(function(){
			var alertsId = $(this).data('alerts-id');
			var alertsState = alertStateCtrl.getState(alertsId);
			newEditorTabs.actions = domActions;
			rivets.bind(
				$(this),
				{ editor_tabs: newEditorTabs }
			);
		});
	}
}
