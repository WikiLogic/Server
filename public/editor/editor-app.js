'use strict';
//The editor requires the explorer as it builds onto it.
var Editor = angular.module('Editor', ['Explorer', 'ngRoute']);
	
Editor.config(function($routeProvider){

	/** The client side router
	 * 
	 */
	 
	 console.log('routing in the config running');
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
			templateUrl: "/editor/draftEditor/draftEditor-partial.html",
			controller: "draftEditorController",
			controllerAs: "draftEditorController"
		})
		.when("/edit-claim/:id",	{
			templateUrl: "/editor/claimEditor/claimEditor-partial.html",
			controller: "claimEditorController",
			controllerAs: "claimEditorController"
		})
		.when("/my-drafts",	{
			templateUrl: "/editor/lists/myDraftsList-partial.html",
			controller: "MyDraftsController",
			controllerAs: "MyDraftsController"
		})
		.when("/my-published",	{
			templateUrl: "/editor/lists/myPublishedList-partial.html",
			controller: "MyPublishedController",
			controllerAs: "MyPublishedController"
		})
		.when("/my-trash",	{
			templateUrl: "/editor/lists/myTrashedList-partial.html",
			controller: "MyTrashController",
			controllerAs: "MyTrashController"
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

Editor.run(function($rootScope, userService, alertService){

	/** The user object
	 * This holds a full user object with all the details we could possibly want!
	 * define then fill.
	 */
	$rootScope.user = {
		meta : {
			unPublished : [],
			published : [],
			trashed : []
		}
	};
	userService.getCurrentUserLists();

	/** The Search
	 * term: the search term
	 * results: an array of the results
	 * order: the order by which the server has given us the results
	 */
	$rootScope.search = {
		term: 'search term',
		results: [],
		order: 'the order'
	};

	/** The Focus object
	 * object: holds a full draft or claim object
	 * highlight: identifies a selected part of the focus object: argument / reason / claim title.
	 */
	$rootScope.focus = {
		object : {},
		highlight : {}
	};

	/** The notification system
	 * enabled turns it on or off
	 * level: High shows all notifications, Low only important alerts like errors
	 * duration: the length of time in seconds for a notification to stay on screen
	 */
	$rootScope.alerts = {
		settings : {
			enabled: true,
			level: 'high',
			duration: 5
		},
		list: []
	};
	alertService.setDummyAlerts();
});