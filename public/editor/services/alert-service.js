'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('alertService',['$http',
	function($http){
		var service = {
			goodThing: function(message){
				console.log('good thing: ', message);
			},
			badThing: function(message){
				console.log('bad thing: ', message);
			},
			normalThing: function(message) {
				console.log('normal thing: ', message);
			}
		};
		return service;
	}]
);