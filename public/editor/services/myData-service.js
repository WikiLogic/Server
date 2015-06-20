'use strict';
/*
 * These services handle getting the various lists of claims from the server.
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Editor')
.factory('myDataService',['$http',
	function($http){
		var service = {
			getMyWork: function(){
				
				/* 
				 * This asks the server for a list of claims authored by the current user
				 * It returns an object with 2 arrays: published and unPublished
				 */
				return $http.get('/user/myWork').success(function(data, status, headers, config) {
					service.myData = data;
				}).error(function(data, status, headers, config) {
					console.log('Getting user data failed - http request error in the service');
				});

			}
		};
		return service;
	}]
);