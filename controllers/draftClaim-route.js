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


	/*  ______ _______ _______
 	 * |  ____ |______    |   
	 * |_____| |______    |   
	 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=GET
	 */

	/** GET a draft claim AND all it's supporting / opposing claims / draftClaims
	 * This fails because it trusts the client side for the reasons array.  
	 * Need to get from the DB by ID first.
	 */
	router.post('/get-draft', function(req, res) {

		var draftClaim = req.body.draftClaim; //nope - get it from the DB you mad man!
		console.log('DRAFT CLAIM: ', draftClaim);

		//This object is used to fill in all the details for each reason in each argument
		//It looks like this: { ID:id, side:string, argIndex:int}
		var reasonDataArray = [],
			draftClaimFromDB = {};

		async.waterfall([
			function(callback) {
				//1. get the draft from the DB
				DraftClaim.findOne({_id:req.body.draftClaim._id}).exec(function(err, result){
					if (err) {
						//poop
						callback(err);
					} else {
						draftClaimFromDB = result;
						callback(null);
					}
				});
			},
			function(callback) {
				//2. run through each side, each arg, each reason - build the reasonDataArray
				reasonArrayIterator(draftClaimFromDB, 'supporting');
				reasonArrayIterator(draftClaimFromDB, 'opposing');
				callback(null);
			},
			function(callback) {
				//3. Now the reasonDataArray has been built, run a map async to get all the reasons

				async.map(reasonDataArray, getAndAddReason, function(err, result){
					if (err) {
						callback(err);
					} else {
						callback(null);
					}
				});

				function getAndAddReason(reasonData, mapCallback){
					// thisReason.reasonObj = {};
					// thisReason.side = side;
					// thisReason.argIndex = argIndex;
					// thisReason.reasonIndex = reasonIndex;
					// thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex];
					console.log("1: " + reasonData.ID);
					DraftClaim.findOne({_id:reasonData.ID}).exec(function(err, result){
						if(err){
							mapCallback(err);
						} else {
							//we now hve the reason from the database and it's location in the main draft, 
							//we should add it to the draft
							console.log('2: ' + result); 
							if (result !== null) {
								//sometimes result comes out as null?
								replaceRefWithReason(reasonData, result);
							}
							
						}
						mapCallback(null);
					});
				}

				/**
				 * this uses the data from the reasonDataObject to replace the refrence in the draftClaimFromDB with the reasonFromDb
				 */
				function replaceRefWithReason(reasonDataObject, reasonFromDb){
					//1. check the location provided by the reasonDataObject, if it matches - awesome, if not, we'll have to iterate through everything
					var refID = draftClaimFromDB[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex];
					if (refID == reasonFromDb._id) {
						draftClaimFromDB[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex] = reasonFromDb;
					} else {
						//If this is called it means the array order has been mixed up somehow - we'll have to spend a bit more on computation

						//Iterate through the arguments in the relevent side
						for (var i = 0; i < draftClaimFromDB[reasonDataObject.side].length; i++) {
							//iterate through the reasons in each argument
							for (var j = 0; j < draftClaimFromDB[reasonDataObject.side][i].reasons.length; j++){
								//check to see if the id of the reason in this bit of the main draft matched the reason ID
								if (draftClaimFromDB[reasonDataObject.side][i].reasons[j] == reasonFromDb._id) {
									//we have a match, replace the refrence with the full reason object
									draftClaimFromDB[reasonDataObject.side][i].reasons[j] = reasonFromDb;
								}
							}
						}
					}
				}
			}
		], function (err, result) {
			// result now equals 'done'
			res.status(200).send(draftClaimFromDB);
		});

		/**
		 * This takes the draft claim that has just been returned from the DB, and a side (opposing | supporting)
		 * It then iterates through the args (i) and the reasons (j) and passes the data to the reasonArrayBuilder
		 */
		function reasonArrayIterator(draftObject, side){
			for (var i = 0; i < draftObject[side].length; i++) {
				for (var j = 0; j < draftObject[side][i].reasons.length; j++) {
					reasonArrayBuilder(draftObject, side, i, j);
				}
			}
		}

		/** 
		 * This takes the draft claim from the DB and the iteration details
		 * It then creates an object from all the data and pushes it onto the reasonDataArray
		 */
		function reasonArrayBuilder(draftObject, side, argIndex, reasonIndex){
			var thisReason = {};

			//Set the easy stuff
			thisReason.reasonObj = {};
			thisReason.side = side;
			thisReason.argIndex = argIndex;
			thisReason.reasonIndex = reasonIndex;
			thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex];

			/*if (side == 'supporting'){
				thisReason.ID = draftObject.supporting[argIndex].reasons[reasonIndex];
			} else {
				thisReason.ID = draftObject.opposing[argIndex].reasons[reasonIndex];
			}*/
				
			reasonDataArray.push(thisReason);
		}
	});


	/* ______  _______        _______ _______ _______
	 * |     \ |______ |      |______    |    |______
	 * |_____/ |______ |_____ |______    |    |______
	 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=DELETE
	 */

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
				console.log('1');
				async.map(currentUser.meta.unPublished, removeReasonFromDraft, function(err, result){
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
			console.log('2: ' + draftID);
			//req.body.draftClaimID is the reason we're removing
			//draftID is the ID of the draft we're checking - one of the ones from the users list
			var DraftClaim = require('../models/draftClaim');

			async.waterfall([
				function(callback){
					console.log('2.1: ' + draftID);	

					//DraftClaim.find({'_id': { $in: unPublishedIDarray } }, function(err,drafts){
					//	callback(null, drafts);
					//})

					DraftClaim.find({ '_id' : draftID }, function (err, draftObject) {
						console.log('2.2');
						if(err) {
							console.log('2.3');
							//couldn't find this draft frokm the user's collection?  Probably remove it from the users array?
							callback(null, 'fail'); //what happens to this waterfall? Can I cancel it?
						} else {
							console.log('3: ' + draftObject);
							callback(null, draftObject);
						}
					});
				},
				function(draftToCheck, callback){
					//2. the draft has been returned from the DB, check through it to see if the draft we're deleteing is used in it
					//draftToCheck is a full draft object
					if (draftToCheck == 'fail'){
						callback(null);
					} else {
						console.log('4: ' + draftToCheck);
						var opposingRemoval = false,
							supportingRemoval = false;
						if (draftToCheck.opposing) { opposingRemoval = reasonRemoval(draftToCheck.opposing); }
						if (draftToCheck.supporting) { supportingRemoval = reasonRemoval(draftToCheck.supporting); }

						
						if ( opposingRemoval || supportingRemoval ) {
							console.log('5.1');
							//if either return true, we'll have to save this draftToCheck
							draftToCheck.save(function(err, result){
								if(err) {
									console.log('5.2 error in saving draft after removing refrence to deleted draft from argument group', err);
								} else {
									console.log('5.3');
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
			console.log('4.1 ==================argumentArray: ', argumentArray);
			var reasonFound = false;
			
			//iterate through the groups in the argument list
			for (var groupItr = 0; groupItr < argumentArray.length; groupItr ++) {

				//iterate through the reasons in the group
				for (var reasonItr = 0; reasonItr < argumentArray[groupItr].reasons.length; reasonItr++ ) {
					if (argumentArray[groupItr].reasons[reasonItr]._id == req.body.draftClaimID) {
						//got a match, remove from this argument in this draft and save the draft
						console.log('4.2 =============================================================');
						console.log('This: ', argumentArray[groupItr].reasons[reasonItr]._id);
						console.log('Matches: ', req.body.draftClaimID);
						console.log('4.3 =============================================================');
						console.log('BEFORE: ' + argumentArray[groupItr].reasons);
						argumentArray[groupItr].reasons.splice(reasonItr, 1);
						console.log('AFTER: ' + argumentArray[groupItr].reasons);
						console.log('4.4 =============================================================');
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
