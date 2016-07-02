var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /users
 * =================================
 * This provides public information about users, 
 * it is intended for things like scoreboards & author profiles
 * it is also intended to provide data to users about themselves (when they are logged in)
 */

	router.get('/data', function(req, res) {
		

		
	});

module.exports = router;
/*
db.claims.insert({'description':'this is claim 1', axiom:false, status:true})
*/
