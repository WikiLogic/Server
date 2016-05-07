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
		console.log('got search: ' + searchTerm);
		
		//Finds ALL the (published) claims - might need pagination / infinite scrolling / limit. Jesus that won't be fun.
		//this is only finding exact matches - lets try to get it looking for text within text.
		//Claim.find({'description':searchTerm}, function (err, claims) {
		//	if (err) return console.error(err);
		//	res.send(claims);
		//});

		//the new search - does a text search! Have to set an index on description
		/*
		Claim.find(	
				{ $text : { $search : searchTerm } }, 
	        	{ score : { $meta: "textScore" } }
	        ).sort(
	        	{ score : { $meta : 'textScore' } }
	        ).exec(function (err, claims) {
				if (err) return console.error(err);
				console.log('text search has run: ', claims);
				res.send(claims);
		});*/

	        //simplified
	    Claim.find({ 
	    		$text : { 
	    			$search : searchTerm 
	    		} 
	    	}).exec(function (err, claims) {
				if (err) return console.error(err);
				console.log('text search has run: ', claims);
				res.send(claims);
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
