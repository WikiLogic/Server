'use strict';

/* New Claim State Ctrl
 */

var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');
var claimApi = require('../api/claim');

var newClaimState = {
	show: false,
	description: '',
	valid: true
}

var newClaimRefs = {};

module.exports = {

	getNewState(newClaimId){
		var returnState = stateFactory.create(newClaimState);
		returnState._id = newClaimId;
		newClaimRefs[newClaimId] = returnState;
		return returnState;
	},
	getExistingState(newClaimId){
		return newClaimRefs[newClaimId];
	},
	setDescription(newClaimId, newDescription){
		newClaimRefs[newClaimId].description = newDescription;
	},
	getDescription(newClaimId){
		return newClaimRefs[newClaimId].description;
	},
	publishClaim(newClaimId){
		console.warn('TODO: publish new claim', newClaimRefs[newClaimId].description);
		claimApi.newClaim(newClaimRefs[newClaimId].description).done(function(publishedClaim){
			newClaimRefs[newClaimId].description = '';
			newClaimRefs[newClaimId].show = false;
			if (Array.isArray(publishedClaim)) {
				//we've somehow managed to try and publish a claim that already exists, and the server is returning one or many matching claims
				eventManager.fire('new_claims_found', {owner: newClaimId, data:publishedClaim});
			} else {
				eventManager.fire('new_claim_published', {owner: newClaimId, data:publishedClaim});
			}
		}).fail(function(err){
			console.error('publishing new claim failed: ', err);
		});
	},
	show(newClaimId){
		newClaimRefs[newClaimId].show = true;
	},
	hide(newClaimId){
		newClaimRefs[newClaimId].show = false;
	}

};