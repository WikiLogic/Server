var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

/*  ______ _______ _______
 * |  ____ |______    |   
 * |_____| |______    |   
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=GET
 */
 
 /** GET a draft claim AND all it's supporting / opposing claims / draftClaims
 * This fails because it trusts the client side for the reasons array.  
 * Need to get from the DB by ID first.
 */
module.exports = function(req, res) {

	var draftClaim = req.body.draftClaim; //nope - get it from the DB you mad man!

		//This object is used to fill in all the details for each reason in each argument
		//It looks like this: { ID:id, side:string, argIndex:int}
		var reasonDataArray = [],
			draftClaimFromDB = {},
			draftClaimToReturn = {};

		async.waterfall([
			function(callback) {
				//1. get the draft from the DB
				//console.log('draftClaim._id: ', draftClaim._id);
				DraftClaim.findOne({_id:draftClaim._id}).exec(function(err, result){
					if (err) {
						//poop
						callback(err);
					} else {
						draftClaimFromDB = result;
						draftClaimToReturn = JSON.stringify(result);
						draftClaimToReturn = JSON.parse(draftClaimToReturn); //TOO what's going on here? explain this! Weird bug i guess
						callback(null);
					}
				});
			},
			function(callback) {
				//2. run through each side, each arg, each reason - build the reasonDataArray. This is a preperation step
				// reasonArrayIterator iterates through all reasons to the arguments on a side,
				// those reasons are then passed to reasonArrayBuilder which adds index numbers and other details to reasonDataArray
				reasonArrayIterator(draftClaimFromDB, 'supporting');
				reasonArrayIterator(draftClaimFromDB, 'opposing');
				callback(null);
			},
			function(callback) {
				//3. Now the reasonDataArray has been built, run a map async to get all the reasons
				// each object in the reasonDataArray is passed to getAndAddReason
				// getAndAddReason finds the relevant draft or claim in the db and passes that to replaceRefWithReason.
				// replaceRefWithReason takes the claim / draft object and inserts it into the main draft that was asked for in the original request
				// once all map functions have returned we call the callback and the request is returned.
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
					// thisReason.draft = t/f
					// thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;
					var Collection;
					if (reasonData.draft) {
						//it's a draft, look in the draft collection
						Collection = DraftClaim;
					} else {
						//it's a published claim, look in the claims collection
						Collection = Claim;
					}

					//it's a draft, look in the draft collection
					Collection.findOne({_id:reasonData.ID}).exec(function(err, result){
						if(err){
							console.log('err: ', err);
							mapCallback(err);
						} else {
							//we now have the reason from the database and it's location in the main draft, 
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
			thisReason.draft = draftObject[side][argIndex].reasons[reasonIndex].reasonMeta.draft;
			thisReason.ID = draftObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;

			reasonDataArray.push(thisReason);
		}
};