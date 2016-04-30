'use strict';
/**
 * The Editora list controller,
 * deals with the various types of lists that get laied out
 */

Editor.controller('EditorNavController', 
	['$scope', '$rootScope', '$location', 'searchClaims', 
	function($scope, $rootScope, $location, searchClaims) {

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

 	 //TODO: this was brought over from explorer - candidate for removal
 	 $rootScope.list = {
		order:'default'
	}

	$rootScope.editorList = {
		listType:'default'
	}

	$scope.searchInput = "";
	var previousNavBtnId;

	$scope.searchInputChange = function(){
		console.log('search input changed: ', $scope.searchInput);
	}

	$scope.searchInputSubmit = function(){
		console.log('search input submitted: ', $scope.searchInput);
		searchClaims.byString($scope.searchInput); //sets of the search service, results will be placed in $rootScope....results
		//now move the main view to show search results
		
	}
	/*
	 * This gets called by the navigation, we do our thing, then we call the router
	 */
	$scope.navigate = function(section, verb){
		console.log('NAV FIRED - OH OH');
		
			//highlight button - this is pretty tight with the template... 
			var newButtonID = "#js-nav-" + verb;
			$(previousNavBtnId).removeClass('active');
			$(newButtonID).addClass('active');
			previousNavBtnId = newButtonID;

		if (section == 'explore'){
			//Get list results
			setListOrderTo(verb);

			//set url
		} else if (section == 'edit'){
			var newLocation = '/' + verb;
			$location.path( newLocation );
		}
	}

	var setListOrderTo = function(sortBy){

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


}]);