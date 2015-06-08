'use strict';
/*
 * These services handle getting the various lists of claims from the server.
 * Might be an idea to combine them all and simply pass the type of list we're asking for.
 * The server will probably be the one dealing with figuring out the actual list content.
 */

Explorer.factory('getterOfClaims',['$http',
	function($http){
		var service = {
			getListOfClaimsBy: function(expression){
				// Server side, this will be the equivolent of WP_Query();
				//ask the server to send us a list of claims by:
				switch(expression) {
					case 'recent':
						console.log('getting most recent');
						$http.get('/list-claims/:recent').success(function(data, status, headers, config) {
						    console.log('Got the most recent!', data);
						  }).error(function(data, status, headers, config) {
						    console.log('not got the most recent');
						  });
						break;
					case 'popularity':
						console.log('getting popular');
						break;
					case 'Influence':
						console.log('getting claims by influence');
						break;
					case 'Changability':
						console.log('gettign claims by changefuless');
						break;
					case 'Random':
						console.log('getting claims by randomness!');
					default:
						console.log('getting claims by any way I want!');
				}
			}
		};
		return service;
	}]
);