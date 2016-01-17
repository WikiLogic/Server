'use strict';
/*
 * This service sends requests for (published) claims to the server.
 * The results are then applied to the search results global
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Explorer')
.factory('searchClaims',['$http','$rootScope',
	function($http, $rootScope){
		var service = {
			byOrder: function(sortBy){
				$rootScope.search.order = sortBy;
				$rootScope.search.term = ' ';
				
				/* 
				 * Server side, this will be the equivolent of WP_Query();
				 * At the moment we're only asking for order by a few different params.
				 * more will come in the future!  Will have to build up our own query system :)
				 */
				return $http.get('/list-claims?sortBy=' + sortBy).success(function(data, status, headers, config) {
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.getListOfClaimsBy:' + sortBy);
				});

			},
			byString: function(searchTerm){
				$rootScope.search.term = searchTerm;
				$rootScope.search.order = 'relevance';
				/*
				 * Splitting out text search of claims - feels like this'll be a good
				 * idea for the future.
				 */
				return $http.get('/search/claims?searchTerm=' + searchTerm).success(function(data, status, headers, config) {
					$rootScope.search.results = data;
					console.log('The published results are in! ', JSON.stringify(data));
					$rootScope.search.results = [
		{description:"1"},
		{description:"2"},
		{description:"3"},
		{description:"4"}
	];
				}).error(function(data, status, headers, config) {
					$rootScope.search.results = {}; //put the error in as a result and send report home?
					console.error('Error in service: searchClaims.byString(' + searchTerm + ')');
				});



			},
			byID: function(claimID){

				/*
				 * This asks the server for a single claim, by ID 
				 */
				return $http.get('/search/claim?id=' + claimID).success(function(data, status, headers, config) {
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.byID:' + claimID);
				});

			}
		};
		return service;
	}]
);