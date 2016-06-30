'use strict';
/* The Temp Tab State Controller
 * 
 */

module.exports = {
	init: function(){
		WL_STATE.welcome_tab = {
			show: true,
			open: true
		};
	},
	openWelcomeTab: function(claimObj){
		WL_STATE.welcome_tab.open = true;
		WL_STATE.welcome_tab.show = true;
	},
	closeWelcomeTab: function(indexToRemove){
		WL_STATE.welcome_tab.open = false;
	},
	hideWelcomeTab: function(){
		WL_STATE.welcome_tab.show = false;
	}
}