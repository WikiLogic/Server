'use strict';
/**
 * 
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	 /*
 	  * 
 	  */
 	 $scope.publishClaim = function(claim){
 	 	console.log('going to publish ', claim);
 	 	saviorOfClaims.publishDraftClaim(claim).success(function(result){
			//on success, add result to published claims list & remove from drafts (this has already been done server side)
			console.log('unshifting published array: ', result);
			$rootScope.user.meta.published.unshift(result);
			$rootScope.user.meta.unPublished
			var killDex = $rootScope.user.meta.unPublished.indexOf(claim._id);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
		}).error(function(){
			//TODO: do something when publish fails
		});
 	 }

 	 $scope.deleteDraft = function(draftClaim){
 	 	//TODO: double check that the user want's to do this
 	 	saviorOfClaims.deleteDraft(draftClaim).success(function(result){
			console.log('draft claim deleted');
			//TODO: remove it from interface
			
			
		}).error(function(){
			//TODO: Do something when delete fails
		});
 	 }


}]);