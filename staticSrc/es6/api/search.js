'use strict';

module.exports = {

	searchByString: function(searchTerm, sendResultsHere){
		var order = 'relevance';


		return $.get('/api?s=' + searchTerm);
	}

}