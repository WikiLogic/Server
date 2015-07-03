'use strict';
/**
 * This gets called twice - once for each side of the arguments.
 * the partial calls init() and passes the side it's on (for / against)
 *
 */

Editor.controller('argumentListController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	

	$scope.init = function(type) {
		$scope.type = type;
	}

	$scope.addReason = function(argIndex){
		console.log('adding reason to: ', argIndex, ' of ', $scope.type);
	}

	$scope.deleteArgument = function(argIndex){
		console.log('deleting ', argIndex, ' from ', $scope.type);
	}


}]);