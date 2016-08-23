'use strict';

var Snap = require('snapsvg');
var eventManager = require('../utils/event_manager');
var map = {};

module.exports = {
	init: function(){
		console.log('node map');
		map = Snap('#svg');

		var vQuadLine = s.line(0,-1000,0,1000);
		var hQuadLine = s.line(-1000,0,1000,0);
		var focusedArg = s.rect(-250, -250, 500, 500);
	}
}
