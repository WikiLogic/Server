'use strict';

var searchApi = require('../api/search');
var claimApi = require('../api/claim');
var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

/* New arguments do not check state wile they are being authored
 * That would be distracting and might entice people to warp their reasoning to respond to the state
 */


var newArgumentState = {
	_id: 'anon',
	parent_claim: {},
	search_term: '',
	search_results: [],
	show_results: false,
	show_new_claim_form: false,
	reasons: [],
	show_reasons: false,
	is_valid: false
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

var resetArgument = function(argumentId) {
	newArgumentRefs[argumentId].search_term = '';
	newArgumentRefs[argumentId].search_results = [];
	newArgumentRefs[argumentId].reasons = [];
	updateStatuses(argumentId);
}
var updateStatuses = function(argumentId){

	//make sure the parent claim or any of the reasons aren't set in the search results
	for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++) {
		//we're in a searcj result, now check it against the parent
		if (newArgumentRefs[argumentId].search_results[r].description == newArgumentRefs[argumentId].parent_claim.description) {
			newArgumentRefs[argumentId].search_results.splice(r, 1);
			r--;
		}
		//also check it against all the reasons that are already set
		for (var r2 = 0; r2 < newArgumentRefs[argumentId].reasons.length; r2++) {
			if (newArgumentRefs[argumentId].search_results[r].description == newArgumentRefs[argumentId].reasons[r2].description) {
				newArgumentRefs[argumentId].search_results.splice(r, 1);
				r--;
			}
		}
	}

	//now check that none of the reasons are actually somehow the parent
	for (var r = 0; r < newArgumentRefs[argumentId].reasons.length; r++) {
		if (newArgumentRefs[argumentId].reasons[r].description == newArgumentRefs[argumentId].parent_claim.description) {
			newArgumentRefs[argumentId].reasons.splice(r, 1);
			r--;
		}
	}

	//after all that - are there any results left?
	if (newArgumentRefs[argumentId].search_results.length > 0) {
		newArgumentRefs[argumentId].show_results = true;
	} else {
		newArgumentRefs[argumentId].show_results = false;
	}

	//are there any exact matches?
	if (newArgumentRefs[argumentId].search_results.length > 0) {
		newArgumentRefs[argumentId].show_new_claim_form = true;
		for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++) {
			if (newArgumentRefs[argumentId].search_results[r].description == newArgumentRefs[argumentId].search_term) {
				//found a match!
				newArgumentRefs[argumentId].show_new_claim_form = false;
				break;
			}
		}
		//also check in the reasons for an exact match
		for (var r = 0; r < newArgumentRefs[argumentId].reasons.length; r++) {
			if (newArgumentRefs[argumentId].reasons[r].description == newArgumentRefs[argumentId].search_term) {
				//found a match!
				newArgumentRefs[argumentId].show_new_claim_form = false;
				break;
			}
		}
	} else {
		newArgumentRefs[argumentId].show_new_claim_form = false;
	}

	//are there any reasons?
	if (newArgumentRefs[argumentId].reasons.length > 0) {
		newArgumentRefs[argumentId].show_reasons = true;
	} else {
		newArgumentRefs[argumentId].show_reasons = false;
	}

	//do the reasons make a valid argument?
	if (newArgumentRefs[argumentId].reasons.length > 1) {
		newArgumentRefs[argumentId].is_valid = true;
	} else {
		newArgumentRefs[argumentId].is_valid = false;
	}

}

/* There could be many many places a new argument group is authored (thinking of the node map)
 * So the above is all the individual argument functionality
 * and the below managed which argument to call.
 */
module.exports = {

	getNewState(argumentId){
		var returnState = stateFactory.create(newArgumentState);
		returnState._id = argumentId;
		newArgumentRefs[argumentId] = returnState;
		eventManager.fire('new_argument_state_created', {owner: argumentId, data: newArgumentRefs[argumentId]});
		return returnState;
	},
	hasExistingState(argumentId){
		return newArgumentRefs.hasOwnProperty(argumentId);
	},
	getExistingState(argumentId){
		return newArgumentRefs[argumentId];
	},
	setNewReason(argumentId, term){
		newArgumentRefs[argumentId].search_term = term;
		newArgumentRefs[argumentId].show_new_claim_form = false;
	},
	enterNewReason(argumentId, term){
		newArgumentRefs[argumentId].search_term = term;
		searchApi.searchByString(term).done(function(data){
			//add to search results
			newArgumentRefs[argumentId].search_results = data;

			if (data.length > 0) {
				newArgumentRefs[argumentId].show_results = true;
			} else {
				newArgumentRefs[argumentId].show_results = false;
			}
			updateStatuses(argumentId);
			eventManager.fire("search_results_set", {owner: argumentId, data: newArgumentRefs[argumentId].search_results});

		}).fail(function(err){
			console.error('search api error: ', err);
			//TODO: send to alerts
		});
	},
	getClaimFromSearch(argumentId, claimId) {
		for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++) {
			if (newArgumentRefs[argumentId].search_results[r]._id == claimId) {
				return newArgumentRefs[argumentId].search_results[r];
			}
		}
	},
	addReason(argumentId, claimObj) {
		//first check if that reason already exists in this argument
		if (!argHasReason(argumentId, claimObj._id)) {
			console.info('newArgumentRefs: ', newArgumentRefs);
			newArgumentRefs[argumentId].reasons.push(claimObj);
			//now tidy up - remove the reason if it is in the results
			for (var r = 0; r < newArgumentRefs[argumentId].search_results.length; r++){
				if (newArgumentRefs[argumentId].search_results[r]._id == claimObj._id) {
					newArgumentRefs[argumentId].search_results.splice(r, 1);
					break;
				}
			}
			updateStatuses(argumentId);
			eventManager.fire('new_argument_new_reason', {owner: argumentId, data: claimObj});
		}
	},
	removeReason(argumentId, claimId){
		for (var r = 0; r < newArgumentRefs[argumentId].reasons.length; r++){
			if (newArgumentRefs[argumentId].reasons[r]._id == claimId) {
				//remove it
				var removedReason = newArgumentRefs[argumentId].reasons.splice(r, 1);
				//and push it back into the search results (in case that was a mistake, this will be an easy way to get it back);
				newArgumentRefs[argumentId].search_results.push(removedReason[0]);
				break;
			}
		}
		updateStatuses(argumentId);
		eventManager.fire('new_argument_reason_removed', {owner: argumentId, data: removedReason});
	},
	saveTermAsClaim(argumentId){
		var term = newArgumentRefs[argumentId].search_term;

		claimApi.newClaim(term).done(function(data){
			console.log('data!', data);
			newArgumentRefs[argumentId].reasons.push(data);
			updateStatuses(argumentId);
			eventManager.fire('new_argument_new_reason', {owner: argumentId, data: data});
		}).fail(function(err){
			console.error('API fail', err);
		});
	},
	publishArgument(argumentId){
		//how did the server want this again?
		var argObj = {
			reasons: newArgumentRefs[argumentId].reasons,
			claimId: newArgumentRefs[argumentId].parent_claim._id,
			side: (argumentId.startsWith('new_for'))
		};

		if (argumentId.startsWith('new_for')) {
			argObj.side = "s";
		} else {
			argObj.side = "o";
		}

		claimApi.newArgument(argObj).done(function(data){
			resetArgument(argumentId);
			eventManager.fire('claim_updated_new_argument', {owner:argumentId, data: data});
		}).fail(function(err){
			console.error('Update claim fail: ', err);
		});
	}
};