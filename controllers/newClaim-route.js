var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

    var User = require('../models/user'),
    	DraftClaim = require('../models/draftClaim'),
    	Claim = require('../models/claim');

/*          /new-claim
 * =================================
 * This is a server side controller that deals with putting new claims into the Database.
 * This is a protected route, only logged in users may submit new claims
 * 
 */

 	/* SAVE DRAFT CLAIM (new or existing) TO USER PROFILE
 	 * 
 	 */
	router.post('/draft', function(req, res) {
		
		//clean the input?
		var candidateClaim = req.body.draftClaim;
		var currentUser = req.user;

		//is it new or existing?
		if (candidateClaim._id) {
			//the candidate claims to be an existing draft - check if _id matches in user profile.
			console.log('CLAIM ID');
		} else {
			//the candidate does not claim to be an existing draft, save it and add a refrence to the user profile!
			
			//1. Create new draft claim object
			console.log('ONE');
			var draftClaim = new DraftClaim;
			draftClaim.description = candidateClaim.description;
			draftClaim.meta.user = currentUser;

			async.waterfall([
				function(callback){
					//2. save draft claim object to database
					draftClaim.save(function(err){
						if(err) {
							res.status(500).send('Error in saving new draft Claim to database.');
						} else {
							callback(null); //keeps async going
						}
					});
				},
				function(callback){ 
					//3. add draft claim refrence to user's profile and return it to the client
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

		}
	});

	//route to publish an individual claim to the public network
	router.post('/publish', function(req, res){
		//clean the input?
		var candidateClaim = req.body.draftClaim;
		var currentUser = req.user;

		//Does the claim object list any arguments, if not then fail - or not

		//Check the DB - does this claim exist already (check by description), if true then fail, if close then flag
		console.log('candidate claim =================', candidateClaim);

		async.waterfall([
				function(callback) {
					console.log('1: check if there is an identicle claim already published');
					//1: check if there's an identicle claim already published
					Claim.find({'description':candidateClaim.description}).exec(function(err,result){
						if(err) callback(err);

						if (result.length){
							//Can't publish - there is an identical claim
							callback(err);
						} else {
							//didn't find any conflicts, on to the publishing!
							callback(null);
						}
					});
				},
				function(callback) {
					console.log('2: Save draft claim as published claim');
					//2: Save draft claim as published claim
					var newClaim = new Claim;
					newClaim.description = candidateClaim.description;
					newClaim.supporting = candidateClaim.supporting;
					newClaim.opposing = candidateClaim.opposing;
					newClaim.meta = candidateClaim.meta;

					newClaim.save(function(err,result){
						if(err) {
							res.status(500).send('Error in publishing draftClaim to DB.');
						} else {
							callback(null, result);
						}
					});
				},
				function(newPublishedClaim,callback) {
					//3.1: add newClaim to user's published list
					console.log('3: move claim in user lists');
					
					currentUser.meta.published.push(newPublishedClaim._id);
					
					//3.2: remove draftClaim from user's unPublished list
					console.log('killing before:', currentUser.meta.unPublished);
					var killDex = currentUser.meta.unPublished.indexOf(candidateClaim._id);
					currentUser.meta.unPublished.splice(killDex, 1);
					console.log('killing after:', currentUser.meta.unPublished);

					currentUser.save(function(err, result){
						if(err) console.log('error in adding publishd claim to user profile', err);
						console.log('Saved user :D ', result);
						callback(null, newPublishedClaim, result);
					});
				}
			],
			function (err, newPublishedClaim, updatedUser) {//finished!
				if(err) console.error('Error finding claim from newClaim-route.js');
				//return
				returnObj = {
					newClaim: newPublishedClaim,
					newUser: updatedUser
				}
				console.log('Final called :)', returnObj);
				res.status(200).send(returnObj);
			}
		);
	});

	//route for saving an array of claims - for the future!
	router.post('/array', function(req, res) {
		res.send('not implemented yet');
	});


/* Helper functions 
=========================================================================*/

/* isNew() takes a claim object and checks with the db to see if it exists
 * returns true / false
 */
function isNew(claim, profile){
	return true;
}


/* The End!
=========================================================================*/
module.exports = router;
