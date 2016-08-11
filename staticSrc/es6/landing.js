$ = jQuery = require('jquery');
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

require('./dom_watchers/login-signup').init();
require('./dom_watchers/tabs').init();

$(window).on('keypress', function(e){
	if (e.keyCode == 13) {
	console.log('KEY:', e);
		$('button').click();
	}
});