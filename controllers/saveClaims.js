var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /save-claims
 * =================================
 * This is a server side controller that deals with putting claims into the Database.
 * It should be able to deal with single claims AND saving groups of claims (if someone has been having an editing session)
 * This is a protected route, only logged in users may save/create/edit claims.
 * 
 */

	router.get('/', function(req, res) {
		//var sortBy = req.query.sortBy;
		
		/*
		Claim.find(function (err, claims) {
			if (err) return console.error(err);
			console.log(claims);
		}).then(function(result){
			res.send(result);
		});
		*/
		
	});

module.exports = router;
/*
db.claims.insert({'description':'this is claim 1', axiom:false, status:true})
*/
