'use strict';

var alertStateCtrl = require('../state/alerts');
var actionStateCtrl = require('../state/actions');
alertStateCtrl.init();

module.exports = {
	init: function(){

		actionStateCtrl.addAction('clearalert', function(rivet){
			console.warn("TODO: clear alert");
		});
	}
}
