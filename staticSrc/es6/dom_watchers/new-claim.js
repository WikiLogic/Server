'use strict';

/*
 * This module is responsibe for the new claim
 */

var newClaimStateCtrl = require('../state/new_claim'); newClaimStateCtrl.init();
var actionStateCtrl = require('../state/actions');
var searchApi = require('../api/search');
var searchResultsStateCtrl = require('../state/search_results');
var workingListStateCtrl = require('../state/working_list');
var claimApi = require('../api/claim');

module.exports = {
	init: function(){
		console.log('initting new claim DOM watcher');
		
		actionStateCtrl.addAction('new_claim_keypress', function(rivet, e){
			//this fires with every keypress of the input for the new reason
			var term = rivet.currentTarget.value;
			newClaimStateCtrl.setDescription(term);

			if (rivet.key == "Enter"){
				console.group('New Claim Form Enter: ', term);
				//when the user presses enter, run the search. Only let them add a new claim if it doesn't already exist
				searchApi.searchByString(term).done(function(data){
					//add to search results
					searchResultsStateCtrl.setResults(data);
				}).fail(function(err){
					console.error('search api error: ', err);
					//TODO: send to alerts
				});
				console.groupEnd();//END New Claim Form Enter

			} else {
				//not the enter key - we could start pre fetching results...

			}
		});

		//if a new reason has been typed up & the search has returned no exact matches, the user can add that reason as a new claim
		actionStateCtrl.addAction('save_new_claim', function(rivet){
			var newClaimString = newClaimStateCtrl.getDescription();
			console.group('Saving new claim: ', newClaimString);
			claimApi.newClaim(newClaimString).done(function(data){
				console.info('new claim has been added!', data);
				//add it to the working list and open in detail (add it to the workin glist twice hehe!)
				workingListStateCtrl.addClaimToList(data); //first time adds it to the working list
				workingListStateCtrl.addClaimToList(data); //Second time, the working list will pop in into the detail and open the tab for us. EASy WIN :D
			}).fail(function(err){
				console.error('new claim api failed', err);

				//send err to the alert system
			});
			console.groupEnd();//END Saving reason as new claim
		});

	}
}