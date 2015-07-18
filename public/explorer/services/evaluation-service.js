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
					allSupportingFalse: false
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

					//if all the supporting args are false, the main result will be false
					if (result) {
						mainEvaluation.allSupportingFalse = true;
					}
				}
				
				claim.status = mainEvaluation.result;

				return claim;
			},
			evaluateArgument: function(argument){
				/*
				 * This returns the value of an argument based on the status of each reason within
				 */
				 console.log('ARG!');

				 return true;
			}
		};
		return service;
	}]
);