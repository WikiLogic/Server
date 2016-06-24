var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');

/* get the models */
var User = require('../../models/user'),
	DraftClaim = require('../../models/draftClaim'),
	Claim = require('../../models/claim');

module.exports = function(req, res) {
	var apiAction = req.body.action;
	console.log('apiAction: ', apiAction);
	switch(apiAction){
		case "newclaim":
			console.log("Add new claim");
			break;
		default:
			console.log('HANG');
	}
	
};