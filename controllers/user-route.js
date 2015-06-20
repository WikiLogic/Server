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

	router.get('/myWork', function(req, res) {
		/*
		 * This queries the DB for any claims authored by the current user
		 * async runs the two queries in prarllel and returns both as arrays in an object
		 */

		var unPublishedIDarray = req.user.meta.unPublished;
		var publishedIDarray = req.user.meta.published;

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
			if (err) { console.log('oh shit!'); }

			// results is now equals to: {drafts: array, published: array}
			res.status(200).send(results);
		});
		

	});

module.exports = router;