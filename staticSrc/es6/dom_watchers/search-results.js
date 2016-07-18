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

		$('.js-search-results').each(function(){
			//bind the state (don't make a new one for results, only the search input should do that);
			var searchId = $(this).data('search-id');
			var searchState = searchStateCtrl.getExistingState(searchId);
			rivets.bind(
				$(this),
				{ search: searchState, actions: domActions }
			);

		});
	}

}
