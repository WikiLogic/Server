//first, init the global state
window.WL_STATE = {};

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

$ = jQuery = require('jquery');
console.groupCollapsed('Initting');
require('./dom_watchers/search-input').init();
require('./dom_watchers/new-claim').init();
require('./dom_watchers/search-results').init();
require('./dom_watchers/helper-tab').init();

var presetTabs = [
	{
		groupName: 'editor',
		tabName: 'helper',
		tabType: '',
		data: {}
	}
]
require('./dom_watchers/tabs').init(presetTabs);
require('./dom_watchers/toaster').init();
require('./dom_watchers/claim-input').init();
require('./dom_watchers/working-list').init();
require('./dom_watchers/search-results').init();
require('./dom_watchers/editor-list').init();
require('./dom_watchers/editor-detail').init();
require('./dom_watchers/new-argument').init();

rivets.bind($('#god'), {state: window.WL_STATE});
console.groupEnd(); //END Initting