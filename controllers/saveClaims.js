var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose');

    var Claim = require('../models/claim');

/*          /save-claim
 * =================================
 * This is a server side controller that deals with putting claims into the Database.
 * It should be able to deal with single claims AND saving groups of claims (if someone has been having an editing session)
 * This is a protected route, only logged in users may save/create/edit claims.
 * 
 */

 	//route for saving individual claims
	router.get('/single', function(req, res) {
		
		console.log('GOT CLAIM TO SAVE:', req.body);

		var newClaim = new Claim();

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

	//route for saving an array of claims
	router.get('/array', function(req, res) {
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
