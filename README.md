# (my) express-boilerplate
This is just an empty Express.js app set up with Passport.js to deal with authentication (logging in / out / restricting pages) so that I can prototype ideas quickley.  The structure is merly a reflection of my own prefrences!

The authentication set up is based heavily off [this series of tutorials](https://scotch.io/tutorials/easy-node-authentication-setup-and-local), and if you're interested - [they have their own repo](https://github.com/scotch-io/easy-node-authentication).

I haven't set up Grunt, Gulp, Sass, Less, or any other development tools - that's on purpose, to give the option of choice at the start of a project, although it does have moustach for basic server side templating and mongodb, but they're easy to change and I'm a front end guy so I'm probably just going to leave them as they are.

If you're considering using this as a boilerplate for your own project, thank you!  
Let me know if you find any glaring errors!

---

###What you will need to do:

* Have [node](https://nodejs.org/)
* Have [mongo](https://www.mongodb.org/) but feel free to switch that out for anything else!
* Download / clone / fork.
* npm install

Tada! you're all set up!

###What you will probably want to do

* Set up your app with Facebook, Google, and Twitter if you're going to use their authentication.
* Figure out how you're going to deal with forgotten passwords (and then tell me / write an article and share!)

---

Ideas for the future:

* set up controllers
* set up basic tests
* set up sass archtecture
* Readme in each folder with explanations
* figure out the best way to deal with forgotten passwords.
* set up system to change passwords.
* better encryption.
* git branch per front end framework? maybe.
* article on express.js here?