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

	/* _     _  _____  ______  _______ _______ _______
	 * |     | |_____] |     \ |_____|    |    |______
	 * |_____| |       |_____/ |     |    |    |______
	 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=UPDATE
	 */        

	 /**
	  * route to update an existing draft claim.
	  */                                       
	router.post('/update', function(req, res) {
		
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

		//This object is used to fill in all the details for each reason in each argument
		//It looks like this: { ID:id, side:string, argIndex:int}
		var reasonDataArray = [],
			draftClaimFromDB = {},
			draftClaimToReturn = {};

		async.waterfall([
			function(callback) {
				//1. get the draft from the DB
				DraftClaim.findOne({_id:req.body.draftClaim._id}).exec(function(err, result){
					if (err) {
						//poop
						callback(err);
					} else {
						draftClaimFromDB = result;
						draftClaimToReturn = JSON.stringify(result);
						draftClaimToReturn = JSON.parse(draftClaimToReturn);
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
					// thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;
					DraftClaim.findOne({_id:reasonData.ID}).exec(function(err, result){
						if(err){
							mapCallback(err);
						} else {
							//we now hve the reason from the database and it's location in the main draft, 
							//we should add it to the draft 
							if (result !== null) {
								//sometimes result comes out as null?
								replaceRefWithReason(reasonData, result);
							}
							
						}
						mapCallback(null);
					});
				}

				/**
				 * this uses the data from the reasonDataObject (which holds info about where the reason is) to replace the refrence in the 
				 * draftClaimFromDB (which is the working draft that does not yet have any of the reasons populated) with the reasonFromDb (which
				 * has the data that we will populate the reason with).
				 * NEEDS FIXING ==========================================================================================================================
				 */
				function replaceRefWithReason(reasonDataObject, reasonFromDb){
					
					//1. check the location provided by the reasonDataObject, if it matches - awesome, if not, we'll have to iterate through everything
					//get the id stored in the current working draft for this reason
					//var refID = JSON.stringify(draftClaimFromDB[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence);
					var refID = draftClaimFromDB[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence;
					refID = JSON.stringify(refID);
					var reasonID = JSON.stringify(reasonFromDb._id);
					var reasonString = JSON.stringify(reasonFromDb);

					if (refID == reasonID) {
						//awesome, lets populate the current working draft
						
						console.log('old ref: ', draftClaimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence);
						console.log('reasonFromDb: ', reasonFromDb);

						draftClaimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence = reasonFromDb;//reasonFromDb;
						
						console.log('new obj: ', draftClaimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence);
					
					} else {
						//If this is called it means the array order has been mixed up somehow - we'll have to spend a bit more on computation
						//Iterate through the arguments in the relevent side
						for (var i = 0; i < draftClaimFromDB[reasonDataObject.side].length; i++) {
							//iterate through the reasons in each argument
							for (var j = 0; j < draftClaimFromDB[reasonDataObject.side][i].reasons.length; j++){
								//check to see if the id of the reason in this bit of the main draft matched the reason ID
								refID = JSON.stringify(draftClaimFromDB[reasonDataObject.side][i].reasons[j].claimObjectRefrence);

								if (refID == reasonID) {
									//we have a match, replace the refrence with the full reason object
									draftClaimToReturn[reasonDataObject.side][i].reasons[j].claimObjectRefrence = reasonFromDb;
								}
							}
						}
					}
				}

			}
		], function (err, result) {
			// result now equals 'done'
			res.status(200).send(draftClaimToReturn);
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
			thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;

			reasonDataArray.push(thisReason);
		}
	});


	/* ______  _______        _______ _______ _______
	 * |     \ |______ |      |______    |    |______
	 * |_____/ |______ |_____ |______    |    |______
	 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=DELETE
	 */

	/** DELETE a draft claim, hence forth known as "Del Boy"
	 * 1. We must delete Del Boy from the DB.
	 * 2. We must delete the refrence to Del Boy from the user's object.
	 * 3. We must also check any other draftclaims that belong to this user as they may also hold refrences to Del Boy.
	 * 4. We must inform the client as to our success.
	 */
	router.post('/delete', function(req, res) {
		var currentUser = req.user;
		
		async.waterfall([
			function(callback){
				//1. Delete Del Boy from the database
				DraftClaim.find({'_id':req.body.draftClaimID}).remove().exec(function(err,result){
					if(err){
						res.status(500).send('DB error in deleting draftClaim', err);
					} 
					//success, move onto the next step
					callback(null);
				});
			},
			function(callback){
				//2.1 find and remove the refrence to Del Boy from user's object
				var killDex = currentUser.meta.unPublished.indexOf(req.body.draftClaimID);
				currentUser.meta.unPublished.splice(killDex, 1);

				//2.2 Save the modification of the user's object to the db
				currentUser.save(function(err, result){
					if(err){
						console.log('error in removing Del Boy from the user\'s profile', err);
					} 
					//success, move onto the next step
					callback(null);
				});
			},
			function(callback){
				//3. Check through all the other draftclaim objects belonging to this user for refrences to Del Boy
				async.map(currentUser.meta.unPublished, removeReasonFromDraft, function(err, result){
					res.status(200).send();
				});
			}
		]);

		/**
		 * 3(cont). removing refrences to Del Boy from the user's other draftclaims
		 * This function is called from the async.map above for every draftclaim by this user.
		 * It takes the ID of each draftclaim (we already know the ID of Del Boy: req.body.draftClaimID)
		 */
		function removeReasonFromDraft(draftID, mapCallback){
			//draftID is the ID of the draft we're checking - one of the ones from the users list
			var DraftClaim = require('../models/draftClaim');

			/**
			 * There's a bit of a process, so we're waterfalling it
			 * 3.1 get this draftclaim from the DB
			 * 3.2 check through all it's arguments and their reasons
			 * 3.3 If changed, save.
			 */

			async.waterfall([
				function(callback){
					//3.1 get this draftclaim from the DB
					DraftClaim.find({ '_id' : draftID }, function (err, draftObject) {
						if(err) {
							console.log('could not find draft in user collection');
							//couldn't find this draft from the user's collection?  Probably remove it from the users array?
							callback(null, 'fail'); //what happens to this waterfall? Can I cancel it?
						} else {
							callback(null, draftObject);
						}
					});
				},
				function(draftToCheck, callback){
					//3.2 check through all it's arguments and their reasons
					//draftToCheck is an array with one object
					if (draftToCheck == 'fail'){
						callback(null);
					} else {
						//These let us know if we need to save this draft
						var opposingRemoval = false,
							supportingRemoval = false;

						//only try the removal if there are arguments
						if (draftToCheck[0].opposing.length > 0) { 
							opposingRemoval = reasonRemoval(draftToCheck[0].opposing);
						}

						if (draftToCheck[0].supporting.length > 0) { 
							supportingRemoval = reasonRemoval(draftToCheck[0].supporting);
						}

						//this is where we check if the above functions have removed a refrence to the deleted draftclaim from any of the user's other draftclaims
						if ( opposingRemoval || supportingRemoval ) {
							//if either return true, we'll have to save this draftToCheck

							//draftToCheck is an object
							var updatedDraftObject = new DraftClaim(draftToCheck[0]);
							// updatedDraftObject._id = draftToCheck._id;
							// updatedDraftObject.meta = draftToCheck.meta;
							// updatedDraftObject.opposing = draftToCheck.opposing;
							// updatedDraftObject.supporting = draftToCheck.supporting;
							// updatedDraftObject.status = draftToCheck.status;
							// updatedDraftObject.axiom = draftToCheck.axiom;
							// updatedDraftObject.description = draftToCheck.description;


							DraftClaim.findById(draftToCheck[0]._id, function (err, dbDraftClaim) {
								if (err) {
									console.log('error in getting draft again: ', err);
								} else {
									dbDraftClaim._id = draftToCheck[0]._id;
									dbDraftClaim.meta = draftToCheck[0].meta;
									dbDraftClaim.opposing = draftToCheck[0].opposing;
									dbDraftClaim.supporting = draftToCheck[0].supporting;
									dbDraftClaim.status = draftToCheck[0].status;
									dbDraftClaim.axiom = draftToCheck[0].axiom;
									dbDraftClaim.description = draftToCheck[0].description;
									dbDraftClaim.save(function (err) {
										if (err) {
											console.log('error in saving draft again: ', err);
										} else {
											callback(null);
										}
									});
								}
							});

						} else {
							//neithr returned true, so hopefully this means the deleted draft was not found to be refrenced in any of the users claims.
							callback(null);
						}
					}
					
					
				},
				function(callback){
					//3.3 If the deleted draft was found - save it.
					mapCallback(null);
				}
			]);

		}

		
		/**
		 * This takes an array of arguments (either supporting or opposing)
		 * It will iterate through the arguments and their reasons
		 * for each reason, we check wither it is a refrence to the deleted draftclaim
		 */
		function reasonRemoval(argumentArray){
			var reasonFound = false;
			
			//iterate through the groups in the argument list
			for (var groupItr = 0; groupItr < argumentArray.length; groupItr ++) {

				//iterate through the reasons in the group
				for (var reasonItr = 0; reasonItr < argumentArray[groupItr].reasons.length; reasonItr++ ) {
					if (argumentArray[groupItr].reasons[reasonItr] == req.body.draftClaimID) {
						//got a match, remove from this argument in this draft and save the draft
						argumentArray[groupItr].reasons.splice(reasonItr, 1);
						reasonFound = true; //if there's a match
					}
				}
			}
			return reasonFound;
		}
	});

	//route to publish an individual claim to the public network
	//todo, add false to 'draft' in the meta object
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
