'use strict';

var stateFactory = require('../utils/state_factory');

var userState = {
	gravatar: 'string',
	settings: {
		enabled: true,
		level: 'high',
		duration: 5
	}
}

module.exports = {
	getNewState: function(userId){
		stateFactory.create(userState);
	},
	getExistingState: function(userId){
		
	}
}