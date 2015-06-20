'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('saviorOfClaims',['$http',
	function($http){
		var service = {
			saveClaimToProfile: function(draftClaim){
				/*
				 * Asking the server to save the draftClaim to the current users profile
				 */
				return $http.post('/new-claim/draft', {'draftClaim':draftClaim}).success(function(data, status, headers, config) {
					console.log('Claim saved! ', data);
				}).error(function(data, status, headers, config) {
					console.log('Could not save claim - womp womp :(');
				});
			}
		};
		return service;
	}]
);