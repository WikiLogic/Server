'use strict';
//The editor requires the explorer as it builds onto it.
var Editor = angular.module('Editor', ['Explorer', 'ngRoute']);
	
Editor.config(function($routeProvider){
	console.log('setting up the routes');
	$routeProvider
		.when("/", {
			templateUrl: "/editor/lists/myDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		})
		.when("/new-draft",	{
			templateUrl: "/editor/draftEditor/newDraft-partial.html",
			controller: "NewDraftController",
			controllerAs: "NewDraftController"
		})
		.when("/edit-draft/:id",	{
			templateUrl: "/editor/draftEditor/editDraft-partial.html",
			controller: "draftEditorController",
			controllerAs: "draftEditorController"
		})
		.when("/my-drafts",	{
			templateUrl: "/editor/lists/myDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		})
		.when("/my-published",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/my-trash",	{
			templateUrl: "/editor/lists/trashedDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		})
		.when("/explore/recent",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/explore/popular",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/explore/influence",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/explore/capricious",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/explore/random",	{
			templateUrl: "/editor/lists/claimsList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		});
	//End routeProvider

});