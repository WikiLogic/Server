'use strict';

var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');
var actionStateCtrl = require('../state/actions');


var domActions = {
	search_this: function(rivet){
		//get the search id
		//send the search
	}
}

module.exports = {

	init: function(){

		$('.js-search').each(function(){
			//bind the state
			var searchId = $(this).data('search-id');
			var searchState = searchStateCtrl.getNewState(searchId);
			rivets.bind(
				$(this),
				{ search: searchState, actions: domActions }
			);

			//now watch for keypresses:
			$(this).on('keypress', function(e){
				var searchTerm = $(this).val();
				var searchId = $(this).data('search-id');

				if (e.keyCode == 13) {
					searchStateCtrl.setTerm(searchId, searchTerm);
					searchStateCtrl.runSearch(searchId, searchTerm);
				} else {
					searchStateCtrl.setTerm(searchId, searchTerm);
				}
			});
		});

		$('.js-search-suggestion').each(function(){
			$(this).on('click', function(){
				var searchId = $(this).data('search-id');
				var searchTerm = $(this).html();
				searchStateCtrl.setTerm(searchId, searchTerm);
				searchStateCtrl.runSearch(searchId, searchTerm);
			});
		});
	}

}
