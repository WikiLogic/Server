'use strict';


Editor.controller('argumentListController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	
	/*
	 * this controller gets called for as many args as there are and each passes the side it's on - once for each side: supporting / opposing
	 * The init sets the side so we know which side we're on!
	 */
	$scope.init = function(side, argIndex) {
		console.log('arg index set: ', argIndex);
		$scope.side = side;
		$scope.argIndex = argIndex;
	}

	$scope.addReason = function(argIndex){
		var emptyReasonObj = {
			description:'add your description here!'
		}
		$rootScope.currentDraft[$scope.side][argIndex].reasons.push(emptyReasonObj);
		
	}

	$scope.changeReason = function(reasonIndex, reasonDecription) {
		//maybe wait a bit?
		console.log('changing reason', reasonDecription, ' from reason num ', reasonIndex ,' in arg num ', $scope.argIndex , ' on ', $scope.side);
		$rootScope.claimSearch = reasonDecription;

		//now watch for a selection from the search
		$rootScope.$watch('searchSelection', function(newVal,oldVal){
			if (newVal === oldVal) {
				//called to init
			} else {
				$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex] = newVal;
			}
		});
		//$rootScope.claimSearch = $rootScope.currentDraft.description;
		//set which reason is in focus
	}

	$scope.deleteArgument = function(argIndex){
		console.log('deleting ', argIndex, ' from ', $scope.side);
	}


}]);