'use strict';
/**
 * 
 */

Editor.controller('MyTrashController', ['$scope', '$rootScope', function($scope, $rootScope) {

 	 /*
 	  * 
 	  */
	$scope.emptyTrash = function(claim){
		if (claim) {

		} else {
			//no item provided - user wants to empty all the trash
		}
	} 

}]);