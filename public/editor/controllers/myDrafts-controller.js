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
 	 	saviorOfClaims.publishDraftClaim(claim);
 	 }


}]);