'use strict';
//The editor requires the explorer as it builds onto it.
var Editor = angular.module('Editor', ['Explorer', 'ngRoute']);
	
Editor.config(function($routeProvider){
	console.log('setting up the routes');
	$routeProvider
		.when("/editor", {
			templateUrl: "/partials/newClaim-partial.html",
			controller: "NewDraftController"
		})
		.when("/editor/my-drafts",	{
			templateUrl: "/partials/drafts/myDraftsList-partial.html",
			controller: "MyDraftsController"
		});
	//End routeProvider

});