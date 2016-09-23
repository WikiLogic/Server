'use strict';

module.exports = {

	searchByString(searchTerm){
		var order = 'relevance';
		return $.get('/api?s=' + searchTerm);
	},
	searchMostRecent(){
		return $.post("/api/", {
			action: "getmostrecent"
		});
	}

}