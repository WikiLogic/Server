var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /list-claims
 * =================================
 * This is a server side controller that deals with asking the Database for lists of claims.
 * If you're familiar with WordPress, this will probably turn into something like WP_Query()
 * 
 */

	router.get('/', function(req, res) {
		var sortBy = req.query.sortBy;
		
		switch(sortBy) {
			case 'recent':
				console.log('getting most recent');
				break;
			case 'popular':
				console.log('getting popular');
				break;
			case 'influence':
				console.log('getting claims by influence');
				break;
			case 'capricious':
				console.log('gettign claims by changefuless');
				break;
			case 'random':
				console.log('getting claims by randomness!');
				break;
			default:
				console.log('getting claims by any way I want!');
		}

		Claim.find(function (err, claims) {
			if (err) return console.error(err);
			console.log(claims);
		}).then(function(result){
			res.send(result);
		});

		
	});

module.exports = router;
/*
db.claims.insert({'description':'this is claim 1', axiom:false, status:true})
*/
