'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('claimService',['$http','$rootScope',
	function($http,$rootScope){
		var service = {
			saveDraftToProfile: function(draftClaim){
				/*
				 * Asking the server to save the draftClaim to the current users profile
				 * draftClaim is an object with a description
				 */
				return $http.post('/draft-claim/new', {'draftClaim':draftClaim}).success(function(data, status, headers, config) {
					//console.log('Claim saved! ', data);
				}).error(function(data, status, headers, config) {
					console.log('save claims service: Could not save claim - womp womp :(');
				});
			},
			updateDraft: function(draftClaim){
				/*
				 * Asking the server to update an existing draftClaim on the current users profile.
				 * This should update everything in the draft
				 */
				return $http.post('/draft-claim/update', {'draftClaim':draftClaim}).success(function(data, status, headers, config) {
					
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
			deleteDraft: function(draftClaim){
				/*
				 * Takes a full draft claim object to delete.  One from the user's draft claim list & 2, from any other drafts that use it.
				 */

				var draftList = $rootScope.user.meta.unPublished;
				var draftUses = "";

				

				var checkForDraftUse = function(side, i) {
					//iterate through this side's arguments
					for (var j = 0; j < draftList[i][side].length; j++) {
						//iterate through this side's reasons
						for (var m = 0; m < draftList[i][side][j].reasons.length; m++) {
							//check if this reason matches the draft we're deleting
							if (draftList[i][side][j].reasons[m] == draftClaim._id) {
								//add it to the list of places it's been used
								draftUses += '"' + draftList[i].description + '"  ';
							}
						}
					}
				}

				//Now we begin running!
				
				for(var i = 0; i < draftList.length; i++){

					//If we find the actual draft to be deleted, note it's index
					if (draftList[i]._id == draftClaim._id){
						var killDex = i;
					}

					console.log('dl: ', draftList[i]);

					//If we find any 
					checkForDraftUse('supporting', i);
					checkForDraftUse('opposing', i);
					
				}

				if (draftUses.length > 1) {
					if (confirm('"' + draftClaim.description + '" is used in: \n' + draftUses + '\nAre you sure you want to delete it?')) {
						//TODO Delete it!
						doTheDelete();
						//AND Delete it from the drafts that use it && save them  ---  Do it in the SERVER ^^^

					} else {
						
					}
				} else {
					//it's not used anywhere
					doTheDelete();
				}

				function doTheDelete(){
					console.log('doing the delete');
					return $http.post('/draft-claim/delete', {'draftClaimID':draftClaim._id}).success(function(data, status, headers, config) {
						console.log('Claim deleted! ', data);
					}).error(function(data, status, headers, config) {
						console.log('save claims service: Could not delete draft - womp womp :(');
					});
				}

				
			},
			publishDraftClaim: function(draftClaim){
				/*
				 * Taking an existing draft claim and publishing it!
				 * The claim mush have at least 1 argument - might cause problems, maybe not
				 */
				return $http.post('/draft-claim/publish', {'draftClaim':draftClaim}).success(function(data, status, headers, config) {
					console.log('Claim published! ', data);
				}).error(function(data, status, headers, config) {
					console.log('save claims service: Could not publish claim - womp womp :(');
				});
			}
		};
		return service;
	}]
);