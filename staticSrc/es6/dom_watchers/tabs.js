'use strict';

var $ = require('jquery');
var tabStateCtrl = require('../state/ui.tabs');

/*
 * This module is responsibe for handling any tab interactions
 * Remember - tabs aren't just the 'tab' looking things that line
 * up accross the top of a page - they are any group of objects
 * that run on a boolean each in which only one can be true.
 * So the logic that runs tabs is the same that might run radio
 * buttons (if we had any).
 */

module.exports = {
	init: function(){

		$('.js-tab').each(function(){
			var $thisTab = $(this);

			//get the tab group name
			var thisTabGroupName = $thisTab.data('tab-group');

			//add it (the state control won't add twice, don't worry! It's worth the extra calls for the flexibility!)
			tabStateCtrl.createTabGroup(thisTabGroupName);

			//get the tab name
			var thisTabName = $thisTab.data('tab-name');
			
			//TODO check if this tab wants to be initially true, as opposed to the first tab being so


			//add it to the parent group
			tabStateCtrl.addTabToTabGroup(thisTabGroupName, thisTabName);

			//now watch for click events
			$thisTab.on('click', function(){
				var $this = $(this);
				var thisTabName = $this.data('tab-name');
				var thisTabGroup = $this.data('tab-group');

				tabStateCtrl.activateTab(thisTabGroup, thisTabName);
			});
		});
	}
}