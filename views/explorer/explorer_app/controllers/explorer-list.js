/**
 * The Explorer list controller,
 * deals with the various types of lists that get laied out
 */

(function(){ 
	'use strict';
	angular.module('explorer')
		.controller('ListController', ['$scope', function($scope) {
 			$scope.testing = 'hiya';
		 	console.log('HIYA!');
		}]);
})();