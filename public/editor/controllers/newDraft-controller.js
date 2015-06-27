'use strict';
/**
 * The Editor's New Claim controller,
 * deals with defining new claims.
 */

Editor.controller('NewDraftController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	/*
 	 * 
 	 */

 	 $scope.newDraft = {};

 	 /*
 	  * Fires when the user is typing in the description for a new draft claim 
 	  * also when editing an existing draftClaim
 	  */
 	 $scope.newDescriptionCheck = function(){
 	 	console.log('typing description! ', $scope.newDraft.description);
 	 }

 	 /*
 	  * Take what's in the draft claim input, pass it to the servcice to save,
 	  * Once saved the server returns the new draftClaim object with all it's fancyness
 	  */
 	 $scope.saveToProfile = function(){
 	 	saviorOfClaims.saveClaimToProfile($scope.newClaim).success(function(result){

			$scope.user.meta.unPublished.push(result);

		}).error(function(){
			console.log('saving the draft claim to your profile failed somehow');
		});
 	 }

}]);