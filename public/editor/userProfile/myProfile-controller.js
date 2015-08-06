'use strict';
/**
 * The Editor list controller,
 * deals with the various types of lists that get laied out
 * the controller name is a duplicate of the Explorer as the list controlls are common but function differently in each app
 */

Editor.controller('MyProfileController', ['$scope', '$rootScope', 'userService', function($scope, $rootScope, userService) {
 	 /*
 	  * This fills the various parts of the user's profile with data,
 	  * normal interaction with these things are handeled by thier own controllers
 	  * but this initial load is more efficent in one place, which is why this is here.
 	  */
 	 $scope.setUserData = function(){
 	 	//0. Don't need the user's id - it's set in the session!

 	 	//1. ask getterOfUsers service for this users data
 	 	userService.getMyWork().success(function(result){
			console.log('got user data!', result);
			$rootScope.user = {
				meta : {
					unPublished : result.drafts,
					published : result.published,
					trashed : result.trashed
				}
			}
			console.log($rootScope);
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

 	 $scope.setUserData();

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