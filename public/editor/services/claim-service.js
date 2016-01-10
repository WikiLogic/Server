'use strict';
/*
 * These services handle the saving of claims, they're set as an editor service 
 * as it's a restricted activity (not on the client side - on the server side)
 */

angular.module('Editor')
.factory('claimService',['$http','$rootScope','userService',
	function($http,$rootScope,userService){
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
				 * Takes a full draft claim object to delete, I'll call it "Del Boy" for clarity :)
				 * Del Boy is deleted from the user's draft claim list.
				 * Del Boy also deleted from any other drafts in the user's draft list that refrence him.
				 * This should account for all instances - no published claim should refrence Del Boy as he lives in the shadows (it is not public).
				 */

				var draftList = $rootScope.user.meta.unPublished;
				var draftUses = "";

				var checkForDraftUse = function(side, i) {
					//iterate through the given side's arguments
					for (var j = 0; j < draftList[i][side].length; j++) {
						//iterate through the current argument's reasons
						for (var m = 0; m < draftList[i][side][j].reasons.length; m++) {
							//check if this reason is Del Boy
							if (draftList[i][side][j].reasons[m] == draftClaim._id) {
								//add to the list of places it's been used
								draftUses += '"' + draftList[i].description + '"  ';
							}
						}
					}
				}

				//Now we run through each draft in the user's draft list
				for(var i = 0; i < draftList.length; i++){

					//If we find Del Boy himself - note the index
					if (draftList[i]._id == draftClaim._id){
						var killDex = i;
					}

					//For all the other draft claims, check for signs of Del Boy
					checkForDraftUse('supporting', i);
					checkForDraftUse('opposing', i);
				}

				/* 
				 * Now we should have found every instance of Del Boy.
				 * If he is being used in other drafts, however, it would probably be good to 
				 * check with the user that they really want to go through with the deletion.
				 */

				if (draftUses.length > 1) {
					if (confirm('"' + draftClaim.description + '" is used in: \n' + draftUses + '\nAre you sure you want to delete it?')) {
						//Yep, they really want to kill him!
						doTheDelete();
					} else {
						//I guess they didn't really want to kill Del Boy
					}
				} else {
					//Del Boy's not of any use to anyone, so no need to double check :)
					doTheDelete();
				}

				function doTheDelete(){
					return $http.post('/draft-claim/delete', {'draftClaimID':draftClaim._id}).success(function(data, status, headers, config) {
						console.log('Claim deleted! ', data);
						tidyUpDelBoysRemains();
					}).error(function(data, status, headers, config) {
						console.log('We asked the server to delete Del Boy, but it seems Del Boy has sabotaged the effort - womp womp :(');
					});
				}

				//Murder has been committed. Time to tidy up the crime scene.
				function tidyUpDelBoysRemains(){
					//remove him from the user's draft list
					//remove any instance of him from wherever he was refrenced
					//actually, all that is too much work - lets just get a refreshed user object from the server :)
					userService.getCurrentUserLists();
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