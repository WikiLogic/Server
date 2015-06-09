'use strict';
/**
 * The Explorer list controller,
 * deals with the various types of lists that get laied out
 */

Explorer.controller('ListController', ['$scope', '$rootScope', 'getterOfClaims', function($scope, $rootScope, getterOfClaims) {

 	/*
 	 * In this controller we need to deal with the changing between different types of lists
 	 * 		Recent - The most recently added claims
 	 *		Popular - The claims with the highest view count		 	 
 	 *		Influential - The claims used in the highest number of arguments (need a score system to be passed down - server side)
 	 *		Changing - The claims that change state the most frequently (needs a score system - server side)
 	 *		Random - Select at random!
 	 *		
 	 * We do not use controllers to call the server, that's handled by a service.
 	 *
 	 * May have to define a style guide if we're going to pass in parameters to these options.
 	 */

 	 $scope.setListToRecent = function(){

		
 	 	console.log('controller asking for: Recent list');
		var listArray = getterOfClaims.getListOfClaimsBy('recent');
		console.log('controller recieving: ', listArray);

		/* Will have to set root scope.  The controller nav is way far in the DOM */
		$rootScope.list = {
			claims:recentList,
			listType: 'recent'
		}


 	 	//return recentList;
 	 }

 	 $scope.setListToPopular = function(){

 	 }

 	 $scope.setListToInfluential = function(){

 	 }

 	 $scope.setListToChanging = function(){

 	 }

 	 $scope.setListToRandom = function(){

 	 }

}]);