var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the models */
var User = require('../../models/user'),
	Claim = require('../../models/claim');

var newClaim = function(req, res){

	//1. Create new draft claim object
	var claim = new Claim;
	claim.description = req.body.newClaim;
	claim.meta.author = req.user._id;

	async.waterfall([
		function(callback) {
			//1: check if there's an identicle claim already published
			Claim.find({'description':claim.description}).exec(function(err,result){
				if(err) callback(err);

				if (result.length){
					//Can't publish - there is an identical claim
					callback(new Error("Can't publish, identical claim already exists."));
				} else {
					//didn't find any conflicts, on to the publishing!
					callback(null);
				}
			});
		},
		function(callback) {
			//2 Save new claim object to db
			claim.save(function(err,result){
				if(err) {
					callback(new Error("Can't save claim, DB error: " + err));
				} else {
					callback(null, result);
				}
			});
		}
	],
	function (err, result) {//finished!
		if(err) {
			console.log('saving claim error: ', err);
			res.status(500).send(JSON.stringify(err));
		} else {
			res.status(200).send(result);
		}
		
	});
}


var newArgument = function(req, res){
	var claimId = req.body.argument.claimId;
	var sideToUpdate = req.body.argument.side;
	var argumentToAdd = {
		status: 50,
		reasons: req.body.argument.reasons
	};

	async.waterfall([
		function(callback) {
			//1: check if there's an identicle claim already published
			Claim.findOne({_id:claimId}).exec(function(err,result){
				if(err) {
					console.log(err);
					res.status(500).send(JSON.stringify(err));
				} else {
					callback(null, result);
				}
			});
		},
		function(claim, callback) {
			console.log('sideToUpdate: ', sideToUpdate);
			//2 add the new argument to the claim
			if (sideToUpdate == "s") {
				claim.supporting.push(argumentToAdd);
			} else if (sideToUpdate == "o") {
				claim.opposing.push(argumentToAdd);
			}
			console.log('claim: ', claim);

			//3 save the claim
			claim.save(function(err,result){
				if(err) {
					console.log(err);
					res.status(500).send(JSON.stringify(err));
				} else {
					callback(null, result);
				}
			});
		}
	],
	function (err, result) {//finished!
		if(err) {
			console.log('saving claim error: ', err);
			res.status(500).send(JSON.stringify(err));
		} else {
			res.status(200).send(result);
		}
		
	});
}

module.exports = function(req, res) {
	var apiAction = req.body.action;
	console.log('apiAction: ', apiAction);
	switch(apiAction){
		case "newclaim":
			newClaim(req, res);
			break;
		case "newargument":
			newArgument(req, res);
			break;
		default:
			console.log('HANG');
	}
	
};