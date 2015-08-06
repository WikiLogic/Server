'use strict';
/**
 * 
 */

Editor.controller('MyDraftsController', ['$scope', '$rootScope', '$location', 'saviorOfClaims', function($scope, $rootScope, $location, saviorOfClaims) {
	console.log('my drafts controller');
	
	$rootScope.alerts = [];
	var dummyAlert = {
		type:'bad',
		message:'dummy alert!'
	}
	$rootScope.alerts.push(dummyAlert);
	var dummy2 = {
		type:'bad',
		message: 'message'
	}
	$rootScope.alerts.push(dummy2);


	$scope.editDraft = function(draftClaim){
		console.log('Load this into editor: ', draftClaim);
		$rootScope.currentDraft = draftClaim;
		$location.path( '/edit-draft' );
	}
 	 /*
 	  * 
 	  */
 	 $scope.publishDraft = function(draftClaim){
 	 	console.log('going to publish ', draftClaim);
 	 	saviorOfClaims.publishDraftClaim(draftClaim).success(function(result){
			//on success, add result to published claims list & remove from drafts (this has already been done server side)
			console.log('unshifting published array: ', result);
			$rootScope.user.meta.published.unshift(result);
			
			var killDex = $rootScope.user.meta.unPublished.indexOf(draftClaim._id);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
		}).error(function(){
			//TODO: do something when publish fails
		});
 	 }

 	 $scope.deleteDraft = function(draftClaim){
 	 	//TODO: double check that the user want's to do this
 	 	saviorOfClaims.deleteDraft(draftClaim).success(function(result){
			console.log('Kill ID ' + draftClaim._id);
			console.log('kill list: ' + $rootScope.user.meta.unPublished);
			var unPupList = $rootScope.user.meta.unPublished;
			//TODO: remove it from interface
			for(var i = 0; i < unPupList.length; i++){
				if (unPupList[i]._id == draftClaim._id){
					var killDex = i;
					break;
				}
			}
			console.log('Killdex: ' + killDex);
			$rootScope.user.meta.unPublished.splice(killDex, 1);
			
		}).error(function(){
			//TODO: Do something when delete fails
		});
 	 }


}]);