'use strict';

var $ = require('jquery');
var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');
var actionStateCtrl = require('../state/actions');
searchStateCtrl.init();

var search = function(term){
	console.group('search submitted');
	searchStateCtrl.setNewTerm(term);

	searchApi.searchByString(term).done(function(data){
		//add to search results
		searchStateCtrl.setResults(data);
	}).fail(function(err){
		console.error('search api error: ', err);
		//TODO: send to alerts
	});
	console.groupEnd();
}

module.exports = {

	init: function(){
		$('.js-search').on('keypress', function(e){
			if (e.keyCode == 13) {
				search($(this).val());
			}
		});

		actionStateCtrl.addAction('search_this', function(rivet){
			//used by links to help people click to search claims
			search(rivet.target.innerText);
		})
	}

}
