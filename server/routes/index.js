var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    async = require('async');


module.exports = function(router, passport) {

	//before any connection, check if db is running
	router.use(function(req, res, next){
		console.log('mongoose.connection.readyState: ', mongoose.connection.readyState);
		if (mongoose.connection.readyState == 0) {
			console.log("Oh oh - seems like the database isn't running");
			res.locals.errorMessage = "Eh, sorry about this but it seems my database is feeling a bit under the weather. It's giving me the slient treatment. Now, I don't know if anyone else knows but I would really appreciate it if you could RAISE ALL HELL FOR ME THIS IS SCARY - HELP!!! HEEELP!!! ";

			res.render('error.hbs', {layout: 'landing'});
		} else {
			next();
		}
	
	});

	//before any connection, check if user is logged in
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
		res.render('landing.hbs', {layout: 'landing'});
	});

	router.get('/styleguide', function (req, res) {
		//res.render('app-wrappers/explorer.hbs');
		res.render('styleguide.hbs', {layout: 'app'});
	});

	router.get('/error', function (req, res) {
		//res.render('app-wrappers/explorer.hbs');
		res.render('error.hbs', {layout: 'landing'});
	});


	//When we do more public routes for the editor, they will go here
	//router.use('/what-is-wl', require('./whatIsWL-route') );
	

	/* USER AUTHENTICATION
	=====================================================================
	=====================================================================
	=====================================================================*/

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
			failureRedirect : '/error'
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
			layout: 'app',
            user: req.user // get the user out of session and pass to template
        });
	});

	/* Serving the Editor Angular app */
	/* Need to set 'Editor' as value of angluar-app */
	router.get('/editor', hasAccess, function(req, res) {
		res.render('editor.hbs', {layout: 'app'});
	});

	var apiRouter = express.Router({mergeParams: true});
	router.use('/api', hasAcess, apiRouter);
		apiRouter.post('/', require('./api/postIndex'));
		apiRouter.get('/', require('./api/getIndex'));

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