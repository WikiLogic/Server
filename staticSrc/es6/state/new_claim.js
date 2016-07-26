'use strict';

/* New Claim State Ctrl
 */

var eventManager = require('../utils/event_manager');
var stateFactory = require('../utils/state_factory');

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
		console.info('New Claim State: ', newClaimRefs[newClaimId]);
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
		console.warn('TODO: publish new claim');
	},
	show(newClaimId){
		newClaimRefs[newClaimId].show = true;
	},
	hide(newClaimId){
		newClaimRefs[newClaimId].show = false;
	}

};