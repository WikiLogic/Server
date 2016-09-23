'use strict';

var searchResultsStateCtrl = require('../state/search_results');
var eventManager = require('../utils/event_manager');


var domActions = {
	toggle_favorite(rivet, binding){
		if (binding.claim.is_starred) {
			binding.claim.is_starred = false;
			eventManager.fire('claim_unstarred', {owner:binding.search._id, data:{claim:binding.claim}});
		} else {
			binding.claim.is_starred = true;
			eventManager.fire('claim_starred', {owner:binding.search._id, data:{claim:binding.claim}});
		}
	},
	open_in_editor(rivet, binding){
		console.log('open this in the editor: ', binding.claim);
	},
	open_in_nodemap(rivet, binding){
		console.log('open this in the nodemap: ', binding.claim);
	}
}

module.exports = {

	init: function(){
		console.log('search-results');
		$('.js-search-results').each(function(){
			//bind the state (don't make a new one for results, only the search input should do that);
			var searchId = $(this).data('search-id');
			var searchState = searchResultsStateCtrl.getState(searchId);
			searchState.actions = domActions;
			rivets.bind(
				$(this),
				{ search: searchState }
			);

		});

		eventManager.subscribe('search_results_recieved', function(event){
			searchResultsStateCtrl.setTerm(event.owner, event.data.term);
			searchResultsStateCtrl.setResults(event.owner, event.data.results);
		});

		eventManager.subscribe('new_claim_published', function(event){
			if (event.owner == "main_results") {
				searchStateCtrl.addResult("main_results", event.data);
			}
		});

		eventManager.subscribe('new_claims_found', function(event){
			if (event.owner == "main_results") {
				for (var r = 0; r < event.data.length; r++) {
					searchStateCtrl.addResult("main_results", event.data[r]);
				}
			}
		});
	}

}
