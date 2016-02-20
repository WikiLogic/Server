'use strict';
/**
 * 
 */

Editor.controller('claimEditorController', ['$scope', '$rootScope', '$routeParams', 'searchClaims', 'userService', 'claimService', 'theEvaluator',
function($scope, $rootScope, $routeParams, searchClaims, userService, claimService, theEvaluator) {

	$scope.claim = {};
	
	//Init - load the claim
	$scope.init = function(){
		//get the claim from the url id
		searchClaims.byID($routeParams.id).success(function(result){

			//$scope.claim = result[0];
			console.log('got claim: ', result[0]);
			$rootScope.currentDraft = result[0];

		}).error(function(){
			//handle the lack of getting a claim :(
		});
	}


	var setCurrentDraft = function(draftID){
		
		console.log('setting current draft for editor (from user object list)');
		for (var i=0; i< $rootScope.user.meta.unPublished.length; i++){
			if ($rootScope.user.meta.unPublished[i]._id == draftID){
				$rootScope.currentDraft = $rootScope.user.meta.unPublished[i];

				break;
			}
		}

		console.log('now getting all the reasons to populate the supporting / opposing args of current draft');
		userService.getDraftClaim($rootScope.currentDraft).success(function(result){
			//on success, set the current draft's args to be the populated version returned from the server
			console.log('POPULATION: ', result);
			$rootScope.currentDraft = result; //TODO - maybe don't replace things that are being edited.

			$rootScope.currentDraft = theEvaluator.evaluateClaim(result);
			
		}).error(function(){
			//TODO: do something when publish fails
		});
	}

	$scope.saveEdit = function(draftClaim){
		console.log('saving edits ', draftClaim);
		claimService.updateDraft(draftClaim).success(function(result){

			console.log('finished saving, current draft: ', $rootScope.currentDraft);

		}).error(function(){
			console.log('saving edits failed somehow');
		});
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
		//TODO: double check that the user want's to do this
		claimService.deleteDraft(draftClaim).success(function(result){
			console.log('Kill ID ' + draftClaim._id);
			console.log('kill list: ' + $rootScope.user.meta.unPublished);
			var unPupList = $rootScope.user.meta.unPublished;
			//TODO: remove it from interface
			for(var i = 0; i < unPupList.length; i++){
				if (unPupList[i]._id == draftClaim._id){
					var killDex = i;
					break;
				}
			}
			console.log('Killdex: ' + killDex);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
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

		$scope.currentDraft[side].push(blankArgObj);
		
		
	}

	$scope.deleteArgument = function(side,argIndex){
		console.log('deleting ', argIndex, ' from ', side);
	}

	$scope.changeDescription = function() {
		//maybe wait a bit?
		$rootScope.claimSearch = $rootScope.currentDraft.description;
	}


}]);