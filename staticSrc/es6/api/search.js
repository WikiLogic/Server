'use strict';

module.exports = {

	searchByString: function(searchTerm, sendResultsHere){
		var order = 'relevance';


		$.get('/api?s=' + searchTerm)
		 .done(function(data) {

			console.log('The published results are in! ', JSON.stringify(data));
			sendResultsHere(data);

		 })
		 .fail(function(err) {
			console.error('API error', err);
		 })
		 .always(function(){

		 });
	}

}