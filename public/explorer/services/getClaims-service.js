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
					//console.log('Get Claims Service recieving data: ', data);
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.log('Get Claims Service error');
				});

			},
			searchClaims: function(searchTerm){
				/*
				 * Splitting out text search of claims - feels like this'll be a good
				 * idea for the future
				 */
				 console.log('searching servive');
				return $http.get('/search-claims?searchTerm=' + searchTerm).success(function(data, status, headers, config) {
					console.log('search service results: ', data);
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.log('Get Claims Service error');
				});
			}
		};
		return service;
	}]
);