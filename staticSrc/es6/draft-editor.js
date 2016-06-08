require('jquery');

var WL_STATE = require('./state/WL_STATE.js');

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

rivets.bind($('#god'), WL_STATE);