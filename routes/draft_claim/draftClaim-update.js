var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

/* _     _  _____  ______  _______ _______ _______
 * |     | |_____] |     \ |_____|    |    |______
 * |_____| |       |_____/ |     |    |    |______
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=UPDATE
 */ 
module.exports = function(req, res) {

	var draftCandidate = req.body.draftClaim;
		console.log('TODO: clean input');
		//TODO: clean input
		/*
		var draftToUpdate.description = draftCandidate.description;
		draftToUpdate.supporting = draftCandidate.supporting;
		draftToUpdate.opposing = draftCandidate.opposing;
		draftToUpdate.meta = draftCandidate.meta;
		console.log("THIS DRAFT: ", draftToUpdate);
		*/

		console.log('//TODO deal with supporting / opposing - they need to be _id refs not full objects (args as objects? should this change?)');
		//This changed - now supporting reasons have alreayd been saved, we're receiving their full objects, mongose casts to _id
		
		//iterate through supporting arguments
		for (var i = 0; i < draftCandidate.supporting.length; i++) {
			//iterate through arg reasons
			for (var j = 0; j < draftCandidate.supporting[i].reasons.length; j++) {
				console.log('reason: ', draftCandidate.supporting[i].reasons[j].claimObjectRefrence);

			}
		}
		//iterate through opposing arguments
		for (var i = 0; i < draftCandidate.opposing.length; i++){
			console.log('checking opposing args');
			//iterate through arg reasons
			for (var j = 0; j < draftCandidate.supporting[i].reasons.length; j++) {
				console.log('reason: ', draftCandidate.supporting[i].reasons[j].claimObjectRefrence);
			}
		}

		//for some reason, this is giving our supporting array IDs for each object, and it's
		DraftClaim.update({_id:draftCandidate._id}, draftCandidate, { multi: true }, function(err, responseMeta){
			if(err) {
				console.log('ERROR: ', err);
				res.status(500).send('Error in saving new draft Claim to database.');
			} else {
				res.status(200).send(draftCandidate);
			}
		});
};