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
	active: [],
	past: []
};

var alertsStateRef = {};

var removeAlert = function(stateId, alertId){
	for (var a = 0; a < alertsStateRef[stateId].active.length; a++) {
		if (alertsStateRef[stateId].active[a]._id == alertId) {
			var staleAlert = alertsStateRef[stateId].active.splice(a, 1);
			alertsStateRef[stateId].past.push(staleAlert);
			//eventManager.fire('alert_over', {owner: stateId, alert: staleAlert});
		}
	}
}

module.exports = {

	getState(stateId){
		var returnState = stateFactory.create(alertsState);
		returnState._id = stateId;
		alertsStateRef[stateId] = returnState;
		return returnState;
	},
	getExistingState(stateId){
		return alertsStateRef[stateId];
	},
	setAlert(stateId, alertObj){
		alertsStateRef[stateId].active.push(alertObj);

		setTimeout(function(){ 
			//remove alert
			removeAlert(stateId, alertObj._id);
		}, alertsStateRef[stateId].duration);
	}

};