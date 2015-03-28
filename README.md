# WikiLogic-0.3
The third prototype, making everything more modular


Hey Douglas!  Here's a shiney new Repo for the project.  This one is for the Main software.  In the future I'll set up another one for a browser extension.  Would probably be a good idea to create another for Admin stuff unless that can sit in google docs?  Anyway, splitting out the software into it's own repo - definitly a good idea!

Initial set up: http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/

To run:
in client: grunt serve
in server: npm test or nodemon ./bin/www


To do:
1 set up authentication (using passport: http://passportjs.org/)
2 set everything to run from a single grunt
3 Get terms together
4 Sketch out front end

100 Set up bash or something to create example DB
101 Rename Repos 

---

##Server: all the statement logic


---

##Client: all the prettyness :D

---

##Connecting the two:

A high/mid level run through of what happens when someone opens WikiLogic in their browser.
The user opens our site -> express sends them the angular app
