'use strict';

/* New arguments do not check state wile they are being authored
 * That would be distracting and might entice people to warp their reasoning to respond to the state
 */

var newReason = {
	description: "",
	claimObj: {}
}

var newArgumet = {
	reasons: [Object.create(newReason)],
	addReason: function(claimObj){
		var reasonIsValid = true;
		//first check if this reason already exists in the argument
		for (var r = 0; r < this.reasons; r++){//r for reason
			if (this.reasons[r].description == claimObj.description) {
				console.warn('This reason already exists in the new argument');
				reasonIsValid = false;
				break;
			}
		}

		if (reasonIsValid) {
			console.log('adding reason to argument');
			this.reasons.push(claimObj);
		}
	},
	removeReason: function(claimObj){
		for (var r = 0; r < this.reasons; r++){//r for reason
			if (this.reasons[r].description == claimObj.description) {
				this.reasons.splice(r, 1);
			}
		}
	},
	is_valid: false,
	checkArgument: function(){
		//there should be more than one reason
		if (this.reasons.length < 2) {
			this.isValid = false;
			console.warn('not enough reasons in argument');
			return;
		}

		console.log('new argument group is valid');
		//if we've made it this far, it's passed all our checks!
		this.isValid = true;
	},
	show_results: false,
	search_results: []
}

/* There could be many many places a new argument group is authored (thinking of the node map)
 * So the above is all the individual argument functionality
 * and the below managed which argument to call.
 */
module.exports = {

	init: function(){
		console.log('initting new argument state controller');
		//Here we're just manually creating the new arguments
		WL_STATE.new_arguments = {
			editor_detail_for: Object.create(newArgumet),
			editor_detail_against: Object.create(newArgumet)
		};
	},
	setResults: function(argumentName, resultsArray){
		console.log('setting search results for argument group:', argumentName, resultsArray);
		WL_STATE.new_arguments[argumentName].search_results = resultsArray;
		if (resultsArray.length > 0) {
			WL_STATE.new_arguments[argumentName].show_results = true;
		}
	},
	addReason: function(argumentName, claimObj){
		console.log('adding reason to argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].addReason.call(WL_STATE.new_arguments[argumentName], claimObj);
	},
	removeReason: function(argumentName, claimObj){
		console.log('removing reason from argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].removeReason.call(WL_STATE.new_arguments[argumentName], claimObj);
	},
	checkArgument: function(argumentName){
		console.log('checking argument group:', argumentName);
		WL_STATE.new_arguments[argumentName].checkArgument.call(WL_STATE.new_arguments[argumentName]);
	},
	getArgument: function(argumentName){
		console.log('get argument group:', argumentName);
		return WL_STATE.new_arguments[argumentName];
	},
	clearArgument: function(argumentName){
		console.log('clearing argument group:', argumentName);
	}

};