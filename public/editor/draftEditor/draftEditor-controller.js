'use strict';
/**
 * 
 */

Editor.controller('draftEditorController', ['$scope', '$rootScope', '$routeParams', 'userService', 'claimService', 'theEvaluator',
function($scope, $rootScope, $routeParams, userService, claimService, theEvaluator) {

	$scope.init = function(){
		if ($rootScope.user) {
			//If user data has been loaded, get the claim ID from the url and set it as the current draft
			setCurrentDraft($routeParams.id);
		} else {
			//user data hasn't been loaded yet, watch until it has then load draft into editor
			$rootScope.$watch('user', function(newVal,oldVal){
				if (newVal === oldVal) {
					//called to init
				} else {
					setCurrentDraft($routeParams.id);
				}
			});
		}

		//Why am I doing this again?
		$('textarea').keypress(function(event) {
			// Check the keyCode and if the user pressed Enter (code = 13) 
			// disable it
			if (event.keyCode == 13) {
				event.preventDefault();
			}
		});
	}

	/*
	 * Here we recieve a claim ID, our job now is to get the details of that claim
	 * and add it as the current draft.  Fortunatly, the user data should already have been loaded meaning we've already got this claim!
	 * (maybe in the future we can put the check in for that and if it hasn't, send a request to the server ourselves)
	 */
	var setCurrentDraft = function(draftID){
		
		//run through the unpublished (draft) list on the user's object looking for a match.
		for (var i=0; i< $rootScope.user.meta.unPublished.length; i++){
			if ($rootScope.user.meta.unPublished[i]._id == draftID){
				//Found a match, set it's details as the curret draft on the global object
				$rootScope.currentDraft = $rootScope.user.meta.unPublished[i];
				break;
			}
		}

		//console.log('now getting all the reasons to populate the supporting / opposing args of current draft');
		userService.getDraftClaim($rootScope.currentDraft).success(function(result){
			//on success, set the current draft's args to be the populated version returned from the server
			//console.log('POPULATION: ', result);
			$rootScope.currentDraft = result; //TODO - maybe don't replace things that are being edited.

			$rootScope.currentDraft = theEvaluator.evaluateClaim(result);
			
		}).error(function(){
			//TODO: do something when publish fails
		});
	}

	/* 
	 * Updates to the main user object should be automatic (thanks angular!)
	 * But I guess I've got this to save updates to the current draft in the Database.
	 */
	$scope.saveEdit = function(draftClaim){
		//First check all the reasons, they all need to be up to date before we can save.
		if ( checkReasonStatus('supporting') && checkReasonStatus('opposing') ) {

			claimService.updateDraft(draftClaim).success(function(result){
			//console.log('finished saving, current draft: ', $rootScope.currentDraft);
			}).error(function(){
				console.log('saving edits failed somehow');
			});

		} else {

			alert('At least 1 reason in one of the arguments has not been saved.  Please make sure all are saved otherwise you may loose data.  This will change in the future but you are using a prototype! Be gentle');
		}
	}

	/** 
	 * Run through the reasons looking for any that haven't been saved.  
	 * Alert the user / show them as needing saved 
	 * If any are needing saved, halt the main saving process.
	 */
	var checkReasonStatus = function(side){
		for (var groupItr = 0; groupItr < $rootScope.currentDraft[side].length; groupItr++) {
			for (var reasonItr = 0; reasonItr < $rootScope.currentDraft[side][groupItr].reasons.length; reasonItr ++) {

				var thisState = $rootScope.currentDraft[side][groupItr].reasons[reasonItr].state;
				switch(thisState) {
					case "New":
						console.error('Theres a New guy in town, thats a fail');
						return false;
						break; 
					case "Default":
						console.error('need to actually fill in any new reasons');
						return false;
						break;
					case "Claim":
						console.error('got an unsaved link to a claim');
						return false;
						break;
					case "Draft":
						console.error('got an unsaved link to a Draft');
						return false;
						break;
					case "Saved":
						console.info('Yeay!! This one is ok :D');
						return true;
						break;
				}
				return false;//if we have a reason but the status is not 'Saved'
			};
		};
		return true; //if there are no arguments.
	}


	$scope.publishClaim = function(claim){
		console.log('going to publish ', claim);
		claimService.publishDraftClaim(claim).success(function(result){
			//on success, add result to published claims list & remove from drafts (this has already been done server side)
			console.log('unshifting published array: ', result);
			$rootScope.user.meta.published.unshift(result);
			
			var killDex = $rootScope.user.meta.unPublished.indexOf(claim._id);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
		}).error(function(){
			//TODO: do something when publish fails
		});
	}

	$scope.deleteDraft = function(draftClaim){
		claimService.deleteDraft(draftClaim).success(function(result){
			//Yeay! Deleted!
		}).error(function(){
			//TODO: Do something when delete fails
		});
	}

	/*
	 * type = supporting / opposing test
	 */

	$scope.addArgument = function(side){
		var blankArgObj = {
			status: false,
			reasons: []
		}

		$rootScope.currentDraft[side].push(blankArgObj);
		
		
	}

	$scope.deleteArgument = function(side,argIndex){
		console.log('deleting ', argIndex, ' from ', side);
	}


	/*
	 * 
	 */
	$scope.changeDescription = function() {
		//maybe wait a bit?
		$rootScope.claimSearch = $rootScope.currentDraft.description;
	}


}]);