'use strict';

module.exports = {

	getClaimById: function(claimID){
		/* Takes an ID, 
		 * asks the server for the claim of that ID
		 * Returns the claim
		 */

		$.post("/api/", {
			"action":"getclaimbyid",
			"claim":claimID
		}).done(function(data){
			console.log('data!', data);
		}).fail(function(err){
			console.error('API fail', err)
		});
	},

	newClaim: function(claimString){
		/* Takes a claim string to add as new
		 * sends it to the API
		 * Expects a new claim object to be returned
		 */
		return $.post("/api/", {
			action: "newclaim",
			newClaim: claimString
		});
	},

	newArgument: function(argObj){
		/* Takes an entire claim object
		 * sends it to the server
		 * expects the server to update this claim in the DB
		 */

		//what type?
		var action = "newopposing";
		if (argObj.side) { action = "newsupporting"; } 

		return $.post("/api/", {
			action: action,
			claim: argObj
		});
	}

}
