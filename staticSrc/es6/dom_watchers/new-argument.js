'use strict';

/*
 * This module is responsibe for the new arguments form
 */

var newArgumentStateCtrl = require('../state/new_argument');
var actionStateCtrl = require('../state/actions');
var searchApi = require('../api/search');
var claimApi = require('../api/claim');

module.exports = {
	init: function(){
		console.log('initting new argument DOM watcher');


		//for each argument creation form, bind a new argument state object
		$('.js-argument-creation-form').each(function(){
			//first get a newly generated argument creation state
			var newArgumentState = newArgumentStateCtrl.getNewArgument();
			window.rivets.bind(
				$(this),
				{ new_argument: newArgumentState }
			);
		});
		
		actionStateCtrl.addAction('new_reason_keypress', function(rivet, e){
			//this fires with every keypress of the input for the new reason
			var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;

			if (rivet.key == "Enter"){
				//when the user presses enter, run the search. Only let them add a new claim if it doesn't already exist
				var term = rivet.currentTarget.value;
				
				//they're just typing, run the search and send the results to the new argument controller
				searchApi.searchByString(term).done(function(data){
					//add to search results
					newArgumentStateCtrl.setResults(argumentId, term, data);
				}).fail(function(err){
					console.error('search api error: ', err);
					//TODO: send to alerts
				});

			} else {
				//not the enter key - we could start pre fetching results...

			}
		});

		//if a new reason has been typed up & the search has returned no exact matches, the user can add that reason as a new claim
		actionStateCtrl.addAction('save_reason_as_claim', function(rivet){
			console.group('Saving reason as new claim');
			var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
			var newClaimString = newArgumentStateCtrl.getSearchTerm(argumentId);
			claimApi.newClaim(newClaimString).done(function(data){
				console.info('new claim has been added!', data);
				newArgumentStateCtrl.addReason(argumentId, data);
				//add it to this new argument
			}).fail(function(err){
				console.error('new claim api failed', err);

				//send err to the alert system
			});
			console.groupEnd();//END Saving reason as new claim
		});

		actionStateCtrl.addAction('add_reason_to_argument', function(rivet){
			console.group('Adding reason to argument');
			//get the claim ref & argument id

			//send it to the argument state controller
			console.groupEnd(); //END Adding reason to argument
		});

		//This action will add the argument group to a claim
		actionStateCtrl.addAction('save_new_argument', function(rivet){
			console.group('saving New Argument Group');
			var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;
			console.log('TODO: save argument to somewhere');
		
			console.groupEnd();//END adding New Argument Group
		});

	}
}