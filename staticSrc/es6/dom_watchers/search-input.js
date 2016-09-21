'use strict';

var eventManager = require('../utils/event_manager');

module.exports = {

	init: function(){
		console.log('search-input');

		$('.js-search').on('keypress', function(e){
			if (e.keyCode == 13) {
				var searchTerm = $(this).val();
				var searchId = $(this).data('search-id');
				eventManager.fire('search_term_submitted', {owner: searchId, data: { term: searchTerm} });
				//searchStateCtrl.setTerm(searchId, searchTerm);
				//searchStateCtrl.runSearch(searchId, searchTerm);
			}
		});
		
		/*
		$('.js-search-suggestion').each(function(){
			$(this).on('click', function(){
				var searchId = $(this).data('search-id');
				var searchTerm = $(this).html();
				searchStateCtrl.setTerm(searchId, searchTerm);
				searchStateCtrl.runSearch(searchId, searchTerm);
			});
		});
		*/
	}

}
