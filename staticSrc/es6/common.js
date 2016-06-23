//first, init the global state
window.WL_STATE = require('./state/WL_STATE');
$ = jQuery = require('jquery');

require('./dom_watchers/search-input').init();

var presetTabs = [
	{
		groupName: 'editor',
		tabName: 'found'
	}
]
require('./dom_watchers/tabs').init(presetTabs);
require('./dom_watchers/toaster').init();
require('./dom_watchers/claim-input').init();

window.rivets = require('rivets');

//init rivets to drive the dom
rivets.configure({
	prefix: 'view',
	preloadData: true,
	rootInterface: '.',
	templateDelimiters: ['{', '}'],
	handler: function(target, event, binding) {
		//Nothing hapening in this hook other than logging for development
		console.info('->> user interaction: ', binding.keypath);
		//this is required to continue the chain of events
		this.call(target, event, binding.view.models);
	}
});

rivets.bind($('#god'), {state: window.WL_STATE});