'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('saviorOfClaims',['$http',
	function($http){
		var service = {
			saveClaimToProfile: function(newClaim){
				console.log('service saving claim');
				
				console.log(newClaim);
				/* Server side, this will be the equivolent of WP_Query();
				 * At the moment we're only asking for order by a few different params.
				 * more will come in the future!  Will have to build up our own query system :)
				 */
				 /*
				return $http.get('/list-claims?sortBy=' + sortBy).success(function(data, status, headers, config) {
					console.log('Get Claims Service recieving data: ', data);
					service.claims = data;
				}).error(function(data, status, headers, config) {
					console.log('Get Claims Service error');
				});
				*/

			}
		};
		return service;
	}]
);