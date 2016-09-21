'use strict';

var searchApi = require('../api/search');
var eventManager = require('../utils/event_manager');

module.exports = {
	init: function(){
		$('.js-search-recent').on('click', function(event){

			var searchId = $(this).data('search-id');

			searchApi.searchMostRecent().done(function(data){
				//send to the search results
				eventManager.fire('search_results_recieved', {owner: searchId, data: {term: 'MOST RECENT', results: data} });
				
			}).fail(function(err){
				console.error('search api error: ', err);
				//TODO: send to alerts
			});	
		});
	}
}