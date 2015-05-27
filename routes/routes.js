module.exports = function(router, passport) {

	router.use(function (req, res, next){
		//This var is used by layouts to determin if various options should be rendered
		if (req.user){ res.locals.loggedIn = true; }
		next();
	});


	/* PUBLIC ROUTES
	=====================================================================
	=====================================================================
	=====================================================================*/

	router.get('/', function (req, res) {
		res.render('index');
	});


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
		successRedirect: '/profile',
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

	// user profile
	router.get('/profile', hasAccess, function(req, res) {
		res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
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