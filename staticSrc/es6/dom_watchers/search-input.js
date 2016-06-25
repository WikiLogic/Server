'use strict';

var $ = require('jquery');
var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');
searchStateCtrl.init();

module.exports = {

	init: function(){
		$('.js-search').on('keypress', function(e){
			console.log('search change!', e);
			
			if (e.keyCode == 13) {
				searchStateCtrl.setNewTerm($(this).val());

				searchApi.searchByString($(this).val()).done(function(data){
					//add to search results
					searchStateCtrl.setResults(data);
				}).fail(function(err){
					console.error('search api error: ', err);
					//TODO: send to alerts
				});
			}
		});
	}

}
