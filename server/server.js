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
var mongoose = require('mongoose'); //To talk to mongo!
console.timeEnd('          6: Requiring modules');

/* CONFIGURING the packages
=========================================*/
console.time('         5: Configuring packages');
app.set('views', './server/views'); //Setting the location for template files
app.engine('hbs', expressHbs({
	extname:'hbs', 
	defaultLayout:'default',
	layoutsDir: './server/views/layouts',
	partialsDir: ['./server/views/partials', './server/views/svgs']
}));
app.set('view engine', 'hbs');
app.use(bodyParser.json()); // Lets us get data from form submittion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //Getting data from cookies
console.timeEnd('         5: Configuring packages');

/* DEFINING the static files
=========================================*/
console.time('        4: Defining public resources');
app.use(express.static('static')); //Setting the location for general static files (styling, images)
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

var DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/wl-03-dev';
mongoose.connect(DATABASE_URL);
mongoose.connection.on('error', function(){
	console.log('DB connection error');
});

console.timeEnd('      2: Connecting to DB');

/* ROUTING - all the rout defenitions in routes.js
 * TODO: need to change to express.router
 * =========================================*/
console.time('     1: Setting up the routes');
require('./routes')(router, passport);
//app.use(require('./controllers'))
app.use('/', router);
console.timeEnd('     1: Setting up the routes');

/* RUN!
==========================================*/
console.timeEnd('    0: Everything ready!');

if (!module.parent){ //if testing, don't run the server, the test already has a server running
	var server = app.listen(process.env.PORT || 3000, function () {

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
}
