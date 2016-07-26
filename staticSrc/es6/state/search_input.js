'use strict';

/* The Search Input state controller
 * This holds onto the search details (not the results!)
 */

var eventManager = require('../utils/event_manager');


module.exports = {

	init: function(){
		WL_STATE.search_input = {
			term: ""
		}
	},

	setNewTerm: function(newterm){
		WL_STATE.search_input.term = newterm;
		eventManager.fire('search_term_set', newterm);
	}

};