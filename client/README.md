# client

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.


app/
---- shared/ for things that are used by more than one component
-------- listView
---- components/ each is like a mini app
-------- search/ options: statements / dictionary / people
-------- resultsList/ for statements, dictionary terms, users: key/val pairs, eg 'title':'crisps are healthy' or 'name':'Iain'
-------- focusStatement/ for the statement we're currently looking at
------------ TheStatement/
------------ Stats/
------------ Discussion/ (disqus? id's from mongo id's?)
------------ supportingStatements/ for the groups that make up the statement
------------ DictionaryDefenitions/ for words in this statement
-------- nodeNavigator/ the tree view
------------ history/ of the statements you've gone through, recent statements
------------ trace/ from an anchor statement to your current one
-------- editor/ This is a protected section for logged in users (with permission? that we can turn off in the future?)
------------ ???
-------- userProfile/
------------ Notifications?
------------ pinned/ favorited statements
------------ traces/ saved traces
------------ Settings/ name, pic (gravatar), password, email
------------ Stats/
-------- Dictionary/
------------ SingleDefenition/ (once set, cannot unset)
------------ List/ ?
-------- WikiLogic/ the explore section
------------ SupportUs/
------------ RecentlyAdded/
------------ popular/
------------ influential/ the most influential statments on the logicWeb
------------ changing/ the most frequently changable statements
------------ Articles/ pulled form our blog?
-------- External/ using WL on other sites
------------ browserPlugin/
------------ ApiForWebsites/