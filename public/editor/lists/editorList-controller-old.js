'use strict';
/**
 * The Editor list controller,
 * deals with the various types of lists that get laied out
 * the controller name is a duplicate of the Explorer as the list controlls are common but function differently in each app
 */

Editor.controller('ListController', ['$scope', '$rootScope', 'getterOfUsers', function($scope, $rootScope, getterOfUsers) {

 	 /*
 	  * Once the client side is loaded - this fires off another request to get the list
 	  */
 	 $scope.setUserData = function(){
 	 	//0. Don't need the user's id - it's set in the session!

 	 	//1. ask getterOfUsers service for this users data
 	 	getterOfUsers.getMyData().success(function(result){
			console.log('got user data!', result);
		}).error(function(){
			console.log('getting the user data failed somehow');
		});

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

		getterOfClaims.getListOfClaimsBy(sortBy).success(function(result){

			var listArray = result;
			
			$rootScope.list.claims = listArray;
			$rootscope.list.listType = 'recent';
			

		}).error(function(){
			console.log('getting the claims failed somehow');
		});
		
 	 }

}]);