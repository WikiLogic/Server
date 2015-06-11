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

 	 $scope.saveToProfile = function(){
 	 	console.log('controller saving claim');
 	 	saviorOfClaims.saveClaimToProfile($scope.newClaim);
 	 }

}]);