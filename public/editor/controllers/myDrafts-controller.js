'use strict';
/**
 * 
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', 'getterOfUsers', function($scope, $rootScope, getterOfUsers) {

 	 /*
 	  * 
 	  */
 	 $scope.publishClaim = function(claim){
 	 	console.log('going to publish ', claim);
 	 }


}]);