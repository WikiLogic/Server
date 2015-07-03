'use strict';
/**
 * This gets called twice - once for each side of the arguments.
 * the partial calls init() and passes the side it's on (for / against)
 *
 */

Editor.controller('argumentListController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	

	$scope.init = function(side) {
		$scope.side = side;
	}

	$scope.addReason = function(argIndex){
		var emptyReasonObj = {
			description:'add your description here!'
		}
		$rootScope.currentDraft[$scope.side][argIndex].reasons.push(emptyReasonObj);
	}

	$scope.deleteArgument = function(argIndex){
		console.log('deleting ', argIndex, ' from ', $scope.side);
	}


}]);