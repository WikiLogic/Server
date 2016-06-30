'use strict';

var $ = require('jquery');
var searchInputStateCtrl = require('../state/search_input'); searchInputStateCtrl.init();
var searchApi = require('../api/search');
var searchResultsStateCtrl = require('../state/search_results');
var actionStateCtrl = require('../state/actions');


var search = function(term){
	console.group('search submitted:', term);
	searchInputStateCtrl.setNewTerm(term);

	searchApi.searchByString(term).done(function(data){
		//add to search results
		searchResultsStateCtrl.setResults(data);
	}).fail(function(err){
		console.error('search api error: ', err);
		//TODO: send to alerts
	});
	console.groupEnd(); //END search submitted
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
