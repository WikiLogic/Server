'use strict';

/*
 * This module is responsibe for the new arguments form
 */

var newArgumentStateCtrl = require('../state/new_argument'); newArgumentStateCtrl.init();
var actionStateCtrl = require('../state/actions');
var searchApi = require('../api/search');

module.exports = {
	init: function(){
		console.log('initting new argument DOM watcher');
		
		//This action will run the reason / argument validator
		actionStateCtrl.addAction('new_reason_keypress', function(rivet, e){
			var argumentId = rivet.currentTarget.attributes['data-argument-id'].value;

			if (rivet.key == "Enter"){
				newArgumentStateCtrl.addSupportingArgument(argumentId);

			} else {
				
				//they're just typing, run the search and send the results to the new argument controller
				searchApi.searchByString(term).done(function(data){
					//add to search results
					newArgumentStateCtrl.setSupportingResults(argumentId, data);
				}).fail(function(err){
					console.error('search api error: ', err);
					//TODO: send to alerts
				});

			}
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