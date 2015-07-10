'use strict';
/**
 * 
 */

Editor.controller('claimFinderController', ['$scope', '$rootScope', '$routeParams', 'saviorOfClaims', 'getterOfClaims', 
	function($scope, $rootScope, $routeParams, saviorOfClaims, getterOfClaims) {

		//who called me!  Need to change the way I act - they're looking to use one of my results for something
		//Maybe I should just add the result to a rootScope variable? Yeah - that sounds pretty good, super simple!

		$scope.open = false;
		$scope.claimResults = {};
		$scope.claimResults.claims = [];
		$scope.claimResults.meta = {};

		$rootScope.$watch('claimSearch', function(newVal,oldVal){
			if (newVal === oldVal) {
				//called to init
			} else {
				if (!$scope.open){
					//add class to body
					$('#editor-app').addClass('finderActive');
					$scope.open = true;
				}
				console.log('searching: ', newVal);
				searchPublished(newVal);
			}
		});

		//search drafts - client side

		//search users published claims - client side

		//search published claims - server
		var searchPublished = function(searchTerm){
			//call service
			getterOfClaims.searchClaims(searchTerm).success(function(result){

				$scope.claimResults.claims = result;
				console.log('controller search results: ', result);

			}).error(function(){
				console.log('searching the claims failed somehow');
			});
			
		}

		/*
		 * when a claim is selected, set it to the root scope, 
		 * then who ever called this should be using $rootScope.searchSelection
		 * and update accordingly.
		 */
		$scope.selectClaim = function(claim){
			$rootScope.searchSelection = claim;
		}

		$scope.close = function(){
			$('#editor-app').removeClass('finderActive');
			$scope.open = false;
		}

	}
]);