'use strict';

var alertStateCtrl = require('../state/alerts');
var eventManager = require('../utils/event_manager');


var domActions = {
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
			alertsState.actions = domActions;
			rivets.bind(
				$(this),
				{ alerts: alertsState }
			);
		});
	}
}
