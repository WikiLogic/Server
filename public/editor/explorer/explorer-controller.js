'use strict';
/**
 * The Editor list controller,
 * deals with the various types of lists that get laied out
 * the controller name is a duplicate of the Explorer as the list controlls are common but function differently in each app
 */
 console.log('explorer controller here 1');	

Editor.controller('ExplorerController', ['$scope', '$rootScope', 'userService', 'searchClaims', function($scope, $rootScope, userService, searchClaims) {
	console.log('explorer controller here 2');
 	 /*
 	  * Once the client side is loaded - this fires off another request to get the list
 	  */
 	 $scope.setUserData = function(){
 	 	//0. Don't need the user's id - it's set in the session!

 	 	//1. ask userService service for this users data


		//3. Inject this users data into the DOM
		/*
 	 	var draftClaimsArray = [];
 	 	publishedClaimsArry = [];
 	 	$rootScope.list = {
 	 		draftClaims : draftClaimsArray,
 	 		publishedClaims : publishedClaimsArry
 	 	}
 	 	*/
 	 }


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