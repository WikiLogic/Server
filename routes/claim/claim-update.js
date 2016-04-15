var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	Claim = require('../../models/claim');

/* _     _  _____  ______  _______ _______ _______
 * |     | |_____] |     \ |_____|    |    |______
 * |_____| |       |_____/ |     |    |    |______
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=UPDATE
 */ 
module.exports = function(req, res) {

	var claimCandidate = req.body.claim,
		claimFromDB = {};
	console.log('TODO: clean input');
	//TODO: clean input
	/*
	var claimCandidate.description = claimCandidate.description;
	claimCandidate.supporting = claimCandidate.supporting;
	claimCandidate.opposing = claimCandidate.opposing;
	claimCandidate.meta = claimCandidate.meta;
	console.log("THIS DRAFT: ", draftToUpdate);
	*/

	//TODO: Test for problems with the claim that got sent: ignore deleted things, reject duplicate argumentGroups

	//TODO get the DB version of this claim
	console.log('0: claim to update: ', claimCandidate);

	async.waterfall([
		function(next){
			//1: get the claim from the db
			Claim.findOne({_id:claimCandidate._id}).exec(function(err, result){
				if (err) {
					//poop
					next(err);
				} else {
					console.log('1: got claim to update: ', result._id);
					claimFromDB = result;
					next(null);
				}
			});
		},
		function(next){
			//2: Check for new argument groups. -- ONLY ADD NEW ARGUMENT GROUPS. No additions to existing groups as this would open the group up for disqualification


			//are there more supporting groups in the new claim?
			if (claimCandidate.supporting.length > claimFromDB.supporting.length){
				console.log('2.1 Adding supporting argument(s)');
				//How many new argument groups?
				var numOfNewForGroups = claimCandidate.supporting.length - claimFromDB.supporting.length;
				//this will be the first position of the new group
				var newForIndex = claimFromDB.supporting.length;
				//add the groups
				for (var n = 0; n < numOfNewForGroups; n++){
					console.log('2.1.1 adding supporting argument: ', claimCandidate.supporting[newForIndex]);
					claimFromDB.supporting[newForIndex] = claimCandidate.supporting[newForIndex];
					//TODO need to pull out the reason ID
					newForIndex++;
				}
			}

			//are there more opposing groups in the new claim?
			if (claimCandidate.opposing.length > claimFromDB.opposing.length){
				
				var numOfNewNorGroups = claimCandidate.opposing.length - claimFromDB.opposing.length;
				var newNorIndex = claimFromDB.opposing.length;
				console.log('2.2 Adding opposing argument(s), n:', numOfNewNorGroups);
				//add the groups
				for (var n = 0; n < numOfNewNorGroups; n++){
					console.log('2.2.1 adding opposing argument');
					claimFromDB.opposing[newNorIndex] = claimCandidate.opposing[newNorIndex];
					newNorIndex++;
				}
			}

			next(null);
		},
		function(next){
			//3: save the updated db object
			console.log('3.1 saving updated object to DB: ', claimFromDB);
			Claim.findByIdAndUpdate(claimFromDB._id, { $set: {supporting:claimFromDB.supporting, opposing:claimFromDB.opposing} }, function(err, responseMeta){
				if(err) {
					console.log('ERROR: ', err);
					res.status(500).send('Error in saving Claim update to database.');
				} else {
					console.log('3.2 responce: ', responseMeta);
					next(null);
				}
			});
			/*
			Claim.update({_id:claimFromDB._id}, claimFromDB, { multi: true }, function(err, responseMeta){
				if(err) {
					console.log('ERROR: ', err);
					res.status(500).send('Error in saving Claim update to database.');
				} else {
					next(null);
				}
			});
			*/


		}
	], function (err, result) {
		// result now equals 'done'
		res.status(200).send(claimFromDB);
	});

};