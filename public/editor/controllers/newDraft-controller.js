'use strict';
/**
 * The Editor's New Claim controller,
 * deals with defining new claims.
 */

Editor.controller('NewDraftController', ['$scope', '$rootScope', 'saviorOfClaims', function($scope, $rootScope, saviorOfClaims) {

 	/*
 	 * 
 	 */

 	 $scope.newDraft = {
 	 	description:'',
 	 	wordCount:0
 	 };

 	 /*
 	  * Fires when the user is typing in the description for a new draft claim 
 	  * also when editing an existing draftClaim
 	  */
 	 $scope.newDescriptionCheck = function(){

 	 	//On every change - check if there are any identical claims in the user's draftlist. Highlight them.
 	 	for(var i = 0; i<$scope.user.meta.unPublished.length; i++){
 	 		if ($scope.user.meta.unPublished[i].description == $scope.newDraft.description){
 	 			console.log('we have a draft description match!');
 	 		}
 	 	}

 	 	//check the num of words, if it's changed update it and run the heavy checks
 	 	var newWordCount = $scope.newDraft.description.split(/\s+/).length;
 	 	if (newWordCount != $scope.newDraft.wordCount){
 	 		$scope.newDraft.wordCount = newWordCount;
 	 		
 	 		//only run if 4 or more words
 	 		if (newWordCount > 5){
 	 			//check 
 	 		}
 	 	}
 	 }

 	 /*
 	  * Take what's in the draft claim input, pass it to the servcice to save,
 	  * Once saved the server returns the new draftClaim object with all it's fancyness
 	  */
 	 $scope.saveToProfile = function(){
 	 	saviorOfClaims.saveClaimToProfile($scope.newDraft).success(function(result){

			$scope.user.meta.unPublished.push(result);

		}).error(function(){
			console.log('saving the draft claim to your profile failed somehow');
		});
 	 }

}]);