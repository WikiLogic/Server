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
				res.status(200).send(draftCandidate);
			}
		});

	});


	//GET a draft claim AND all it's supporting / opposing claims / draftClaims
	router.post('/get-draft', function(req, res) {

		var draftClaim = req.body.draftClaim;
		console.log('DRAFT CLAIM: ', draftClaim);


		//async each will perform the find in parallel for each reason ID object
		//give the object the ID, Side, and ArgIndex
		var reasonDataArray = [];
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
			thisReason.reasonObj = {};

			//set the ID
			if (side == 'supporting'){
				thisReason.ID = draftClaim.supporting[argIndex].reasons[reasonIndex];
			} else {
				thisReason.ID = draftClaim.opposing[argIndex].reasons[reasonIndex];
			}
				
			reasonDataArray.push(thisReason);
		}
		
		//for each object in the object array, go find a claim in the DB
		async.each(reasonDataArray, function(singleReason, callback) {

			console.log('finding this reason: ', singleReason.ID);

			//Don't think single reason is getting passed into the findOne function
			DraftClaim.findOne({_id:singleReason.ID}).exec(function(err, result){
				if(err){callback(err);}
				//console.log('found one!', result);
				//TODO add result to responce object

				//this is the side (supporting / opposing)
				//draftClaim[singleReason.side]
				console.log('THIS SIDE: ', singleReason.side);

				//Iterte through the array of argument objects on the relevant side
				for (var i = 0; i < draftClaim[singleReason.side].length; i++) {
					console.log('In Arg ', i);
					//iterate through the reasons within the argument object
					for (var j = 0; j < draftClaim[singleReason.side][i].reasons.length; j++){

						console.log('Checking: ', draftClaim[singleReason.side][i].reasons[j], 'aginst', result._id);
						if (draftClaim[singleReason.side][i].reasons[j] == result._id) {
							console.log('OLD: ', draftClaim[singleReason.side][i].reasons[j]);
							console.log('NEW: ', result);
							draftClaim[singleReason.side][i].reasons[j] = result;
							break;
						}
					}
					console.log('finding the  bit to add the reason data into.');
					
				}

				callback();
			});
			
		}, function(err){

			if( err ) {
				// If one of the iterations adds an arg to the callback, everything stops and that arg is this err
				console.log('A reason failed to be found');
			} else {
				console.log('SUCCESS!', draftClaim);
				res.status(200).send(draftClaim);
				//TODO return responce to client
			}

		});
	});


	/** DELETE a draft claim, 
	 * This also removes refrences to the deleted draft from any other drafts
	 * in this user's profile.
	 */
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
					//console.log('Saved user :D ', result);
					callback(null);
				});
			},
			function(callback){
				//3. Remove the draft from any other drafts in which it has been used

				//run through the users draft list
				/*
				for (var draftItr = 0; draftItr < currentUser.meta.unPublished.length; draftItr++) {
					console.log('===========currentUser.meta.unPublished[itr]: ', currentUser.meta.unPublished[draftItr]);
					usersDraftIDArray.push(currentUser.meta.unPublished[draftItr]);
					//currentUser.meta.unPublished[draftItr] is just the ID of the draft - more async fun! Yeay!

					//Return ID to build an array for async
					//argumentIterator(currentUser.meta.unPublished[draftItr].opposing);
					//argumentIterator(currentUser.meta.unPublished[draftItr].supporting);
				}
				*/
				//Removes draft from any other drafts in which it might be used.  Resolves when all are complete.
				console.log('1');
				async.map(currentUser.meta.unPublished, removeReasonFromDraft(), function(err, result){
					console.log('8');
					res.status(200).send();
				});

				

			}
		]);

		/**
		 * If the ID of the draft that's being deleted is found inside the given Draft
		 * that reason is removed and the draft is saved.
		 */
		function removeReasonFromDraft(draftID, mapCallback){
			console.log('2');
			//req.body.draftClaimID is the reason we're removing
			//draftID is the ID of the draft we're checking - one of the ones from the users list
			async.waterfall([
				function(callback){
					console.log('2.1');	
					//1. Get the draft from the DB
					DraftClaim.find({'_id':draftID}).exec(function(err,result){
						console.log('2.2');
						if(err) {
							console.log('2.3');
							//couldn't find this draft frokm the user's collection?  Probably remove it from the users array?
							callback(null, 'fail'); //what happens to this waterfall? Can I cancel it?
						} else {
							console.log('3');
							callback(null, result);
						}
					});
				},
				function(draftToCheck, callback){
					//2. the draft has been returned from the DB, check through it to see if the draft we're deleteing is used in it
					//draftToCheck is a full draft object
					if (draftToCheck == 'fail'){
						callback(null);
					} else {
						console.log('4');
						//var opposingRemoval = reasonRemoval(draftToCheck.opposing);
						//var supportingRemoval = reasonRemoval(draftToCheck.supporting);
						var opposingRemoval = false;
						var supportingRemoval = false;

						
						if ( opposingRemoval || supportingRemoval ) {
							//if either return true, we'll have to save this draftToCheck
							draftToCheck.save(function(err, result){
								if(err) {
									console.log('error in saving draft after removing refrence to deleted draft from argument group', err);
								} else {
									console.log('5');
									callback(null);
								}
							});
						} else {
							console.log('6');
							//neighr returned true, so hopefully this means the deleted draft was not found to be refrenced in any of the users claims.
							callback(null);
						}
					}
					
					
				},
				function(callback){
					console.log('7');
					//3. If the deleted draft was found - save it.
					mapCallback(null);
				}
			]);

		}

		
		
		function reasonRemoval(argumentArray){
			console.log('==================argumentArray: ', argumentArray);
			var reasonFound = false;
			
			//iterate through the groups in the argument list
			for (var groupItr = 0; groupItr < argumentArray.length; groupItr ++) {

				//iterate through the reasons in the group
				for (var reasonItr = 0; reasonItr < argumentArray[groupItr].reasons.length; reasonItr++ ) {
					if (argumentArray[groupItr].reasons[reasonItr]._id == req.body.draftClaimID) {
						//got a match, remove from this argument in this draft and save the draft
						console.log('=============================================================');
						console.log('This: ', argumentArray[groupItr].reasons[reasonItr]._id);
						console.log('Matches: ', req.body.draftClaimID);
						console.log('=============================================================');
						console.log('BEFORE: ' + argumentArray[groupItr].reasons);
						argumentArray[groupItr].reasons.splice(reasonItr, 1);
						console.log('AFTER: ' + argumentArray[groupItr].reasons);
						console.log('=============================================================');
						reasonFound = true; //if there's a match
					}
				}
			}
			return reasonFound;
		}
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
