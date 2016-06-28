//first, init the global state
window.WL_STATE = {};

$ = jQuery = require('jquery');

require('./dom_watchers/search-input').init();

var presetTabs = [
	{
		groupName: 'editor',
		tabName: 'welcome',
		tabType: '',
		data: {},
		isTemp: true
	},
	{
		groupName: 'editor',
		tabName: 'results',
		tabType: 'claim_list',
		data: {},
		isTemp: false
	}
]
require('./dom_watchers/tabs').init(presetTabs);
require('./dom_watchers/toaster').init();
require('./dom_watchers/claim-input').init();
require('./dom_watchers/working-list').init();
require('./dom_watchers/search-results').init();
require('./dom_watchers/editor-detail').init();

window.rivets = require('rivets');

//init rivets to drive the dom
rivets.configure({
	prefix: 'view',
	preloadData: true,
	rootInterface: '.',
	templateDelimiters: ['{', '}'],
	handler: function(target, event, binding) {
		//Nothing hapening in this hook other than logging for development
		console.log('->> user interaction: ', binding.keypath);
		//this is required to continue the chain of events
		this.call(target, event, binding.view.models);
	}
});

rivets.bind($('#god'), {state: window.WL_STATE});