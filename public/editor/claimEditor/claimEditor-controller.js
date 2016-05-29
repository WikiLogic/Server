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
		claimService.submitClaimUpdate(claim);
	}

	$scope.makeDraftCopy = function(claim){
		claimService.copyClaimToDrafts(claim);
	}

	$scope.flagClaim = function(claim){
		claimService.submitClaimFlag(claim);
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