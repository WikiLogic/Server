'use strict';
/**
 * The Explorer list controller,
 * deals with the various types of lists that get laied out
 */

Explorer.controller('ExplorerNavController', ['$scope', '$rootScope', '$location', 'searchClaims', function($scope, $rootScope, $location, searchClaims) {

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

 	 $rootScope.list = {
 	 	listType:'default'
 	 }

 	/*
 	 * Whenever there's a list of claims showing, it's running of $rootScope.list
 	 * This allows
 	 */
	$scope.setListOrderTo = function(sortBy){

		searchClaims.byOrder(sortBy).success(function(result){

			var listArray = result;

			$rootScope.list = {
				claims:listArray,
				listType: 'recent'
			}

		}).error(function(){
			console.log('getting the claims failed somehow');
		});

	}

	$scope.checkNav = function(btnPath){
		console.log('button path: ', btnPath);
		console.log('location.path: ', $location.path());
		if(btnPath == $location.path()){
			return 'active';
		}
	}

}]);