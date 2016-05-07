'use strict';
/**
 * The Explorer list controller,
 * deals with the various types of lists that get laied out
 */

Explorer.controller('ExplorerNavController', ['$scope', '$rootScope', 'searchClaims', function($scope, $rootScope, searchClaims) {

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
		order:'default'
	}
	var previousNavBtnId;

	/*
	 * This gets called by the navigation, we do our thing, then we call the router
	 */
	$scope.navigate = function(section, verb){
		console.log('Editor navigating to: ', section, ' | to:', verb);
		if (section == 'explore'){
			//Get list results
			setListOrderTo(verb);

			//highlight button
			var newButtonID = "#js-nav-" + verb;
			$(previousNavBtnId).removeClass('active');
			$(newButtonID).addClass('active');
			previousNavBtnId = newButtonID;
			
			//set url
		}
	}

	var setListOrderTo = function(sortBy){

		searchClaims.byOrder(sortBy).success(function(result){

			var listArray = result;

			$rootScope.list = {
				claims:listArray,
				order: sortBy
			}

		}).error(function(){
			console.log('getting the claims failed somehow');
		});

	}

}]);