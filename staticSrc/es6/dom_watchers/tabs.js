'use strict';

var $ = require('jquery');
var tabStateCtrl = require('../state/tabs');
tabStateCtrl.init();
var actionStateCtrl = require('../state/actions');

/*
 * This module is responsibe for handling any tab interactions
 * Remember - tabs aren't just the 'tab' looking things that line
 * up accross the top of a page - they are any group of objects
 * that run on a boolean each in which only one can be true.
 * So the logic that runs tabs is the same that might run radio
 * buttons (if we had any).
 */

module.exports = {
	init: function(presetTabs){

		for (var t = 0; t < presetTabs.length; t++){
			console.log('initting tabs');
			if (presetTabs[t].isTemp) {
				tabStateCtrl.createTabGroup(presetTabs[t].groupName);
				tabStateCtrl.addTempTabToGroup(presetTabs[t].groupName, presetTabs[t].tabName);
			} else {
				tabStateCtrl.createTabGroup(presetTabs[t].groupName);
				tabStateCtrl.addTabToTabGroup(presetTabs[t].groupName, presetTabs[t].tabName);
			}
		}


		actionStateCtrl.addAction('activateTab', function(rivet){

			var thsGroupName = rivet.currentTarget.attributes['data-tab-group'].value;
			var thisTabName = rivet.currentTarget.attributes['data-tab-name'].value;

			tabStateCtrl.activateTab(thsGroupName, thisTabName);
		});

		actionStateCtrl.addAction('activateTempTab', function(rivet){

			var thsGroupName = rivet.currentTarget.attributes['data-tab-group'].value;
			var thisTabName = rivet.currentTarget.attributes['data-tab-name'].value;

			tabStateCtrl.activateTempTab(thsGroupName, thisTabName);
		});



		
		actionStateCtrl.addAction('addTab', function(rivet){

			var thsGroupName = rivet.currentTarget.attributes['data-tab-group'].value;
			var thisTabName = rivet.currentTarget.attributes['data-tab-name'].value;

			tabStateCtrl.addTempTabToGroup(thsGroupName, thisTabName);
		});
	}
}