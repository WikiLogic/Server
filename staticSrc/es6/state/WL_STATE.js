'use strict';

var WL_STATE = {};

WL_STATE.user = require('./user'); //get user init from state.user.js

module.exports = {
	user : {
		gravatar: 'string',
		drafts_list: {
			items: []
		},
		claim_list: {
			items: []
		},
		trashed_list: {
			items: []
		} 
	},
	search: {
		term: 'search term',
		results: [],
		order: 'the order',
		selectedResult: {}
	},
	alerts: {
		settings: {
			enabled: true,
			level: 5,
			duration: 5000
		},
		items: []
	},
	display: {
		claim_list: {
			items: []
		}
	}
};