'use strict';

module.exports = {

	init: function(){
		WL_STATE.alerts = {
			settings: {
				enabled: true,
				level: 'high',
				duration: 5000
			},
			active_alerts: [],
			history: []
		}
	},

	setNewTerm: function(newterm){
		WL_STATE.search.term = newterm;
	},

	setResults: function(resultsArray){
		WL_STATE.search.results = resultsArray;
	}

};