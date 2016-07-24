'use strict';

var searchApi = require('../api/search');
var eventManager = require('../utils/event_manager');

/* New arguments do not check state wile they are being authored
 * That would be distracting and might entice people to warp their reasoning to respond to the state
 */


var newArgumentState = {
	search_term: '',
	search_results: [],
	reasons: [],
	isValid: false
}

var newArgumentRefs = {};

var argHasReason = function(argumentId, claimId){
	for (var r = 0; r < newArgumentRefs[argumentId].reasons.length; r++){//r for reason
		if (newArgumentRefs[argumentId].reasons[r]._id == claimId) {
			return true;
		}
	}
	return false;
}

/* There could be many many places a new argument group is authored (thinking of the node map)
 * So the above is all the individual argument functionality
 * and the below managed which argument to call.
 */
module.exports = {

	getNewState: function(argumentId){
		var returnState = Object.create(newArgumentState);
		returnState._id = argumentId;
		newArgumentRefs[argumentId] = returnState;
		eventManager.fire('new_argument_state_created', {owner: argumentId, data: newArgumentRefs[argumentId]});
		return returnState;
	},
	hasExistingState: function(argumentId){
		return newArgumentRefs.hasOwnProperty(argumentId);
	},
	getExistingState: function(argumentId){
		return newArgumentRefs[argumentId];
	},
	setNewReason: function(argumentID, term){
		console.log('setting ', argumentID, term);
	},
	enterNewReason: function(argumentId, term){
		console.log('argumentId: ', argumentId);
		searchApi.searchByString(term).done(function(data){
			//add to search results
			console.log('setting results: ', data);
			console.log('to new id: ', argumentId);
			newArgumentRefs[argumentId].search_results = data;

			if (data.length > 0) {
				newArgumentRefs[argumentId].show_results = true;
			} else {
				newArgumentRefs[argumentId].show_results = false;
			}
			eventManager.fire("search_results_set", {owner: argumentId, data: newArgumentRefs[argumentId].search_results});

		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});
	},
	getClaimFromSearch: function(argumentId, claimId) {
		for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++) {
			if (newArgumentRefs[argumentId].search_results[r]._id == claimId) {
				return newArgumentRefs[argumentId].search_results[r];
			}
		}
	},
	addReason: function(argumentId, claimObj) {
		//first check if that reason already exists in this argument
		if (!argHasReason(argumentId, claimObj._id)) {
			newArgumentRefs[argumentId].reasons.push(claimObj);
			//now tidy up - remove the reason if it is in the results
			for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++){
				if (newArgumentRefs[argumentId].search_results[r]._id == claimObj._id) {
					newArgumentRefs[argumentId].search_results.splice(r, 1);
					break;
				}
			}
			eventManager.fire('new_argument_new_reason', {owner: argumentId, data: claimObj});
		}
	},
	removeReason: function(argumentId, claimId){
		for (var r = 0; r < newArgumentRefs[argumentId].reasons.length; r++){
			if (newArgumentRefs[argumentId].reasons[r]._id == claimId) {
				//remove it
				var removedReason = newArgumentRefs[argumentId].reasons.splice(r, 1);
				//but push it into the search results - kind of like a last chance, just in case that was a mistake
				newArgumentRefs[argumentId].search_results.push(removedReason[0]);
				break;
			}
		}
		eventManager.fire('new_argument_reason_removed', {owner: argumentId, data: removedReason});
	}

/*



	setResults: function(argumentID, searchTerm, resultsArray){
		console.log('setting search results for argument group:', argumentName, resultsArray);
		if (newArguments.hasOwnProperty(argumentID)) {
			newArguments[argumentID].search_results = resultsArray;
			newArguments[argumentID].search_term = searchTerm;

			if (resultsArray.length > 0) {
				newArguments[argumentID].show_results = true;
				var exactMatchFound = false;
				for (var r = 0; r < resultsArray.length; r++) {
					if (resultsArray[r].description == searchTerm) {
						exactMatchFound = true;
						break;
					}
				}
				newArguments[argumentID].show_new_claim_button = !exactMatchFound;
			} else {
				newArguments[argumentID].show_new_claim_button = true;
				newArguments[argumentID].show_results = false;
			}
		} else {
			console.warn('That argument creation form doesn\'t have any state :(');
		}
	},
	getSearchTerm: function(argumentID){
		if (newArguments.hasOwnProperty(argumentID)) {
			return newArguments[argumentID].search_term;
		}
		console.warn('That argument creation form has no state :(');
	},
	addReason: function(argumentName, claimObj){
		console.log('adding reason to argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].addReason.call(WL_STATE.new_arguments[argumentName], claimObj);
	},
	removeReason: function(argumentName, claimObj){
		console.log('removing reason from argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].removeReason.call(WL_STATE.new_arguments[argumentName], claimObj);
	},
	checkArgument: function(argumentName){
		console.log('checking argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].checkArgument.call(WL_STATE.new_arguments[argumentName]);
	},
	getArgument: function(argumentName){
		console.log('get argument group:', argumentName);
		return WL_STATE.new_arguments[argumentName];
	},
	clearArgument: function(argumentName){
		console.log('clearing argument group:', argumentName);
	},
	*/

};