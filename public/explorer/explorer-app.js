'use strict';
var Explorer = angular.module('Explorer',[]);


Explorer.run(function($rootScope){
	//Not including the alert service here, gotta log in and become a member to get that goodie!
	/** The Search
	 * term: the search term
	 * results: an array of the results
	 * order: the order by which the server has given us the results
	 */
	$rootScope.search = {
		term: 'search term',
		results: [],
		order: 'the order'
	};
});