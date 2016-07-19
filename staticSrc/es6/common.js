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

//now init the modular elements - there can be any number of these anywhere so we can't attach them to WL_STATE
require('./dom_watchers/search-input').init();
require('./dom_watchers/search-results').init();
require('./dom_watchers/new-claim').init();
require('./dom_watchers/toggles').init();
require('./dom_watchers/editor-tabs').init();





require('./dom_watchers/tabs').init();
require('./dom_watchers/toaster').init();
require('./dom_watchers/claim-input').init();
require('./dom_watchers/working-list').init();
require('./dom_watchers/editor-detail').init();

console.groupEnd(); //END Initting