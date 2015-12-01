#Views

This is the other bridge between server side and client side stuff.  

This is for server side templates built using Handlebars.
The main wrappers for the two angular apps are here but they refrence files from the /public directory for their various parts.

##/Layouts
The highest level.  Contains the `head` and `body` tags

##/App-wrappers
`ng-app` is declared here, also all the `script` includes for each angular app

##/partials
The common components rendered by the server: the sidebar.