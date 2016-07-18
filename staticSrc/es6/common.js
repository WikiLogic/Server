console.groupCollapsed('Initting');

//first, init the global state
window.rivets = require('rivets');
$ = jQuery = require('jquery');
window.WL_STATE = {};

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

//init the globals - these are the perminant bits of state that everyone can see
require('./dom_watchers_global/search-input').init();

//now init the modular elements - there can be any number of these anywhere so we can't attach them to WL_STATE
require('./dom_watchers/new-claim').init();
require('./dom_watchers/toggles').init();

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
require('./dom_watchers/editor-list').init();
require('./dom_watchers/editor-detail').init();
require('./dom_watchers/new-argument').init();

console.groupEnd(); //END Initting