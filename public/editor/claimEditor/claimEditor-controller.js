'use strict';
/**
 * 
 */
console.log('registering claim controller');
Editor.controller('claimEditorController', ['$scope', '$rootScope', '$routeParams', 'claimService', 'userService', 'draftService', 'theEvaluator',
function($scope, $rootScope, $routeParams, claimService, userService, draftService, theEvaluator) {

	$scope.claim = {};
	
	//Init - load the claim
	$scope.init = function(){
		//get the claim from the url id
		claimService.getClaim($routeParams.id);
	}


	$scope.saveAddition = function(claim){
		console.log('TODO: save addition to claim ', claim);
		/*
		draftService.updateDraft(claim).success(function(result){

			console.log('finished saving, current draft: ', $rootScope.currentDraft);

		}).error(function(){
			console.log('saving edits failed somehow');
		});
		*/
	}

	$scope.makeDraftCopy = function(claim){
		console.log('TODO: make a draft copy of this claim to play with... ?', claim);
	}

	$scope.flagClaim = function(claim){
		console.log('TODO: flag this claim... ?');
		//Also TODO - make a list of flags and handlers
	}

	/*
	 * type = supporting / opposing test
	 */
	$scope.addArgument = function(side){
		console.log("adding arg to published claim :D oh yeah!");

		var blankArgObj = {
			status: false,
			reasons: []
		}

		$scope.inFocus[side].push(blankArgObj);
		
	}

	$scope.deleteArgument = function(side,argIndex){
		console.log('deleting ', argIndex, ' from ', side);
		//but only if it's one that this user has just added. Once published - an argument group cannot be deleted, only refuted / proved false
	}

}]);