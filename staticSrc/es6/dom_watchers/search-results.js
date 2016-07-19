'use strict';

var searchApi = require('../api/search');
var searchStateCtrl = require('../state/search');
var actionStateCtrl = require('../state/actions');


var domActions = {
	result_clicked: function(rivet){
		//get the search id
		var searchId = rivet.currentTarget.attributes['data-search-id'].value;
		var claimId = rivet.currentTarget.attributes['data-claim-id'].value;
		//tell the state
		searchStateCtrl.result_clicked(searchId, claimId);
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
