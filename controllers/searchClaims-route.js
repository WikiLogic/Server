var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /search
 * =================================
 * This is a server side controller that deals with searching the Database for claims.
 * 
 */

 	//get a list of claims
	router.get('/claims', function(req, res) {
		var searchTerm = req.query.searchTerm;
		
		//Finds ALL the claims - might need pagination / infinite scrolling / limit
		Claim.find(function (err, claims) {
			if (err) return console.error(err);
			//console.log(claims);
		}).then(function(result){
			res.send(result);
		});

		
	});

	//get a single claim, by ID
	router.get('/claim', function(req, res) {
		var claimID = req.query.id;
		
		//Finds ALL the claims - might need pagination / infinite scrolling / limit
		Claim.findOne({_id:claimID},function (err, claims) {
			if (err) return console.error(err);
			//console.log(claims);
		}).then(function(result){
			res.send(result);
		});

		
	});

module.exports = router;
/*
db.claims.insert({'description':'this is claim 1', axiom:false, status:true})
*/
