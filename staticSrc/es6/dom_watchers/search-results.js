'use strict';

var eventManager = require('../utils/event_manager');
var tabStateCtrl = require('../state/tabs');

module.exports = {
	init: function(){

		//whenever the search results are set, set the results temp tab
		eventManager.subscribe('search_results_set', function(){
			console.log('search_results_set subsciber running');
			//clear temp results tab is it's currently tab so it's not auto set as an actual tab 
			tabStateCtrl.addTempTabToGroup('editor', '_');
			//add results as temp tab
			tabStateCtrl.addTempTabToGroup('editor', 'results');
		});
	}
}