'use strict';

module.exports = {

	getClaimById: function(claimID){
		/*
		 * Takes an ID, 
		 * asks the server for the claim of that ID
		 * Returns the claim
		 */

		$.post("/api/", {
			"claim":claimID
		 })
		 .done(function(data){
		 	console.log('data!', data);
		 })
		 .fail(function(err){
		 	console.error('API fail', err)
		 })
		 .always(function(){
		 	
		 });
		 /*
		$http.post('/claim/get-claim', {'claim':claimID}).success(function(data, status, headers, config) {
			//if the returned object is a qualifying claim object, set to inFocus
			$rootScope.inFocus = data;
			console.log('$rootScope.inFocus', $rootScope.inFocus);
		}).error(function(data, status, headers, config) {
			console.log('Getting claim data failed - http request error in the service');
		});
*/
	}

}
