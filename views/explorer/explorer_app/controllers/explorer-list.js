/**
 * The Explorer list controller,
 * deals with the various types of lists that get laied out
 */

(function(){ 
	'use strict';
	angular.module('Explorer')
		.controller('ListController', ['$scope', '$rootScope', function($scope, $rootScope) {
 			$scope.testing = 'hiya';
		 	console.log('HIYA!');

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

		 	 $scope.setListToRecent = function(){

		 	 	console.log('setting list to recent');
				var genericClaim = {
					description: 'this is claim 1',
					axiom: false,
					status: true,
					supporting: [
						{
							status: true,
							reasons: [
								{
									description: 'this is a child claim',
									status: true
								}
							]
						},
						{
							status: true,
							reasons: [
								{
									description: 'this is a child claim',
									status: true
								}
							]
						}
					],
					opposing: [
						{
							status: false,
							reasons: [
								{
									description: 'this is a child claim',
									status: false
								}
							]
						},
						{
							status: false,
							reasons: [
								{
									description: 'this is a child claim',
									status: false
								}
							]
						}
					],
					usedIn: [
						{
							status: true,
							reasons: [
								{
									description: 'this is a parent claim',
									status: true
								}
							]
						},
						{
							status: true,
							reasons: [
								{
									description: 'this is a parent claim',
									status: true
								}
							]
						}
					],
					meta: {
						user: {
							local: {
								email: 'email@email.com'
							}
						},
						created: 'today',
						statusChangeCount: 12,
						viewCount: 100
					}
				};

				var recentList = [
					genericClaim
				]

				/* Will have to set root scope.  The controller nav is way far in the DOM */
				$rootScope.list = recentList;
				console.log('$scope.list: ', $rootScope.list);

		 	 	//return recentList;
		 	 }

		 	 $scope.getPopular = function(){

		 	 }

		 	 $scope.getInfluential = function(){

		 	 }

		 	 $scope.getChanging = function(){

		 	 }

		 	 $scope.getRandom = function(){

		 	 }

		}]);
})();