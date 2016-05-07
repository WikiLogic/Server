'use strict';
/*
 * This service searches the current user's drafts.
 * There's no need to send a request anywhere as we already have all the user's drafts!
 * 
 * The results are then applied to the search results global
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Editor')
.factory('searchDrafts',['$http','$rootScope',
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
				 /*
				return $http.get('/list-claims?sortBy=' + sortBy).success(function(data, status, headers, config) {
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.getListOfClaimsBy:' + sortBy);
				});*/

			},
			byString: function(searchTerm){
				$rootScope.search.term = searchTerm;
				$rootScope.search.order = 'relevance'; //this has no impact... yet
				$rootScope.search.draftResults = []; //clearing any old results out

				//loop through every object in the user's draft list
				Object.keys($rootScope.user.meta.unPublished).forEach(function(key,index) {

					//if the search string is within a draft description string
					var thisDraftDescription = $rootScope.user.meta.unPublished[index].description;
					if ( thisDraftDescription.indexOf(searchTerm) != -1 ) {

						//add the draft to the draftResults array
						$rootScope.search.draftResults.push($rootScope.user.meta.unPublished[index]);
					}
				});

			},
			byID: function(claimID){

				/*
				 * This asks the server for a single claim, by ID 
				 */
				 /*
				return $http.get('/search/claim?id=' + claimID).success(function(data, status, headers, config) {
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.error('getterOfClaims.byID:' + claimID);
				});*/

			},
			clearResults: function(){
				$rootScope.search.term = '';
				$rootScope.search.draftResults = [];
			}
		};
		return service;
	}]
);