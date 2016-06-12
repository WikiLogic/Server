//first, init the global state
window.WL_STATE = require('./state/WL_STATE');

$ = jQuery = require('jquery');


var search = require('./dom_watchers/search-input');
console.log('initting search');
search.init();

var tabs = require('./dom_watchers/tabs');
tabs.init();


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