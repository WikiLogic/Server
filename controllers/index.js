module.exports = function(router, passport) {

	router.use(function (req, res, next){
		if (req.user){ 
			res.locals.loggedIn = true; 
			res.locals.user = req.user;
		} 
		next();
	});


	/* PUBLIC ROUTES
	=====================================================================
	=====================================================================
	=====================================================================*/

	/* Serving the Explorer Angular app.*/
	router.get('/', function (req, res) {
		res.render('app-wrappers/explorer.hbs');
	});


	router.use('/list-claims', require('./listClaims-route') ); //Read 
	router.use('/search', require('./searchClaims-route') );
	router.use('/users', require('./users-route') ); //careful here - provides public data about users

	router.use('/user', hasAccess, require('./user-route') ); //provides data about the user to the user
	router.use('/draft-claim', hasAccess, require('./draftClaim-route') ); //Create & Update
	// Delete?- do we give the option to delete? May need a super user level.


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
		res.render('common/profile', {
            user : req.user // get the user out of session and pass to template
        });
	});

	/* Serving the Editor Angular app */
	/* Need to set 'Editor' as value of angluar-app */
	router.get('/editor', hasAccess, function(req, res) {
		res.render('app-wrappers/editor.hbs');
	});


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