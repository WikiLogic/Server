'use strict';
/*
 * These services handle getting the various lists of claims from the server.
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Explorer')
.factory('getterOfClaims',['$http',
	function($http){
		var service = {
			getListOfClaimsBy: function(sortBy){
				
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
			searchClaims: function(searchTerm){

				/*
				 * Splitting out text search of claims - feels like this'll be a good
				 * idea for the future
				 */
				return $http.get('/search/claims?searchTerm=' + searchTerm).success(function(data, status, headers, config) {
					service.claims = data;
					console.log('search results: ', data);
					//set the results to the global
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.searchClaims:' + searchTerm);
				});

			},
			getClaim: function(claimID){

				/*
				 * This asks the server for a single claim, by ID 
				 */
				return $http.get('/search/claim?id=' + claimID).success(function(data, status, headers, config) {
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.getClaim:' + claimID);
				});

			}
		};
		return service;
	}]
);