'use strict';
/**
 * 
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', '$location', 'claimService', function($scope, $rootScope, $location, claimService) {


 	 /*
 	  * Moves the Draft claim into the public domain
 	  */
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
 	 	//TODO: double check that the user want's to do this
 	 	claimService.deleteDraft(draftClaim).success(function(result){
 	 		//TODO move this functionality inot the service
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
			
		});
 	 }


}]);