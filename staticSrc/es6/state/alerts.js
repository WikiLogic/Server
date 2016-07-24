'use strict';

var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

/*
var alertObj = {
	_id: 'anon'
	contentString: "",
	level: 1,
	type: "good","bad"
};
*/

var alertsState = {
	enabled: true,
	level: 1,
	duration: 5000,
	activeAlerts: [],
	pastAlerts: []
};

var alertsStateRef = {};

var removeAlert = function(stateId, alertId){
	for (var a = 0; a < alertsStateRef[stateId].activeAlerts.length; a++) {
		if (alertsStateRef[stateId].activeAlerts[a]._id == alertId) {
			var staleAlert = alertsStateRef[stateId].activeAlerts.splice(a, 1);
			alertsStateRef[stateId].pastAlerts.push(staleAlert);
			eventManager.fire('alert_over', {owner: stateId, alert: staleAlert});
		}
	}
}

module.exports = {

	getNewState: function(stateId){
		var returnState = stateFactory.create(alertsState);
		returnState._id = stateId;
		alertsStateRef[stateId] = returnState;
		console.info('New Alerts State: ', alertsStateRef[stateId]);
		return returnState;
	},
	getExistingState: function(stateId){
		return alertsStateRef[stateId];
	},
	setAlert: function(stateId, alertObj){
		alertsStateRef[stateId].activeAlerts.push(alertObj);

		setTimeout(function(){ 
			//remove alert
			removeAlert(stateId, alertObj._id);
		}, alertsStateRef[stateId].duration);
	}

};