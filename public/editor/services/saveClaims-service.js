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
				console.log('service saving claim:', draftClaim);
				
				//console.log(newClaim);
				/* Server side, this will be the equivolent of WP_Query();
				 * At the moment we're only asking for order by a few different params.
				 * more will come in the future!  Will have to build up our own query system :)
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