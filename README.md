Hey Douglas!  Here's a shiney new Repo for the project.  This one is for the Main software.  In the future I'll set up another one for a browser extension.  Would probably be a good idea to create another for Admin stuff unless that can sit in google docs?  Anyway, splitting out the software into it's own repo - definitly a good idea! 

---

# WikiLogic-0.3
The third prototype, making everything more modular  

Wikilogic lets you check the truth of a statement based on a [Dynamic Logic Web](http://www.wikilogicfoundation.org/dynamic-logic-web).  It also allows users to build and explore this Logic Web in order to gain a greater understanding of whatever subject, question, or statement they may have in mind.
For a more detailed description visit our [website](http://www.wikilogicfoundation.org/)
This is an open source project so please feel free to get involved!

---

###Road map to our online presence

This repo, as you might expect, is for the software development.  Have a look around - it's a pretty simple directory structure!

[The Docs](http://wikilogic.github.io/WikiLogic/) run through all the WL specific code, the rest of it comes from the MEAN.js Yeoman generator so it's all standard stuff (for now).

[The Manual](http://wikilogic.github.io/WikiLogic/manual.html) sits beside the Docs at the moment but this will probably change.  It's a run through of how to actually use WikiLogic.

For any larger media files (videos, posters, design work, books!) we have set up a folder with BitTorrent Sync.  Use the key in AssetsKey.txt and the [tutorial](http://wikilogicfoundation.org/wiki/index.php?title=BitTorrentSync) we've put together to get set up with that.

Our [main site](http://www.wikilogicfoundation.org/) is the hub for news and any crossover discussion between the theory and the development.

We also have a [meta wiki](http://wikilogicfoundation.org/wiki/index.php?title=Main_Page) set up for more in depth theory, a good place to go if you something of a Philosopher.

---

###Getting WikiLogic set up locally (for the more technical people)

We're running Express.js for the server and Angular.js for the client side.  So there are a few requirments before setting up WL:

1. [Node.js](http://nodejs.org/) - the web server, download and install from their website.
2. [MongoDB](http://www.mongodb.org/) - the database, download and install from their website 
	* you'll also have to create these folders '\data\db' (run `md \data\db`) to set up a data directory, this is where Mongo will store your databases).
	* Finally (for windows(I'm on 8) it's a good idea to set up a way to run the `mongod`/`mongo` commands (adding it to the path variables!): 
		* go to `Control Panel\All Control Panel Items\System`, 
		* click `advanced system settings`, then `environment variables`, 
		* in the `system variables` find `path`, select it and click edit, 
		* at the end of that string add `;` then the path to the mongo exe files.  It'll be something like `;C:\Program Files\MongoDB 2.6 Standard\bin\`.  
		* Now you should be able to open up the console and run `mongod` and it'll go! 
3. [Bower](http://bower.io/) - client package manager,  `npm install -g bower` from anywhere, it'll install it globally (`-g`)
4. [Grunt](http://gruntjs.com/) - making life easier, `npm install -g grunt-cli`, also global
5. [Compass](http://compass-style.org/) to build the Sass
6. [sass-globbing](https://github.com/chriseppstein/sass-globbing) `gem install sass-globbing` - this also requires Ruby

With all that set up we can now get the Wikilogic specific stuff onto your machine.

1. Fork/clone the repo onto your own computer
2. If you haven't got a normal copy of git installed (eg you only use sourcetree):
 * Set the Git path first with `set PATH=%PATH%;C:\Users\MyName\AppData\Local\Atlassian\SourceTree\git_local\bin;`
 * or go to http://git-scm.com/downloads and install git from there  
3. In the "client/" folder: `npm install` (this may take a while, have patience)
4. In the "server/" folder: `npm install`

Ok! Now lets get it running

1. run `mongod`
2. in client: `grunt serve`
3. in server: `npm test or nodemon ./bin/www`

*I would love to set something up that would run these three commands from one place, any suggestions welcome!*

---

##Development


Initial set up: http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/  


To do: 

* watch all sass files
* set up authentication (using passport: http://passportjs.org/)  
* set everything to run from a single grunt  
* Get terms together    
* concat all the docs - loads loading in at the moment

Less important to do:

* Set up bash or something to create example DB  
* Rename Repos   

---

##Server: all the statement logic


---

##Client: all the prettyness :D

---

##Connecting the two:

A high/mid level run through of what happens when someone opens WikiLogic in their browser.
The user opens our site -> express sends them the angular app

---

##Possible Future Additions *Need a WP page for this section*

####Browser extension

####Website Plugin

####Presentations 
Setting up a series of statements to be used in justification of a point / as an aid to a talk?  