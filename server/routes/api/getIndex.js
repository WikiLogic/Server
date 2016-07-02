var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the models */
var User = require('../../models/user'),
	Claim = require('../../models/claim');

module.exports = function(req, res) {
	if (req.query.s !== undefined){
		console.log('API Request: Search', req.query.s);
		var searchTerm = req.query.s;

		Claim.find({ 
	    		$text : { 
	    			$search : searchTerm 
	    		} 
	    	}).exec(function (err, claims) {
				if (err) {
					console.error(err);
					res.status(500).send(err);
				} else {
					console.log('text search has run: ', claims);
					res.send(claims);
				}
		});

	};
};