var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

    var User = require('../models/user'),
    	DraftClaim = require('../models/draftClaim');

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
					//3. add draft claim refrence to user's profile
					currentUser.meta.unPublished.push(draftClaim);
					currentUser.save(function(err){
						if(err) {
							res.status(500).send('Error in saving draftClaim to user profile.');
						} else {
							res.status(200).send('Draft claim saved and user profile updated!')
						}
					});
				}
			]);

		}
	});

	//route to publish an individual claim to the public network
	router.post('/publish', function(req, res){
		//Clean the claim
		//Does the claim object list any arguments, if not then fail
		//Check the DB - does this claim exist already (check by description), if true then fail, if close then flag
		//seems it's passed, time to save it to the main database!
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
