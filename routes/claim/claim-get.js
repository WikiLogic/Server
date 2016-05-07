var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	Claim = require('../../models/claim');

/*  ______ _______ _______
 * |  ____ |______    |   
 * |_____| |______    |   
 * http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=GET
 */
 
 /** GET a claim AND all it's supporting / opposing claims
 * This fails because it trusts the client side for the reasons array.  
 * Need to get from the DB by ID first.
 */
module.exports = function(req, res) {

	var claimID = req.body.claim; //nope - get it from the DB you mad man!

		//This object is used to fill in all the details for each reason in each argument
		//It looks like this: { ID:id, side:string, argIndex:int}
		var reasonDataArray = [],
			claimFromDB = {},
			claimToReturn = {};

		async.waterfall([
			function(callback) {
				//1. get the claim from the DB
				Claim.findOne({_id:claimID}).exec(function(err, result){
					if (err) {
						//poop
						callback(err);
					} else {
						console.log('1: got claim: ', result);
						claimFromDB = result;
						claimToReturn = JSON.stringify(result);
						claimToReturn = JSON.parse(claimToReturn); //TOO what's going on here? explain this! Weird bug i guess
						callback(null);
					}
				});
			},
			function(callback) {
				//2. run through each side, each arg, each reason - build the reasonDataArray. This is a preperation step
				// reasonArrayIterator iterates through all reasons to the arguments on a side,
				// those reasons are then passed to reasonArrayBuilder which adds index numbers and other details to reasonDataArray
				console.log('2: reasonDataArray', reasonDataArray);
				reasonArrayIterator(claimFromDB, 'supporting');
				reasonArrayIterator(claimFromDB, 'opposing');
				console.log('3: reasonDataArray', reasonDataArray);
				callback(null);
			},
			function(callback) {
				//3. Now the reasonDataArray has been built, run a map async to get all the reasons
				// each object in the reasonDataArray is passed to getAndAddReason
				// getAndAddReason finds the relevant claim in the db and passes that to replaceRefWithReason.
				// replaceRefWithReason takes the claim object and inserts it into the main claim that was asked for in the original request
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
					// thisReason.draft = f
					// thisReason.ID = claimObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;

					Claim.findOne({_id:reasonData.ID}).exec(function(err, result){
						if(err){
							console.log('err: ', err);
							mapCallback(err);
						} else {
							console.log("4: got reason: ", result);
							//we now have the reason from the database and it's location in the main claim, 
							//we should add it to the claim 
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
					var refID = claimFromDB[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence;
					refID = JSON.stringify(refID);
					var reasonID = JSON.stringify(reasonFromDb._id);
					var reasonString = JSON.stringify(reasonFromDb);

					if (refID == reasonID) {
						//awesome, lets populate the current working draft
						
						console.log('old ref: ', claimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence);
						console.log('reasonFromDb: ', reasonFromDb);

						claimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence = reasonFromDb;//reasonFromDb;
						
						console.log('new obj: ', claimToReturn[reasonDataObject.side][reasonDataObject.argIndex].reasons[reasonDataObject.reasonIndex].claimObjectRefrence);
					
					} else {
						//If this is called it means the array order has been mixed up somehow - we'll have to spend a bit more on computation
						//Iterate through the arguments in the relevent side
						for (var i = 0; i < claimFromDB[reasonDataObject.side].length; i++) {
							//iterate through the reasons in each argument
							for (var j = 0; j < claimFromDB[reasonDataObject.side][i].reasons.length; j++){
								//check to see if the id of the reason in this bit of the main draft matched the reason ID
								refID = JSON.stringify(claimFromDB[reasonDataObject.side][i].reasons[j].claimObjectRefrence);

								if (refID == reasonID) {
									//we have a match, replace the refrence with the full reason object
									claimToReturn[reasonDataObject.side][i].reasons[j].claimObjectRefrence = reasonFromDb;
								}
							}
						}
					}
				}

			}
		], function (err, result) {
			// result now equals 'done'
			res.status(200).send(claimToReturn);
		});

		/**
		 * This takes the claim that has just been returned from the DB, and a side (opposing | supporting)
		 * It then iterates through the args (i) and the reasons (j) and passes the data to the reasonArrayBuilder
		 */
		function reasonArrayIterator(claimObject, side){
			for (var i = 0; i < claimObject[side].length; i++) {
				for (var j = 0; j < claimObject[side][i].reasons.length; j++) {
					reasonArrayBuilder(claimObject, side, i, j);
				}
			}
		}

		/** 
		 * This takes the claim from the DB and the iteration details
		 * It then creates an object from all the data and pushes it onto the reasonDataArray
		 */
		function reasonArrayBuilder(claimObject, side, argIndex, reasonIndex){

			var thisReason = {};

			//Set the easy stuff
			thisReason.reasonObj = {};
			thisReason.side = side;
			thisReason.argIndex = argIndex;
			thisReason.reasonIndex = reasonIndex;
			thisReason.ID = claimObject[side][argIndex].reasons[reasonIndex].claimObjectRefrence;

			reasonDataArray.push(thisReason);
		}
};