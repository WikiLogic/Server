'use strict';

/*
 * Welcome to The Argument Controller
 * a new instance is created per argument so we don't need to worry abotu which side we're on or which arg we're in
 * we're already there!
 */

Editor.controller('argumentController', ['$scope', '$rootScope', 'claimService', 'searchClaims', 'searchDrafts', 'theEvaluator', 
function($scope, $rootScope, claimService, searchClaims, searchDrafts, theEvaluator) {

 	
	/**
	 * Each argument has it's own instance of this controller, 
	 * the init stores a refrece to the argument index and which side it's on.
	 * Its called for every argument in the claim's array & for every new argument added by the user
	 */
	$scope.init = function(side, argIndex) {
		console.log('arg index set: ', argIndex);
		$scope.side = side;
		$scope.argIndex = argIndex;
	}

	/**
	 * Sets up an empty reason within this argument group.
	 * The status is set to unsaved (hopefully to remind users to save before they move away).
	 */
	$scope.addReason = function(argIndex){
		var emptyReasonObj = {
			description:'add your description here!',
			state: 'unsaved'
		}
		$rootScope.currentDraft[$scope.side][argIndex].reasons.push(emptyReasonObj);
	}

	/**
	 * When a new reason is added - we don't yet know if it already exists, either as a published claim or in this users drafts
	 * So when they start typing, this function is called.
	 * reasonIndex lets us know which reason is in question (of out the list that makes up this argument)
	 * reasonDecription is the string in question - the stuff the user is typing.
	 */
	$scope.changeReason = function(reasonIndex, reasonDecription) {

		//search published claims from the public relm
		searchClaims.byString(reasonDecription);

		//search draft claims from our user's private relm
		searchDrafts.byString(reasonDecription);

		//set this reason to active, change state.  -- need to figure out how to turn off active state

		//set this reason to unsaved (until save as new draft is clicked or it's replaced with a search result)
		$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex].state = 'New'; //State defenitions in editor-app.js

		//now watch for a selection from the search (which is global)
		//Maybe create a search service - which returns when selected
		/*
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
*/
		//$rootScope.claimSearch = $rootScope.currentDraft.description;
		//set which reason is in focus
	}

	/*
	 * When a new reason is added - we don't yet know if it already exists, either as a published claim or in this users drafts
	 * Each new reason is required to be saved individually.  I tried running through and adding them individually, but ran up aganst 
	 * some difficulties, so for this prototype whenever the big save button is clicked, the user will be asked to save new drafts
	 * individually, through this function.
	 */
	$scope.saveNewReason = function(reasonIndex){
		console.log('saving new reason as draft: ', reasonIndex);
		//Get the reason from within the global current draft object
		var reasonToSave = $rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex];

		claimService.saveDraftToProfile(reasonToSave).success(function(result){
			//The server has now confirmed the new claim to have been saved and sent us the full claim object

			//add it to the user object 
			$scope.user.meta.unPublished.push(result);

			//replace the reason object with the full returned object (with date, _id, ...)
			$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex] = result;
			
			//Update status
			$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex].state = 'Saved';

		}).error(function(){
			//In the event that the new claim has not been saved - save it locally
			//TODO: save claims locally when server fails
			console.error('TODO: save claims locally when server fails');
			$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons[reasonIndex].state = 'Error';
		});
	}

	/*
	 * This simply removes the reason from the argument group in the $rootScope.currentDraft
	 * We don't care about the details of the reason, if it's new, or an existing published claim, or whatever.
	 */
	$scope.deleteReason = function(reasonIndex){
		$rootScope.currentDraft[$scope.side][$scope.argIndex].reasons.splice(reasonIndex, 1);
	}

	/*
	 * This deletes an entire argument group. 
	 * Should probably be a two step thing.
	 */
	$scope.deleteArgument = function(argIndex){
		$rootScope.currentDraft[$scope.side].splice(argIndex, 1);
	}


}]);