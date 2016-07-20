'use strict';

/* New Claim State Ctrl
 */

var eventManager = require('../utils/event_manager');

var newClaimState = {
	show: false,
	description: '',
	valid: true
}

var newClaimRefs = {};

module.exports = {

	getNewState: function(newClaimId){
		var returnState = Object.create(newClaimState);
		returnState._id = newClaimId;
		newClaimRefs[newClaimId] = returnState;
		return returnState;
	},
	getExistingState(newClaimId){
		return newClaimRefs[newClaimId];
	},
	setDescription: function(newClaimId, newDescription){
		newClaimRefs[newClaimId].description = newDescription;
	},
	getDescription: function(newClaimId){
		return newClaimRefs[newClaimId].description;
	},
	publishClaim: function(newClaimId){
		console.warn('TODO: publish new claim');
	},
	show: function(newClaimId){
		newClaimRefs[newClaimId].show = true;
	},
	hide: function(newClaimId){
		newClaimRefs[newClaimId].show = false;
	}

};