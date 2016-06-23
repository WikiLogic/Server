'use strict';

/* This module is required by the common.js file and there is applied to window
 * It creates the global state object 'WL_STATE'.
 */

module.exports = {
	ui: {
		tabs: {}
	},
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