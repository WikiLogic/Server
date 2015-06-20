'use strict';
/**
 * The Editor's New Claim controller,
 * deals with defining new claims.
 */

Editor.controller('NewClaimController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	/*
 	 * 
 	 */

 	 $scope.newClaim = {};

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