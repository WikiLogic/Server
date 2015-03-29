
//app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

/**
 * This handles the signing up of users
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');
var _ = require('underscore');
var color = require('cli-color');
//var db = require('../../database');
//var Users = db.users;


// The POST /signup route
// Setup the Route (as we're being passed /signup routes here that is treated as the root, hence the '/')
router.post('/', function (req, res) {

	// The posted information from the front-end
    var body = req.body;
    // Current time this occurred
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');



});

// export the router for usage in our server/router/index.js
module.exports = router;