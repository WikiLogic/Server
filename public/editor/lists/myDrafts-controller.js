'use strict';
/**
 * This is the controller for the list of the user's draft claims
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', '$location', 'draftService', function($scope, $rootScope, $location, draftService) {

 	$scope.publishDraft = function(draftClaim){
 	 	draftService.publishDraftClaim(draftClaim);
 	}

 	$scope.deleteDraft = function(draftClaim){
		draftService.deleteDraft(draftClaim);
 	}

}]);