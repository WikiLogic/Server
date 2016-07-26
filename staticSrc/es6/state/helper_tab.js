'use strict';
/* The Temp Tab State Controller
 * 
 */

module.exports = {
	init: function(){
		console.log('initting helper tab state control');
		WL_STATE.helper_tab = {
			show: true,
			open: true,
			show_welcome: true,
			show_results: false,
			show_new_claim: false,
			show_working_list: false,
			show_editor_detail: false
		};
	},
	openHelperTab: function(){
		WL_STATE.helper_tab.open = true;
		WL_STATE.helper_tab.show = true;
	},
	closeHelperTab: function(){
		WL_STATE.helper_tab.open = false;
	},
	hideHelperTab: function(){
		WL_STATE.helper_tab.show = false;
	}
}