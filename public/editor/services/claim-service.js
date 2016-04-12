'use strict';
/*
 * This service sends requests for (published) claims to the server.
 * The results are then applied to the search results global
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */
console.log('resistering claim service');
angular.module('Editor')
.factory('claimService',['$http','$rootScope',
	function($http, $rootScope){
		var service = {
			getClaim: function(claimID){
				/*
				 * Takes an ID, 
				 * asks the server for the claim of that ID
				 * sets 'inFocus' as that claim
				 */
				$http.post('/claim/get-claim', {'claim':claimID}).success(function(data, status, headers, config) {
					//if the returned object is a qualifying claim object, set to inFocus
					$rootScope.inFocus = data;
					console.log('$rootScope.inFocus', $rootScope.inFocus);
				}).error(function(data, status, headers, config) {
					console.log('Getting claim data failed - http request error in the service');
				});

			},
			submitClaimUpdate: function(claim){
				/*
				 * Asking the server to update an existing draftClaim on the current users profile.
				 * This should update everything in the draft
				 */
				return $http.post('/claim/update', {'claim':claim}).success(function(data, status, headers, config) {
					
					//The server has informed us the save was successfull, and returned a copy of the object it saved.
					//Now we add that object to the user object (TODO future, check these two objects against each other?)
					//run through the drafts on the user scope looking for a match
					for (var i=0; i< $rootScope.user.meta.unPublished.length; i++){
						if ($rootScope.user.meta.unPublished[i]._id == data._id){
							//Found a match, set it's details as the curret draft on the global object
							$rootScope.user.meta.unPublished[i] = data;
							break;
						}
					}

					//if current draft has the same ID as the saved claim - update that too.
					if ($rootScope.currentDraft._id == data._id) {
						$rootScope.currentDraft = data;
						//TODO (future) lock out editing while save is happening? Unlock when server returns
					}

				}).error(function(data, status, headers, config) {
					console.log('save claims service: Could not update claim - womp womp :(');
				});
			},
			submitClaimFlag: function(claim, flag){
				//TODO list of flags and how each is handled
				console.log('TODO: claim flag: ', claim, flag);
			},
			copyClaimToDrafts: function(claim){
				console.log('TODO: copy claim to drafts: ', claim);
			},
			search: {
				byOrder: function(sortBy){
					//claimService.search.byOrder()
					$rootScope.search.order = sortBy;
					$rootScope.search.term = ' ';
					
					/* 
					 * Server side, this will be the equivolent of WP_Query();
					 * At the moment we're only asking for order by a few different params.
					 * more will come in the future!  Will have to build up our own query system :)
					 */
					return $http.get('/list-claims?sortBy=' + sortBy).success(function(data, status, headers, config) {
						service.claims = data;
					}).error(function(data, status, headers, config) {
						console.error('getterOfClaims.getListOfClaimsBy:' + sortBy);
					});

				},
				byString: function(searchTerm){
					//claimService.search.byString()
					$rootScope.search.term = searchTerm;
					$rootScope.search.order = 'relevance';
					/*
					 * Splitting out text search of claims - feels like this'll be a good
					 * idea for the future.
					 */
					return $http.get('/search/claims?searchTerm=' + searchTerm).success(function(data, status, headers, config) {
						$rootScope.search.results = data;
						console.log('The published results are in! ', JSON.stringify(data));
						/*
						$rootScope.search.results = [
							{description:"1"},
							{description:"2"},
							{description:"3"},
							{description:"4"}
						];
						*/
					}).error(function(data, status, headers, config) {
						$rootScope.search.results = {}; //put the error in as a result and send report home?
						console.error('Error in service: searchClaims.byString(' + searchTerm + ')');
					});
				},
				byID: function(claimID){
					//claimService.search.byID()

					/*
					 * This asks the server for a single claim, by ID 
					 */
					return $http.get('/search/claim?id=' + claimID).success(function(data, status, headers, config) {
						service.claims = data;
					}).error(function(data, status, headers, config) {
						console.error('getterOfClaims.byID:' + claimID);
					});

				},
			},
			clearResults: function(){
				//claimService.clearResults()
				$rootScope.search.term = '';
				$rootScope.search.results = [];
			}
		};
		return service;
	}]
);