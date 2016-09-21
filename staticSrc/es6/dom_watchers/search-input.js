'use strict';

var searchApi = require('../api/search');
var eventManager = require('../utils/event_manager');

module.exports = {
	init: function(){

		$('.js-search').on('keypress', function(e){
			if (e.keyCode == 13) {
				var searchTerm = $(this).val();
				var searchId = $(this).data('search-id');

				searchApi.searchByString(searchTerm).done(function(data){
					//send to the search results
					eventManager.fire('search_results_recieved', {owner: searchId, data: {term: searchTerm, results: data} });
					
				}).fail(function(err){
					console.error('search api error: ', err);
					//TODO: send to alerts
				});	
			}
		});

	}
}
