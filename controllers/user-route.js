var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

    var Claim = require('../models/claim'),
    	DraftClaim = require('../models/draftClaim');

/*          /user
 * =================================
 * This provides data to the user about the user
 */

	router.get('/myData', function(req, res) {
		/*
		 * This provides information to users who have logged in about themselves.
		 * Even though it requires access it should not send any sensitive data. 
		 */
		var unPublishedIDarray = req.user.meta.unPublished;
		var publishedIDarray = req.user.meta.published;

		//async here! build the user's meta object to send
		async.parallel({
			drafts: function(callback){
				DraftClaim.find({'_id': { $in: unPublishedIDarray } }, function(err,drafts){
					callback(null, drafts);
				})
			},
			published: function(callback){
				Claim.find({ '_id': { $in: publishedIDarray } }, function(err,claims){
					callback(null, claims);
				})
			}
		},
		function(err, results){
			// results is now equals to: {drafts: array, published: array}
			console.log('USER MEA BUILDING: ', results);
			res.status(200).send(results);
		});
		

	});

module.exports = router;
/*
db.claims.insert({'description':'this is claim 1', axiom:false, status:true})
*/
