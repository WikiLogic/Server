'use strict';
/*
 * These services handle getting the various lists of claims from the server.
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Explorer', [])
.factory('getterOfUsers',['$http',
	function($http){
		var service = {
			getMyData: function(){
				
				/* 
				 * This gets data for an individual user
				 * It should not return any sensitive data
				 */
				return $http.get('/user/myData').success(function(data, status, headers, config) {
					console.log('Got user data in the service! ', data);
					service.myData = data;
				}).error(function(data, status, headers, config) {
					console.log('Getting user data failed - http request error in the service');
				});

			}
		};
		return service;
	}]
);