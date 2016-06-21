'use strict';

var trumbowyg = require('trumbowyg');

module.exports = {
	init: function(){
		console.log('initting trumbowyg');
		$('textarea').trumbowyg({
			prefix: 'trumbowyg-',
			svgPath: false,
			removeformatPasted: true,
			autogrow: true,
			btns: []
		});
	}
}
