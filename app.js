console.time('    0: setup complete');


/* Make an express! 
=========================================*/
console.info('          6: Setting up Express');
var express = require('express');
var app = express();
var router = express.Router();


/* GET the packages
=========================================*/
console.info('         5: Requiring modules');
var expressHbs  = require('express-handlebars'); //because moustach
var passport = require('passport'); //the authentication
var session = require('express-session');
var bodyParser   = require('body-parser'); //To read html forms
var cookieParser = require('cookie-parser'); //To read the cookies, om nom nom
var morgan = require('morgan'); //for better logging
var mongoose = require('mongoose'); //To talk to mongo!


/* CONFIGURING the packages
=========================================*/
console.info('        4: Configuring packages');
app.use(express.static('public')); //Setting the location for general static files (styling, images)
app.set('views', './views'); //Setting the location for template files
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main'})); //Setting the template rendering engine
app.set('view engine', 'hbs');
app.use(bodyParser.json()); // Lets us get data from form submittion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //Getting data from cookies
app.use(morgan('combined')); //Setting up the logging


/* Setting up authentication using Passport
=========================================*/
console.info('       3: Setting up suthentication');
app.use(session({secret: 'iloveme', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport); //Sets up our authentication strategies


/* DATABASE!!
==========================================*/
console.info('      2: Connecting to DB');
mongoose.connect('mongodb://localhost/wl-03-dev');


/* ROUTING - all the rout defenitions in routes.js
 * TODO: need to change to express.router
 * =========================================*/
console.info('     1: Setting up the routes');
require('./routes/routes.js')(router, passport);
app.use('/', router);


/* RUN!
==========================================*/
console.timeEnd('    0: setup complete');

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

	console.log('        ______ ____   __');
	console.log('       / ____// __ \\ / /');
	console.log('      / / __ / / / // / ');
	console.log('     / /_/ // /_/ //_/  ');
	console.log('     \\____/ \\____/(_)   ');
	console.log(' ');

});