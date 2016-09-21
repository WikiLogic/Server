'use strict';

module.exports = {
	init: function(){
		$('.js-search-recent').on('click', function(event){
			console.log('Search most recent');
		});
	}
}