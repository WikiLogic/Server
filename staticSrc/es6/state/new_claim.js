'use strict';

/* New Claim State Ctrl
 */

var eventManager = require('../utils/event_manager');

module.exports = {

	init: function(){
		console.log('initting new claim state controller');

		WL_STATE.new_claim = {
			description: '',
			show: false
		};

		//listen for a new search term being set, if they don't find it they'll probably want to make a new one
		eventManager.subscribe('search_term_set', function(searchTerm){
			WL_STATE.new_claim.description = searchTerm;
		});

		//listen to the search results. If non are set, open me!!!
		eventManager.subscribe('search_results_set', function(resultsArray){
			var searchTerm = WL_STATE.search_input.term;
			//show if there are no results
			if (resultsArray.length < 1) {
				WL_STATE.new_claim.show = true;
			} else {
				//also show if no results match
				var hasExactMatch = false;
				for (var r = 0; r < resultsArray.length; r++){
					if (resultsArray[r].description == searchTerm) { //TODO - remove this cheekyness
						hasExactMatch = true;
						WL_STATE.new_claim.show = false;
						break;
					}
				}

				if (!hasExactMatch) {
					WL_STATE.new_claim.show = true;
				}	
			}
			
		});
	},
	setDescription: function(newDescription){
		WL_STATE.new_claim.description = newDescription;
	},
	getDescription: function(){
		return WL_STATE.new_claim.description;
	}

};