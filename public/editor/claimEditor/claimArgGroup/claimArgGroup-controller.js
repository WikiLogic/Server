'use strict';

/*
 * Welcome to The Argument Controller
 * a new instance is created per argument so we don't need to worry about which side we're on or which arg we're in
 * we're already there!
 */

Editor.controller('claimArgGroupController', ['$scope', '$rootScope', 'draftService', 'searchClaims', 'searchDrafts', 'theEvaluator', 
function($scope, $rootScope, draftService, searchClaims, searchDrafts, theEvaluator) {

 	var searchListener = 'off';

	/**
	 * Each argument has it's own instance of this controller, 
	 * the init stores a refrece to the argument index and which side it's on.
	 * Its called for every argument in the claim's array & for every new argument added by the user
	 */
	$scope.init = function(side, argIndex) {
		$scope.side = side;
		$scope.argIndex = argIndex;
	}

	/**
	 * Sets up an empty reason within this argument group.
	 * The status is set to Default (hopefully to remind users to save before they move away - now forces them).
	 */
	$scope.addReason = function(argIndex){
		var emptyReasonObj = {
			reasonMeta: {
				draft: true,
				state: 'Default'
			},
			claimObjectRefrence: {
				description:'add your description here!'
			}
			
		}
		$rootScope.inFocus[$scope.side][argIndex].reasons.push(emptyReasonObj);
	}

	/**
	 * When a new reason is added - we don't yet know if that reason already exists, either as a published claim or in this user's drafts
	 * So when they start typing, this function is called.
	 * reasonIndex lets us know which reason is in question (of out the list that makes up this argument)
	 * reasonDecription is the string in question - the stuff the user is typing.
	 */
	$scope.changeReason = function(reasonIndex, reasonDecription) {
		//TODO: check if this is a group that has just been added, only allow then. otherwise - nope!

		//Get the active element that the user is typing into
		var columClass = '.argument-editor__args-row__' + $scope.side + '-column',
			argumentClass = '.argument--index-' + $scope.argIndex,
			reasonClass = '.reason--index-' + reasonIndex,
			reasonElement = $(columClass).find(argumentClass).find(reasonClass).find('.js-attach-searchBox'),
			reasonCoords = reasonElement.offset();
		
		//Get the search results tip element and the place we a-want to put it
		var searchResultsElement = $('.searchResultsTip'),
			searchResultsTop = reasonCoords.top + reasonElement.height(),
			searchResultsLeft = reasonCoords.left;

		//Move the search results to the desired location
		searchResultsElement.offset({ top: searchResultsTop, left: searchResultsLeft });

		
		
		//search draft claims from our user's private relm
		searchDrafts.byString(reasonDecription);

		//TODO: uncomment this bit to reduce the load on the server
		//if (reasonDecription.length > 3) {
			//search published claims from the public relm
			searchClaims.byString(reasonDecription);
		//}
		

		

		//set this reason to active, change state.  -- TODO: figure out how to turn off active state

		//set this reason to unsaved (until save as new draft is clicked or it's replaced with a search result)
		$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].reasonMeta.state = 'New'; //State defenitions in editor-app.js

		//now watch for a selection from the search (which is global)
		//but first check if there is already a listener on search.selectedResult
		
		if (searchListener == 'off') {
			
			searchListener = $rootScope.$watch('search.selectedResult', function(newVal,oldVal){
				if (newVal === oldVal) {
					//called to init -but this always happens, why is this here again? Can anyone tell me?
				} else {
					console.log('newVal: ', newVal);
					//set the selected search item and assign it to our reason
					var isThisADraft = false;
					if ($rootScope.search.selectedResult.claimType == 'Draft'){
						isThisADraft = true;
					}
					$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].claimObjectRefrence = $rootScope.search.selectedResult.claimObject;
					$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].reasonMeta.draft = isThisADraft;
					//set the status as 'Claim' - to show that this is a link to an existing published claim, but it's not been saved yet... waht Just save it now!?
					$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].reasonMeta.state = newVal.claimType;
					searchListener(); //clear the watch?
					//hide the search results
					searchDrafts.clearResults();
					searchClaims.clearResults();

					//now evaluate!
					$rootScope.inFocus = theEvaluator.evaluateClaim($rootScope.inFocus);

				}
			});
		} else {
			console.log('listener is on!');
		}

		//$rootScope.claimSearch = $rootScope.inFocus.description;
		//set which reason is in focus
	}

	/*
	 * When a new reason is added - we don't yet know if it already exists, either as a published claim or in this users drafts
	 * Each new reason is required to be saved individually.  I tried running through and adding them individually, but ran up aganst 
	 * some difficulties, so for this prototype whenever the big save button is clicked, the user will be asked to save new drafts
	 * individually, through this function.
	 */
	$scope.saveNewReason = function(reasonIndex){

		//Get the reason from within the global current draft object
		var reasonToSave = $rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex];

		console.log('reasonToSave: ', reasonToSave); //how does this already have an _id ???

		//check if it actually needs to be saved
		if (reasonToSave.reasonMeta.state == 'New') {

			draftService.saveDraftToProfile(reasonToSave.claimObjectRefrence).success(function(result){
				//The server has now confirmed the new claim to have been saved and sent us the full claim object

				//add it to the user object 
				$scope.user.meta.unPublished.push(result);

				//replace the reason object with the full returned object (with date, _id, ...)
				$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].claimObjectRefrence = result;
				
				//Update status
				$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].reasonMeta.state = 'Saved';

			}).error(function(){
				//In the event that the new claim has not been saved - save it locally
				//TODO: save claims locally when server fails
				console.error('TODO: save claims locally when server fails');
				$rootScope.inFocus[$scope.side][$scope.argIndex].reasons[reasonIndex].reasonMeta.state = 'Error';
			});
		} else {
			console.log('state: ', reasonToSave.reasonMeta.state);
			//no need to save - it already exists somewhere. The button should not actually work, but somehow it did and this was called.
		}
	}

	/*
	 * This simply removes the reason from the argument group in the $rootScope.inFocus
	 * We don't care about the details of the reason, if it's new, or an existing published claim, or whatever.
	 */
	$scope.deleteReason = function(reasonIndex){
		$rootScope.inFocus[$scope.side][$scope.argIndex].reasons.splice(reasonIndex, 1);
	}

	/*
	 * This deletes an entire argument group. 
	 * Should probably be a two step thing.
	 */
	$scope.deleteArgument = function(argIndex){
		//TODO: check if this group is in edit / has not yet been published.
		console.log('todo: check if published');
		$rootScope.inFocus[$scope.side].splice(argIndex, 1);
	}


}]);