'use strict';
/**
 * 
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', '$location', 'claimService', function($scope, $rootScope, $location, claimService) {


 	 /*
 	  * Moves the Draft claim into the public domain
 	  */
 	  console.log('unpublished: ', $rootScope.user.meta.published);
 	 $scope.publishDraft = function(draftClaim){
 	 	console.log('going to publish ', draftClaim);
 	 	claimService.publishDraftClaim(draftClaim).success(function(result){
 	 		//TODO, move this functionality inot the sevice
			//on success, add result to published claims list & remove from drafts (this has already been done server side)
			console.log('unshifting published array: ', result);
			$rootScope.user.meta.published.unshift(result);
			
			var killDex = $rootScope.user.meta.unPublished.indexOf(draftClaim._id);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
		});
 	 }

 	 $scope.deleteDraft = function(draftClaim){
		claimService.deleteDraft(draftClaim);
 	 }

}]);