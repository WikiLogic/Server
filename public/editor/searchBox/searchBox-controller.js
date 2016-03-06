'use strict';
/**
 * the template (html) runs from the global search results, so we don't need to worry about filling that here.
 * However, me may need to clear it on occasion.
 * 
 */

Editor.controller('SearchBoxController', ['$scope', '$rootScope', function($scope, $rootScope) {

	/*
	 * When the list of results is presented, we do not know what the circomstance may be.
	 * So when a user selects a result, all we do is set the selected result bit of the global: $rootScope.search.selectedResult = {};
	 */
 	$scope.selectResult = function(claimObj, claimType){
 		var newSelectedResult = {
 			'claimObject' : claimObj,
 			'claimType' : claimType
 		}
 		$rootScope.search.selectedResult = newSelectedResult;
 	} 
 	  
}]);