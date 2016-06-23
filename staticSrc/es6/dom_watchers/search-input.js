'use strict';

var $ = require('jquery');
var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');


module.exports = {

	init: function(){
		$('.js-search').on('keypress', function(e){
			console.log('search change!', e);
			
			if (e.keyCode == 13) {
				searchApi.searchByString($(this).val(), searchStateCtrl.setResults);
			}
		});
	}

}
