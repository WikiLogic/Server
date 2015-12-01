console.time('    0: Everything ready!');


/* Make an express! 
=========================================*/
console.time('           7: Setting up Express');
var express = require('express');
var app = express();
var router = express.Router();
console.timeEnd('           7: Setting up Express');

/* GET the packages
=========================================*/
console.time('          6: Requiring modules');
var expressHbs  = require('express-handlebars'); //because moustach
var passport = require('passport'); //the authentication
var session = require('express-session');
var bodyParser   = require('body-parser'); //To read html forms
var cookieParser = require('cookie-parser'); //To read the cookies, om nom nom
var morgan = require('morgan'); //for better logging
var mongoose = require('mongoose'); //To talk to mongo!
console.timeEnd('          6: Requiring modules');

/* CONFIGURING the packages
=========================================*/
console.time('         5: Configuring packages');
app.set('views', './views'); //Setting the location for template files
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'angular'})); //Setting the template rendering engine
app.set('view engine', 'hbs');
app.use(bodyParser.json()); // Lets us get data from form submittion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //Getting data from cookies
app.use(morgan('dev')); //Setting up the logging
console.timeEnd('         5: Configuring packages');

/* DEFINING the static files
=========================================*/
console.time('        4: Defining public resources');
app.use(express.static('public')); //Setting the location for general static files (styling, images)
console.timeEnd('        4: Defining public resources');

/* Setting up authentication using Passport
=========================================*/
console.time('       3: Setting up authentication');
app.use(session({secret: 'iloveme', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
require('./passport')(passport); //Sets up our authentication strategies
console.timeEnd('       3: Setting up authentication');

/* DATABASE!!
==========================================*/
console.time('      2: Connecting to DB');
mongoose.connect('mongodb://localhost/wl-03-dev');
console.timeEnd('      2: Connecting to DB');

/* ROUTING - all the rout defenitions in routes.js
 * TODO: need to change to express.router
 * =========================================*/
console.time('     1: Setting up the routes');
require('./controllers')(router, passport);
//app.use(require('./controllers'))
app.use('/', router);
console.timeEnd('     1: Setting up the routes');

/* RUN!
==========================================*/
console.timeEnd('    0: Everything ready!');

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

	console.log('        ______ ____   __');
	console.log('       / ____// __ \\ / /');
	console.log('      / / __ / / / // / ');
	console.log('     / /_/ // /_/ //_/  ');
	console.log('     \\____/ \\____/(_)   ');
	console.log(' ');

	console.log('Connect to localhost:3000');

});