var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the modals */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

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
module.exports = function(req, res) {

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
};