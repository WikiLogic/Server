#WikiLogic 0.4: Ferret

##*F*ront *E*nd: *R*est*R*ucturing *E*very*T*hing 

###[![Build Status](https://travis-ci.org/WikiLogic/WikiLogic.svg?branch=master)](https://travis-ci.org/WikiLogic/WikiLogic)

---

###Getting set up

You'll need these already installed:

 - [Node.js](http://nodejs.org/)
 - [MongoDB](http://www.mongodb.org/)
 - [Browserify](http://browserify.org/)
 - [Gulp 4](http://gulpjs.com/) `npm install -g gulpjs/gulp.git#4.0`
 npm install -g jshint

Then you can pull in WikiLogic:

 - `git clone https://github.com/WikiLogic/WikiLogic.git`
 - `npm install`

Finally we can start it up:

 - `npm start` to run WL without any bells and whistles.

 - `npm run start:dev` Here be bells and whistles! It should open 3 command line windows running these:
	 - For the DB: `npm run spinup:database` (starts up mongod)
	 - For the server: `npm run spinup:server` (starts up the node server with nodemon, will restart on any changes in /server)
	 - For the front end: `gulp` (compiles & watches sass and js)
	 - The window you ran the original command from should remain free so you can commit to your hearts content without worrying about stop/starting any processes!

---

###What's where?

####`/server `

This is the Express app, job 1: serve the static assets. job 2: serve the data. In future versions these two jobs will be split.

####`/static`

This holds the JS and CSS for the web app. Do not do any development in here, your work will be overwritten by compilers.

####`/staticSrc`

This hold the es6 / sass files that will be compiled down into the static folder. This is where any Front End Devs will live.

####`/test`

This is the code that will test everything. When you push / pullrequest to our github repo, travis will run these tests and only accept the branch / commit if the tests pass.

---

###How does it run?

 - Clientside we're using [Rivets.js](http://rivetsjs.com/) to bind data to the DOM and browserify to deal with the JS that manages that data.
 - Serverside we're using [Express.js](http://expressjs.com/) to serve the site.
 - For the database we're using [MongoDB](https://www.mongodb.com/).

---

###DB cheatsheet for development

see user profile:
`db.users.find({"local.email":"email here"}).pretty()`

remove drafts from user profile:
`db.users.update({"local.email":"email here"},{$set:{"meta.unPublished":[ ]}})`
`db.users.update({"local.email":"email here"},{$set:{"meta.published":[ ]}})`

clear out claims:
`db.claims.remove({"status":false})` / true

clear out drafts

---

###Miscellaneous thought dump:

Root statement:

* Hypothesis (prediction)
* Observation
* Undisputed fact
* Absolute truth

Example claims
>There are no absolute truths
(it would be an argument against itself)

Shout out to [useiconic](https://useiconic.com/open/) for the icons!

this looks good for the graph: http://cytoscapeweb.cytoscape.org/tutorial  
and this: http://sigmajs.org/

Sounds for fun? http://loudlinks.rocks/#examples

Fancy tool tip positioning> https://popper.js.org/

Make it look like office? http://dev.office.com/fabric

swap db to rethink - push!!!

One day: http://googleresearch.blogspot.com/2016/05/announcing-syntaxnet-worlds-most.html?m=1 here's the repo: https://github.com/tensorflow/models/tree/master/syntaxnet

some good ideas for styles: http://cognition.happycog.com/article/happy-cog-starter-files-2016-edition

Haxl: https://github.com/facebook/Haxl could be useful

animations on scroll: https://github.com/michalsnik/aos - test this, looks good!

---

Wikilogic is maintained by The [WikiLogic Foundation](http://www.wikilogicfoundation.org/) 
