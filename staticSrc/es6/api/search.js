'use strict';

module.exports = {

	searchByString(searchTerm, sendResultsHere){
		var order = 'relevance';


		return $.get('/api?s=' + searchTerm);
	}

}