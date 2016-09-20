'use strict';

var Snap = require('snapsvg');
var eventManager = require('../utils/event_manager');
var map = {};

module.exports = {
	init: function(){
		console.log('node map');
		map = Snap('#svg');

		var vQuadLine = map.line(0,-1000,0,1000);
		var hQuadLine = map.line(-1000,0,1000,0);
		var focusedArg = map.rect(-250, -250, 500, 500);
	}
}
