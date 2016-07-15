'use strict';

var searchApi = require('../api/search');
var searchResultsStateCtrl = require('../state/search_results');
var actionStateCtrl = require('../state/actions');


var search = function(searchTerm, resultStateId){
	console.log('search submitted:', searchTerm);

	WL_STATE.search_input = searchTerm;

	searchApi.searchByString(searchTerm).done(function(data){
		//send to the search results
		searchResultsStateCtrl.setResults(data, resultStateId);
	}).fail(function(err){
		console.error('search api error: ', err);
		//TODO: send to alerts
	});
}

module.exports = {

	init: function(){
		//so simple it doesn't need a state ctrl
		WL_STATE.search_input = {term:''};

		$('.js-main-search').on('keypress', function(e){
			if (e.keyCode == 13) {
				//get the term to be searched
				var searchTerm = $(this).val();
				//get the id of the search reaults object and pass it through
				var resultStateId = $(this).data('result-state-id');
				//search!
				search(searchTerm, resultStateId);
			}
		});

		actionStateCtrl.addAction('search_this', function(rivet){
			//used by links to help people click to search claims
			search(rivet.target.innerText);
		})
	}

}
