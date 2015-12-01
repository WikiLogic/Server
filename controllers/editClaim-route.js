var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /edit-claim
 * =================================
 * 
 * 
 */

 	//route for saving individual claims to a user's profile (not public yet)
	router.post('/save', function(req, res) {
		
		//clean the claim
		//has the claim been edited in the mean time?

		var newClaim = new Claim();

		res.send('got it!');

		//newClaim.description = 'description passed in here';
		//newClaim.axiom = false;
		//newClaim.status = true;
		//newClaim.meta.user = ??;
		//creation date is dealt with by the model

		/*
		newClaim.save(function(err){
			if(err) {
				res.send('ERROR!');
			} else {
				res.send('SUCCESS!');
			}
		});
		*/
	});

	//route to publish an individual claim to the public network
	router.post('/publish', function(req, res){
		//Clean the claim
		//Does the claim object list any arguments, if not then fail
		//Check the DB - does this claim exist already (check by description), if true then fail, if close then flag
		//seems it's passed, time to save it to the main database!
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
function isNew(claim){
	return true;
}


/* The End!
=========================================================================*/
module.exports = router;
