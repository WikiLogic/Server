'use strict';
/**
 * saveEdit(draftClaim)
 *
 * publishClaim(draftClaim)
 *
 * deleteDraft(draftClaim)
 *
 */

Editor.controller('draftEditorController', ['$scope', '$rootScope', '$routeParams', 'saviorOfClaims', function($scope, $rootScope, $routeParams, saviorOfClaims) {

	$scope.init = function(){
		if ($rootScope.user) {
			setCurrentDraft($routeParams.id);
		} else {
			//user data hasn't been loaded yet, watch until it has then load draft into editor
			$rootScope.$watch('user', function(newVal,oldVal){
				if (newVal === oldVal) {
					//called to init
				} else {
					setCurrentDraft($routeParams.id);
				}
			});
		}
	}

	var setCurrentDraft = function(draftID){
		console.log('setting current draft for editor');
		for (var i=0; i< $rootScope.user.meta.unPublished.length; i++){
			if ($rootScope.user.meta.unPublished[i]._id == draftID){
				$rootScope.currentDraft = $rootScope.user.meta.unPublished[i];
				break;
			}
		}
	}

	$scope.saveEdit = function(draftClaim){

	}

	$scope.publishClaim = function(claim){
		console.log('going to publish ', claim);
		saviorOfClaims.publishDraftClaim(claim).success(function(result){
			//on success, add result to published claims list & remove from drafts (this has already been done server side)
			console.log('unshifting published array: ', result);
			$rootScope.user.meta.published.unshift(result);
			
			var killDex = $rootScope.user.meta.unPublished.indexOf(claim._id);
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

	/*
	 * type = supporting / opposing test
	 */

	$scope.addArgument = function(side){
		var blankArgObj = {
			status: false,
			reasons: []
		}

		$rootScope.currentDraft[side].push(blankArgObj);
		
		
	}

	$scope.deleteArgument = function(side,argIndex){
		console.log('deleting ', argIndex, ' from ', side);
	}


}]);