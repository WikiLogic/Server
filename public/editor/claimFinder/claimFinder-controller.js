'use strict';
/**
 * 
 */

Editor.controller('claimFinderController', ['$scope', '$rootScope', '$routeParams', 'draftService', 'searchClaims', 
	function($scope, $rootScope, $routeParams, draftService, searchClaims) {

		//who called me!  Need to change the way I act - they're looking to use one of my results for something
		//Maybe I should just add the result to a rootScope variable? Yeah - that sounds pretty good, super simple!

		$rootScope.finderOpen = false;
		$scope.claimResults = {};
		$scope.claimResults.claims = [];
		$scope.claimResults.myDrafts = [];
		$scope.claimResults.meta = {};

		//initiates search when $rootScope.claimSearch changes
		$rootScope.$watch('claimSearch', function(newVal,oldVal){
			if (newVal === oldVal) {
				//called to init
			} else {
				$rootScope.finderOpen = true;
				searchPublished(newVal);
			}
		});

		//handles the open / close state of the search
		$rootScope.$watch('finderOpen', function(newVal,oldVal){
			/*
			if ($rootScope.finderOpen){
				$('#editor-app').addClass('finderActive');
			} else {
				$('#editor-app').removeClass('finderActive');
			}
			*/

		});

		//search drafts - client side

		//search users published claims - client side, or just highlight them when they appear

		//search published claims - server
		var searchPublished = function(searchTerm){
			//call service
			searchClaims.byString(searchTerm).success(function(result){

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
			$rootScope.finderOpen = false;
		}

	}
]);