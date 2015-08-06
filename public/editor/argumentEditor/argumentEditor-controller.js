'use strict';
/*
 * init()
 * addReason()
 * changeReason()
 * saveNewReason()
 * deleteArgument()
 *
 */

Editor.controller('argumentController', ['$scope', '$rootScope', 'claimService', 'theEvaluator', 
function($scope, $rootScope, claimService, theEvaluator) {

 	
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
			description:'add your description here!',
			state: 'unsaved'
		}
		$rootScope.currentDraft[$scope.side][argIndex].reasons.push(emptyReasonObj);
		
	}

	$scope.changeReason = function(reasonIndex, reasonDecription) {
		//maybe wait a bit?
		$rootScope.claimSearch = reasonDecription;

		//set this reason to active, change state.  -- need to figure out how to turn off active state

		//set this reason to unsaved (until save as new draft is clicked or it's replaced with a search result)
		$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex].state = 'unsaved';

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

				//now evaluate!
				$rootScope.currentDraft = theEvaluator.evaluateClaim($rootScope.currentDraft);

			}
		});
		//$rootScope.claimSearch = $rootScope.currentDraft.description;
		//set which reason is in focus
	}

	/*
	 * When a user writes up a new reason wihtin an argument of the currentDraft, it may not already exist
	 * This allows them to save it as a new, blank draftClaim
	 */
	$scope.saveNewReason = function(reasonIndex){
		console.log('saving new reason as draft: ', reasonIndex);
		//Get the reason from within the global current draft object
		var reasonToSave = $rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex];

		claimService.saveClaimToProfile(reasonToSave).success(function(result){
			//The server has now confirmed the new claim to have been saved and sent us the full claim object

			//add it to the user object 
			$scope.user.meta.unPublished.push(result);

			//replace the reason object with the full returned object (with date, _id, ...)
			$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex] = result;
			
			//Update status
			$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex].state = 'saved!';

		}).error(function(){
			//In the event that the new claim has not been saved - save it locally
			//TODO: save claims locally when server fails
			console.error('TODO: save claims locally when server fails');
		});
	}

	$scope.deleteArgument = function(argIndex){
		console.log('deleting ', argIndex, ' from ', $scope.side);
	}


}]);