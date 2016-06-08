'use strict';

var $ = require('jquery');

module.exports = {
	init: function(){
		console.log('search initted');
		$('.js-search').on('keypress', function(){
			console.log('search change!');
		});
	}
}