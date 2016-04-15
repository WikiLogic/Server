'use strict';
//The editor requires the explorer as it builds onto it. <- Edit, moving all required functionality from explorer into the editor
var Editor = angular.module('Editor', ['Explorer', 'ngRoute']);
	
Editor.config(function($routeProvider){

	/** The client side router
	 * 
	 */
	 
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
		.when("/explore:sort",	{
			templateUrl: "/editor/explorer/explorerList-partial.html",
			controller: "ExplorerController",
			controllerAs: "ExplorerController"
		})
	//End routeProvider

});

Editor.run(function($rootScope, userService, alertService){
	
	/** Focus location Obj & The Focus Location
	 * These are used to pass around refrences to pieces of arguments,
	 * Groups, Reasons, and possibly individual words within reasons (or phrases).
	 */
	$rootScope.theFocusLocation = {
		type : "side|group|reason|word",
		side: "supporting|opposing",
		group: "Index",
		reason: "Index",
		wordIndex: "Index",
		word: "string"
	}

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
		draftResults: [],
		order: 'the order',
		selectedResult: {}
	};


	/** The Focus object
	 * object: holds a full draft or claim object.  When editing a draft or full claim, this is where the local instance is stored.
	 * highlight: identifies a selected part of the focus object: argument / reason / claim title.
	 * each reason has a status: 
	 *		Default = the default text is still in - fail!
	 * 		New = newly created but not yet saved anywhere. When the user saves the parent claim, this will be added as a draft
	 *		Claim = it has been defined as an existing, published claim.
	 *		Draft = it has been defined as an existing draft from the users list.
	 * 		Saved = it has been saved.  All good!
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