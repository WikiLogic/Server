'use strict';
/**
 * The Editor's New Claim controller,
 * deals with defining new claims.
 */

Editor.controller('NewDraftController', ['$scope', '$rootScope', '$location', 'claimService', function($scope, $rootScope, $location, claimService) {

 	/*
 	 * 
 	 */
 	var duplicateCheck = false;
 	var submitBtn = document.getElementById("js-saveDraftBtn");

 	 $scope.newDraft = {
 	 	description:'',
 	 	wordCount:0
 	 };

 	 /*
 	  * Fires when the user is typing in the description for a new draft claim 
 	  * also when editing an existing draftClaim
 	  */
 	 $scope.newDescriptionCheck = function(){

 	 	/*
 	 	 * On every change - TODO: look through and arrange the existing draft claims
		 * Currently, this checks for duplicates in the user's drafts
		 * If there is, block the submit button
		 * if not, unblock the submit button (but only if it's blocked - don't want too much painting going on!)
 	 	 */
 	 	for(var i = 0; i<$scope.user.meta.unPublished.length; i++){
 	 		if ($scope.user.meta.unPublished[i].description == $scope.newDraft.description){
 	 			submitBtn.value = "duplicate";
 	 			submitBtn.disabled = true;
 	 			duplicateCheck = true;
 	 		} else {
 	 			if (duplicateCheck){
 	 				submitBtn.value = "Save draft & build arguments";
 	 				submitBtn.disabled = false;
 	 				duplicateCheck = false;
 	 			}
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
 	 	claimService.saveClaimToProfile($scope.newDraft).success(function(result){

			$scope.user.meta.unPublished.push(result);
			$rootScope.currentDraft = result;
			$location.path('/edit-draft');

		});
 	 }

}]);