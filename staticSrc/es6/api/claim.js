'use strict';

module.exports = {

	getClaimById(claimID){
		/* Takes an ID, 
		 * asks the server for the claim of that ID
		 * Returns the claim
		 */
		return $.post("/api/", {
			action: "getclaimbyid",
			claim: claimID
		});
	},

	getClaimsByIdArray(idArray){
		return $.post("/api/", {
			action: "getbyidarray",
			idarray: idArray
		});
	},

	newClaim(claimString){
		/* Takes a claim string to add as new
		 * sends it to the API
		 * Expects a new claim object to be returned
		 */
		return $.post("/api/", {
			action: "newclaim",
			newClaim: claimString
		});
	},

	newArgument(argObj){
		/* Takes an entire claim object
		 * sends it to the server to add to the specified claim
		 * expects the server to return the updated claim
		 */
		return $.post("/api/", {
			action: "newargument",
			argument: argObj
		});
	}

}
