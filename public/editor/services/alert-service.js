'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('alertService',['$http', '$rootScope',
	function($http, $rootScope){
		var service = {
			setDummyAlerts: function(){
				var dummyAlert = {
					type:'bad',
					message:'dummy alert!'
				}
				$rootScope.alerts.list.push(dummyAlert);
				var dummy2 = {
					type:'bad',
					message: 'message'
				}
				$rootScope.alerts.list.push(dummy2);
			},
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