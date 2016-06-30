'use strict';
/* The Temp Tab State Controller
 * 
 */

module.exports = {
	init: function(){
		WL_STATE.temp_tab = {
			show: false,
			open: false
		};
	},
	setTempTab: function(tabObj){
		WL_STATE.temp_tab.name = tabObj.name;
		WL_STATE.temp_tab.data = tabObj.data;
		WL_STATE.temp_tab.show = true;
		WL_STATE.temp_tab.open = true;
	},
	openTempTab: function(claimObj){
		WL_STATE.temp_tab.open = true;
	},
	closeTempTab: function(indexToRemove){
		WL_STATE.temp_tab.open = false;
	}
}