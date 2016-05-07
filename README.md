WikiLogic 0.3
=========

The third prototype, making everything more modular

---

Tests run on the master branch: https://travis-ci.org/WikiLogic/WikiLogic
[![Build Status](https://travis-ci.org/WikiLogic/WikiLogic.svg?branch=master)](https://travis-ci.org/WikiLogic/WikiLogic)

---

Our [main site](http://www.wikilogicfoundation.org/) serves as the intro to the idea behind WL.

We also have a [meta wiki](http://wikilogicfoundation.org/wiki/index.php?title=Main_Page) set up for more in depth theory, a good place to go if you are something of a Philosopher.


###File structure

This repo, as you might expect, is for the software development.
For any larger media files (videos, posters, design work, books!) we have set up a folder with BitTorrent Sync.  Use the key in AssetsKey.txt and the [tutorial](http://wikilogicfoundation.org/wiki/index.php?title=BitTorrentSync) we've put together to get set up with that. TODO@Douglas Investigate synching and update to use that.

---

###Getting WikiLogic set up locally (for the more technical people)

To run WikiLogic locally you'll need a few things installed:

1. [Node.js](http://nodejs.org/) - the web server, download and install from their website.
2. [MongoDB](http://www.mongodb.org/) - the database, download and install from their website 
	* you'll also have to create these folders '\data\db' (run `md \data\db`) to set up a data directory, this is where Mongo will store your databases).
	* Finally (for windows(I'm on 8) it's a good idea to set up a way to run the `mongod`/`mongo` commands (adding it to the path variables!): 
		* go to `Control Panel\All Control Panel Items\System`, 
		* click `advanced system settings`, then `environment variables`, 
		* in the `system variables` find `path`, select it and click edit, 
		* at the end of that string add `;` then the path to the mongo exe files.  It'll be something like `;C:\Program Files\MongoDB 2.6 Standard\bin\`.  
		* Now you should be able to open up the console and run `mongod` and it'll go!
4. [Gulp](http://gulpjs.com/) - A task runner to make life easier, `npm install -g gulp`, also global
5. [Compass](http://compass-style.org/) to build the Sass *Note, after changing to gulp I'm not sure if we need this anymore?*

With all that set up we can now get the Wikilogic specific stuff onto your machine.

1. Fork/clone the repo onto your own computer
2. If you haven't got a normal copy of git installed (eg you only use sourcetree):
 * Set the Git path first with `set PATH=%PATH%;C:\Users\MyName\AppData\Local\Atlassian\SourceTree\git_local\bin;`
 * or go to http://git-scm.com/downloads and install git from there  
3. In the command line / terminal navigate to the projcet folder and `npm install` (it needs git installed to run, hence step 2)


Ok! Now lets get it running

1. Navigate to the project folder and run `gulp`.  Hopefully it'll just go!
3. Now open your browser and go to [http://localhost:3000/](http://localhost:3000/)

You should now have Wikilogic running locally!  Bravo sir/madam, bravo!  You'll have to fill in some statements yourself to play around with it.  We'll be adding an online test database soon-ish which the (future) demo will run on and which you should be able to connect to as well using a different grunt, like `grunt demo` or something.  Will update this when that arrives!  Until then, happy stating!

*Note, if you get `js-bson: failed to load c++ bson extension` errors on step 5 (in the node console) search that in the node modules, the first result that comes up, comment out those three lines.  They're just noise at the moment.*

---

###Project structure

-Currently this part is me thinking out loud.

Main layout provides the main structure with angular. 
One SPA for viewing.
Another SPA for editing.

Can angular Ajax the html partials? / use express to bind som ethings and define public partials?

views/
	common/
		navigation.hbs
	viewer/  *i dub these applets*
		index.hbs *The viewer SPA*
		recent.hbs
		popular.hbs
		influential.hbs
		changing.hbs
	editor/
		index.hbs *The editor SPA *

---

###The Global ($rootScope)

```
$rootscope = {
	search: {
		term: 'search term',
		results: [an array of claim objects],
		order: 'the order',
		selectedResult: {a claim object}
	}
}
```

---

###DB command ref

see user profile:
`db.users.find({"local.email":"email here"}).pretty()`

remove drafts from user profile:
`db.users.update({"local.email":"email here"},{$set:{"meta.unPublished":[ ]}})`
`db.users.update({"local.email":"email here"},{$set:{"meta.published":[ ]}})`

clear out claims:
`db.claims.remove({"status":false})` / true

clear out drafts

---

Root statement:

* Hypothesis (prediction)
* Observation
* Undisputed fact
* Absolute truth

---

Example claims
>There are no absolute truths
(it would be an argument against itself)

---

Shout out to [useiconic](https://useiconic.com/open/) for the icons!

---

this looks good for the graph: http://cytoscapeweb.cytoscape.org/tutorial  
and this: http://sigmajs.org/

Sounds for fun? http://loudlinks.rocks/#examples

Fancy tool tip positioning> https://popper.js.org/

Make it look like office? http://dev.office.com/fabric
