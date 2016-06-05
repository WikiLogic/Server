var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');


module.exports = function(router, passport) {

	router.use(function (req, res, next){
		if (req.user){ 
			res.locals.loggedIn = true; 
			res.locals.user = req.user;
		} 
		next();
	});


	/* PUBLIC ROUTES - 
	Editor should only run in /editor. For now setting home to login.
	Will make a public explorer app seporatly one day
	=====================================================================
	=====================================================================
	=====================================================================*/

	/* Serving the Explorer Angular app.*/
	router.get('/', function (req, res) {
		//res.render('app-wrappers/explorer.hbs');
		res.render('landing.hbs');
	});

	router.get('/styleguide', function (req, res) {
		//res.render('app-wrappers/explorer.hbs');
		res.render('styleguide.hbs', {layout: false});
	});


	//When we do more public routes for the editor, they will go here
	//router.use('/what-is-wl', require('./whatIsWL-route') );
	

	/* USER AUTHENTICATION
	=====================================================================
	=====================================================================
	=====================================================================*/

	router.get('/signup', function (req, res) {
		res.render('layouts/signup.hbs', {layout: false});
	});

	router.get('/login', function (req, res) {
		res.render('layouts/login.hbs', {layout: false});
	});

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/',
		passReqToCallback : true
		})
	);

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/editor',
		failureRedirect: '/',
		passReqToCallback : true
		})
	);

	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// facebook -------------------------------
	router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	router.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);

	// twitter --------------------------------
	router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
	router.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);

	// google ---------------------------------
	router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	router.get('/auth/google/callback',
		passport.authenticate('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		})
	);

		
	/* PRIVATE ROUTES, all should use 'hasAccess' to check authentication
	=====================================================================
	=====================================================================
	=====================================================================*/

	// user profile - is this part of an angular app?
	router.get('/profile', hasAccess, function(req, res) {
		res.render('profile.hbs', {
            user : req.user // get the user out of session and pass to template
        });
	});

	/* Serving the Editor Angular app */
	/* Need to set 'Editor' as value of angluar-app */
	router.get('/editor', hasAccess, function(req, res) {
		res.render('layouts/angular.hbs');
	});

	router.use('/user', hasAccess, require('./user-route') ); //provides data about the user to the user

	var draftClaimRouter = express.Router({mergeParams: true});
	router.use('/draft-claim', hasAccess, draftClaimRouter);
		draftClaimRouter.post('/new', require('./draft_claim/draftClaim-create') );
		draftClaimRouter.post('/update', require('./draft_claim/draftClaim-update') );
		draftClaimRouter.post('/get-draft', require('./draft_claim/draftClaim-get') );
		draftClaimRouter.post('/delete', require('./draft_claim/draftClaim-delete') );
		draftClaimRouter.post('/publish', require('./draft_claim/draftClaim-publish'));

	var claimRouter = express.Router({mergeParams: true});
	router.use('/claim', hasAccess, claimRouter);
		claimRouter.post('/update', require('./claim/claim-update') );
		claimRouter.post('/get-claim', require('./claim/claim-get') );
		claimRouter.get('/search', require('./searchClaims-route') );

	var searchRouter = express.Router({mergeParams: true});
	router.use('/search', hasAccess, searchRouter);
		searchRouter.get('/claims', require('./searchClaims-route') );

}; //END module exports

/* Used when restricted routes are requested */
function hasAccess(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
    	console.log('unauthenticated access requested.');
    	res.redirect('/');
    }
}