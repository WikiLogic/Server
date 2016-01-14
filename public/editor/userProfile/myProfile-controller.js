'use strict';
/**
 * The Editor list controller,
 * deals with the various types of lists that get laied out
 * the controller name is a duplicate of the Explorer as the list controlls are common but function differently in each app
 */

Editor.controller('MyProfileController', ['$scope', '$rootScope', 'userService', 'searchClaims', function($scope, $rootScope, userService, searchClaims) {
 	 /*
 	  * Handles any requests fro the UI to reset the user data
 	  * Generally only when the app loads (I think)
 	  */
 	 $scope.setUserData = function(){
 	 	userService.getCurrentUserLists();
 	 }

 	 //$scope.setUserData();

 	 /*
 	  * Going to have to refactor this
 	  */
 	 $scope.setListOrderTo = function(sortBy){

		searchClaims.byOrder(sortBy).success(function(result){

			var listArray = result;
			
			$rootScope.list.claims = listArray;
			$rootscope.list.listType = 'recent';
			

		}).error(function(){
			console.log('getting the claims failed somehow');
		});
		
 	 }

}]);