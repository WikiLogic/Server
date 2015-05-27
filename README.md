WikiLogic 0.3
=========

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

Our first working prototype is built with the [MEAN.js](http://meanjs.org/docs.html#getting-started) stack.  To get it running you must first have a few things installed on your machine:

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
6. [Yeoman](http://yeoman.io/) `npm install -g yo` But you probably won't be needing it on this project unless you're making a big addition.


With all that set up we can now get the Wikilogic specific stuff onto your machine.

1. Fork/clone the repo onto your own computer
2. If you haven't got a normal copy of git installed (eg you only use sourcetree):
 * Set the Git path first with `set PATH=%PATH%;C:\Users\MyName\AppData\Local\Atlassian\SourceTree\git_local\bin;`
 * or go to http://git-scm.com/downloads and install git from there  
3. In the command line / terminal navigate to the projcet folder and `npm install` (it needs git installed to run, hence step 2)


Ok! Now lets get it running

1. Run the database server
	* on a mac or windows if you've set up the path, run `mongod` fom anywhere!
	* If you haven't set up the path then cd to the folder with the mongo exe files, probably like `"C:\Program Files\MongoDB 2.6 Standard\bin\mongod.exe"` then run `mongod`
2. Finally, time to run Wikilogic itself, in the project root run `node app.js`
3. Now open your browser and go to [http://localhost:3000/](http://localhost:3000/)

You should now have Wikilogic running locally!  Bravo sir, bravo!  You'll have to fill in some statements yourself to play around with it.  We'll be adding an online test database soon-ish which the (future) demo will run on and which you should be able to connect to as well using a different grunt, like `grunt demo` or something.  Will update this when that arrives!  Until then, happy stating!

---
