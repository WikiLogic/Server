'use strict';

var searchApi = require('../api/search');
var eventManager = require('../utils/event_manager');

/* New arguments do not check state wile they are being authored
 * That would be distracting and might entice people to warp their reasoning to respond to the state
 */

//keep a refrence to all the arguments we create
var newArgumentRefs = {};

var argIdIterator = 0;

var newReason = {
	description: "",
	claimObj: {}
}

var newArgument = {
	reasons: [Object.create(newReason)],
	addReason: function(claimObj){
		var reasonIsValid = true;
		//first check if this reason already exists in the argument
		for (var r = 0; r < this.reasons; r++){//r for reason
			if (this.reasons[r].description == claimObj.description) {
				console.warn('This reason already exists in the new argument');
				reasonIsValid = false;
				break;
			}
		}

		if (reasonIsValid) {
			console.log('adding reason to argument');
			this.reasons.push(claimObj);
		}
	},
	removeReason: function(claimObj){
		for (var r = 0; r < this.reasons; r++){//r for reason
			if (this.reasons[r].description == claimObj.description) {
				this.reasons.splice(r, 1);
			}
		}
	},
	is_valid: false,
	checkArgument: function(){
		//there should be more than one reason
		if (this.reasons.length < 2) {
			this.isValid = false;
			console.warn('not enough reasons in argument');
			return;
		}

		console.log('new argument group is valid');
		//if we've made it this far, it's passed all our checks!
		this.isValid = true;
	},
	show_new_claim_button: false,
	show_results: false,
	has_reasons: false,
	search_term: '',
	search_results: []
}

/* There could be many many places a new argument group is authored (thinking of the node map)
 * So the above is all the individual argument functionality
 * and the below managed which argument to call.
 */
module.exports = {

	getNewState: function(argumentId){
		var returnState = Object.create(newArgument);
		returnState._id = argumentId;
		newArgumentRefs[argumentId] = returnState;
		return returnState;
	},
	getExistingState: function(argumentId){
		return newArgumentRefs[argumentId];
	},
	setNewReason: function(argumentID, term){
		console.log('setting ', argumentID, term);
	},
	enterNewReason: function(argumentId, term){
		console.log('entering ', argumentID, term);

		searchApi.searchByString(term).done(function(data){
			//add to search results
			newArgumentRefs[argumentId].search_results = data;
			eventManager.fire("search_results_set", {owner: argumentId, data: newArgumentRefs[argumentId].search_results});
		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});
	},





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

};