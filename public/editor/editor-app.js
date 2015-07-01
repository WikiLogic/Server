'use strict';
//The editor requires the explorer as it builds onto it.
var Editor = angular.module('Editor', ['Explorer', 'ngRoute']);
	
Editor.config(function($routeProvider){
	console.log('setting up the routes');
	$routeProvider
		.when("/", {
			templateUrl: "/partials/drafts/newDraft-partial.html",
			controller: "NewDraftController",
			controllerAs: "NewDraftController"
		})
		.when("/new-draft",	{
			templateUrl: "/partials/drafts/newDraft-partial.html",
			controller: "NewDraftController",
			controllerAs: "NewDraftController"
		})
		.when("/edit-draft",	{
			templateUrl: "/partials/drafts/editDraft-partial.html",
			controller: "draftEditorController",
			controllerAs: "draftEditorController"
		})
		.when("/my-drafts",	{
			templateUrl: "/partials/drafts/myDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		})
		.when("/my-published",	{
			templateUrl: "/partials/claims/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/my-trash",	{
			templateUrl: "/partials/drafts/trashedDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		});
	//End routeProvider

});