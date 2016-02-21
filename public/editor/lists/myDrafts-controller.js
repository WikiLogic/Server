'use strict';
/**
 * This is the controller for the list of the user's draft claims
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', '$location', 'claimService', function($scope, $rootScope, $location, claimService) {

 	$scope.publishDraft = function(draftClaim){
 	 	claimService.publishDraftClaim(draftClaim);
 	}

 	$scope.deleteDraft = function(draftClaim){
		claimService.deleteDraft(draftClaim);
 	}

}]);