'use strict';
/*
 * This is the core of WL! 
 */

angular.module('Explorer')
.factory('theEvaluator',['$http',
	function($http){
		var service = {
			evaluateClaim: function(claim){
				/*
				 * This returns the status of a claim / draft? based on the status of it's supporting / opposing arguments
				 */
				var mainEvaluation = {
					result: true,
					set: false,
					allSupportingFalse: true
				};

				//run through the opposing args
				for (var i = 0; i < claim.opposing.length; i++){
					var result = this.evaluateArgument(claim.opposing[i]);
					claim.opposing[i].status = result;

					//If any opposing are true, then the main result will be false
					if (result) { 
						mainEvaluation.result = false; 
						mainEvaluation.set = true;
					}
				}
				
				//run through the supporting args
				for (var i = 0; i < claim.supporting.length; i++){
					var result = this.evaluateArgument(claim.supporting[i]);
					claim.supporting[i].status = result;

					//if even one of the supporting args comes out true, set this to false
					if (result) {
						mainEvaluation.allSupportingFalse = false;
					}
				}

				//if all the supporting args are false, main eval cannot be true
				if (mainEvaluation.allSupportingFalse) {
					mainEvaluation.result = false;
				}
				
				claim.status = mainEvaluation.result;
				console.log('Claim evaluation: ', mainEvaluation.result);


				return claim;
			},
			evaluateArgument: function(argument){
				/*
				 * This returns the value of an argument based on the status of each reason within
				 */
				var argResult = true;

				//iterate through the reasons, if any are false, the arg is false
				for (var i = 0; i < argument.reasons.length; i++){
					if (!argument.reasons[i].status) {
						argResult = false;
						break;
					}
				}
				return argResult;
			}
		};
		return service;
	}]
);