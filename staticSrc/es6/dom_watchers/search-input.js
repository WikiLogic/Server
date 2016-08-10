'use strict';

var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');


var domActions = {
	search_this(rivet){
		//get the search id
		//send the search
		console.warn('TODO ', rivet);
	},
	get_most_critical(rivet){
		var searchId = rivet.currentTarget.attributes['data-search-id'].value;
		searchStateCtrl.searchMostCritical(searchId);
	},
	get_most_capricious(rivet){
		var searchId = rivet.currentTarget.attributes['data-search-id'].value;
		searchStateCtrl.searchMostCapricious(searchId);
	},
	get_most_recent(rivet){
		console.log("getting most recent!!");
		var searchId = rivet.currentTarget.attributes['data-search-id'].value;
		searchStateCtrl.searchMostRecent(searchId);
	}
}

module.exports = {

	init: function(){
		console.log('search-input');
		$('.js-search').each(function(){
			//bind the state
			var searchId = $(this).data('search-id');
			var searchState = searchStateCtrl.getState(searchId);
			searchState.actions = domActions;
			rivets.bind(
				$(this),
				{ search: searchState }
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

		$('.js-explore').each(function(){
			var searchId = $(this).data('search-id');
			var searchState = searchStateCtrl.getState(searchId);
			searchState.actions = domActions;
			rivets.bind(
				$(this),
				{ search: searchState }
			);
		});

		$('.js-explore-button').on('click', function(){
			$(this).siblings('.js-explore-menu').toggle();
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
