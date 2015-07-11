'use strict';


Editor.controller('argumentListController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	
	/*
	 * Each argument has it's own instance of this controller, 
	 * the init stores a refrece to the argument index and which side it's on.
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
		$rootScope.claimSearch = reasonDecription;

		//set this reason to active, change state.  -- need to figure out how to turn off active state

		//now watch for a selection from the search (which is global)
		//Maybe create a search service - which returns when selected
		var listener = $rootScope.$watch('searchSelection', function(newVal,oldVal){
			if (newVal === oldVal) {
				//called to init
			} else {
				//set the selected search item and assign it to our reason
				$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex] = newVal;
				$rootScope.finderOpen = false;
				listener(); //clear the watch?

			}
		});
		//$rootScope.claimSearch = $rootScope.currentDraft.description;
		//set which reason is in focus
	}

	$scope.deleteArgument = function(argIndex){
		console.log('deleting ', argIndex, ' from ', $scope.side);
	}


}]);