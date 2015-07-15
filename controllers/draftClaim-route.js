var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

    var User = require('../models/user'),
    	DraftClaim = require('../models/draftClaim'),
    	Claim = require('../models/claim');

/*          /draft-claim
 * =================================
 * This is a server side controller that deals with putting new claims into the Database.
 * This is a protected route, only logged in users may submit new claims
 * 
 */

 	/* 
 	 * SAVE DRAFT CLAIM (new or existing) TO USER PROFILE
 	 */
	router.post('/new', function(req, res) {
		
		//clean the input?
		var candidateClaim = req.body.draftClaim;
		var currentUser = req.user;
		var usersDraftIDarray = [];
			
		//1. Create new draft claim object
		console.log('CANDIDATE CLAIM ', candidateClaim);
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
	});

	//route to update an existing draft claim
	router.post('/update', function(req, res) {
		
		var draftCandidate = req.body.draftClaim;
		console.log('UPDATING DRAFT: ', draftCandidate);
		//TODO: clean input
		/*
		var draftToUpdate.description = draftCandidate.description;
		draftToUpdate.supporting = draftCandidate.supporting;
		draftToUpdate.opposing = draftCandidate.opposing;
		draftToUpdate.meta = draftCandidate.meta;
		console.log("THIS DRAFT: ", draftToUpdate);
		*/

		//TODO deal with supporting / opposing - they need to be _id refs not full objects (args as objects? should this change?)
		//This changed - now supporting reasons have alreayd been saved, we're receiving their full objects, mongose casts to _id
		
		//iterate through supporting arguments
		for (var i = 0; i < draftCandidate.supporting.length; i++) {
			console.log('checking supporting args');
			//iterate through arg reasons
			for (var j = 0; j < draftCandidate.supporting[i].reasons.length; j++) {
				console.log('reason: ', draftCandidate.supporting[i].reasons[j]);

			}
		}
		//iterate through opposing arguments
		for (var i = 0; i < draftCandidate.opposing.length; i++){
			console.log('checking opposing args');
			//iterate through arg reasons
			for (var j = 0; j < draftCandidate.supporting[i].reasons.length; j++) {
				console.log('reason: ', draftCandidate.supporting[i].reasons[j]);
			}
		}

		//for some reason, this is giving our supporting array IDs for each object
		DraftClaim.update({_id:draftCandidate._id}, draftCandidate, { multi: true }, function(err, responseMeta){
			if(err) {
				console.log('ERROR: ', err);
				res.status(500).send('Error in saving new draft Claim to database.');
			} else {
				console.log("DRAFT SAVED: ", responseMeta);
				res.status(200).send(responseMeta);
			}
		});

	});


	//GET a draft claim AND all it's supporting / opposing claims / draftClaims
	router.post('/get-draft', function(req, res) {


		//----------------------------------------------------------------------
		console.log('getting: ', req.body.draftClaim);
		var draftClaim = req.body.draftClaim;
		console.log('POPULATING: ', draftClaim.supporting[0].reasons);
		var currentUser = req.user;

		//got the full draft object, now to populate it :D (but do we get the reason IDs?)
		//iterate through supporting args
		for (var i = 0; i < draftClaim.supporting.length; i++) {
			console.log('supporting original: ', draftClaim.supporting[i].reasons);
			console.log('supporting replaced: ', reasonArrayToObjectIds(draftClaim.supporting[i].reasons));
		}
		//iterate through opposing
		for (var i = 0; i < draftClaim.supporting.length; i++) {

		}

		function reasonArrayToObjectIds(reasonArray){
			var newObjIDarray = [];
			for (var i = 0; i < reasonArray.length; i++) {
				var objID = new mongoose.Types.ObjectId(reasonArray[i]);
				newObjIDarray.push(objID);
			}
			return newObjIDarray;
		}
		//------------------------------------------------------------------------
		

		//async each will perform the find in parallel for each reason ID object
		//give the object the ID, Side, and ArgIndex
		var reasonIDs = [];
		/* going to build an array of objects like this:
			{
				ID : 
				side : 
				argIndex :
			}
		*/

		//iterate through the supporting reasons and add them to the object array
		for (var i = 0; i < draftClaim.supporting.length; i++) {
			for (var j = 0; j < draftClaim.supporting[i].reasons.length; j++) {
				buildReasonsObject('supporting', i, j);
			}
		}

		//iterate through the opposing reasons and add them to the object array
		for (var i = 0; i < draftClaim.opposing.length; i++) {
			for (var j = 0; j < draftClaim.opposing[i].reasons.length; j++) {
				buildReasonsObject('opposing', i, j);
			}
		}

		//this is the function that adds the specific details to the object array
		function buildReasonsObject(side, argIndex, reasonIndex){
			var thisReason = {};

			//Set the easy stuff
			thisReason.side = side;
			thisReason.argIndex = argIndex;
			thisReason.reasonIndex = reasonIndex;

			//set the ID
			if (side == 'supporting'){
				thisReason.ID = draftClaim.supporting[argIndex].reasons[reasonIndex];
			} else {
				thisReason.ID = draftClaim.opposing[argIndex].reasons[reasonIndex];
			}
				
			reasonIDs.push(thisReason);
		}
		
		//for each object in the object array, go find a claim in the DB
		async.each(reasonIDs, function(singleReason, callback) {

			console.log('finding this reason: ', singleReason);
			DraftClaim.find({_id:draftClaim.supporting[i].reasons[j]}).exec(function(err, result){
				if(err){callback(err);}
				console.log('found one!', result);
				//TODO add result to responce object

				callback();
			});
			
		}, function(err){

			if( err ) {
				// If one of the iterations adds an arg to the callback, everything stops and that arg is this err
				console.log('A reason failed to be found');
			} else {
				console.log('SUCCESS!');
				//TODO return responce to client
			}

		});
	});


	//DELETE a draft claim, double check on the client side
	router.post('/delete', function(req, res) {
		console.log('deleting: ', req.body.draftClaimID);
		var currentUser = req.user;
		

		async.waterfall([
			function(callback){
				//1. Delete draft claim
				DraftClaim.find({'_id':req.body.draftClaimID}).remove().exec(function(err,result){
					if(err) res.status(500).send('DB error in deleting draftClaim');
					callback(null);
				});
			},
			function(callback){
				//2.1 remove from user's list of drafts
				var killDex = currentUser.meta.unPublished.indexOf(req.body.draftClaimID);
				currentUser.meta.unPublished.splice(killDex, 1);

				//2.2 Save modification of user to db
				currentUser.save(function(err, result){
					if(err) console.log('error in adding publishd claim to user profile', err);
					console.log('Saved user :D ', result);
					res.status(200).send();
				});
			}
		]);
	});

	//route to publish an individual claim to the public network
	router.post('/publish', function(req, res){
		//clean the input?
		var candidateClaim = req.body.draftClaim;
		var currentUser = req.user;

		async.waterfall([
				function(callback) {
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
					currentUser.meta.published.push(newPublishedClaim._id);
					
				//3.2: remove draftClaim from user's unPublished list
					var killDex = currentUser.meta.unPublished.indexOf(candidateClaim._id);
					currentUser.meta.unPublished.splice(killDex, 1);

				//3.3: save updated user profile to db
					currentUser.save(function(err, result){
						if(err) console.log('error in adding publishd claim to user profile', err);
						console.log('Saved user :D ', result);
						callback(null, newPublishedClaim);
					});
				}
			],
			function (err, newPublishedClaim) {//finished!
				if(err) console.error('Error finding claim from newClaim-route.js');
				//return the new claim to be put into the published list client side
				res.status(200).send(newPublishedClaim);
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
