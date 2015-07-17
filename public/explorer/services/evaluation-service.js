'use strict';
/*
 * These services handle getting the various lists of claims from the server.
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

angular.module('Explorer')
.factory('theEvaluator',['$http',
	function($http){
		var service = {
			evaluateClaim: function(claim){
				/*
				 * This returns the status of a claim / draft? based on the status of it's supporting / opposing arguments
				 */

				return true;
			},
			evaluateArgument: function(argument){
				/*
				 * This returns the value of an argument based on the status of each reason within
				 */

				 return true;
			}
		};
		return service;
	}]
);