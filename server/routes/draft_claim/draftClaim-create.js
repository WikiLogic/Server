var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

/* _______  ______ _______ _______ _______ _______
 * |       |_____/ |______ |_____|    |    |______
 * |_____  |    \_ |______ |     |    |    |______
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=UPDATE
 */ 
module.exports = function(req, res) {
	console.log('/draft_claim/Create');

	//clean the input?
	var candidateClaim = req.body.draftClaim;
	var currentUser = req.user;
	var usersDraftIDarray = [];

	//1. Create new draft claim object
	var draftClaim = new DraftClaim;
	draftClaim.description = candidateClaim.description;
	draftClaim.meta.author = currentUser._id;

	async.waterfall([
		function(callback){
			//2. check to see if there are any identicle drafts by the current user
			DraftClaim.find({'meta.author': currentUser._id, 'description':draftClaim.description}).exec(function(err,result){
				if(err) console.log(err);
				if (result.length > 0) {
					res.status(500).send('Error: you aready have an identicle draft saved.');
				} else {
					callback(null);
				}
			});
		},
		function(callback){
			//3. save draft claim object to database
			draftClaim.save(function(err){
				if(err) {
					res.status(500).send('Error in saving new draft Claim to database.');
				} else {
					callback(null); //keeps async going
				}
			});
		},
		function(callback){ 
			//4. add draft claim refrence to user's profile and return it to the client
			currentUser.meta.unPublished.push(draftClaim);
			currentUser.save(function(err){
				if(err) {
					res.status(500).send('Error in saving draftClaim to user profile.');
				} else {
					res.status(200).send(draftClaim);
				}
			});
		}
	]);
};