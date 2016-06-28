/* Takes tab group state
 * modifies it
 * Returns tab group state
 */

var objectHelpers = require('./object_helpers');
var stringHelpers = require('../reducers/string_helpers');

module.exports = {
	activateTab: function(currentGroupState, tabNameToActivate){
		//clone the object so we don't cause any unintended consequences by tweaking a refrence
		var groupState = objectHelpers.cloneThisObject(currentGroupState);

		for (var t = 0; t < groupState.tabs.length; t++) {
			//set the tabs array item to false
			groupState.tabs[t].active = false;
			//and set it's named counterpart to false
			groupState[groupState.tabs[t].name].set = false;

			if (groupState.tabs[t].name == tabNameToActivate) {
				//set the tab array item to true - yeay!
				groupState.tabs[t].active = true;
				//and it's named counterpart
				groupState[groupState.tabs[t].name].set = true;
			}
		}

		//temp tab will be false
		groupState.tempTab.active = false;

		//add back to state so rivets can render
		return groupState;
	},
	createTabGroup: function(groupName){

		//check if the tab name has any white space or caps, can't do that with rivets	
		if (stringHelpers.hasWhiteSpace(groupName) || stringHelpers.hasUpperCaseChars(groupName)) {
			return "Sorry, tab names cannot have white space or uppercase characters in tab group names";
		}

		//yeay! No errors
		return {
			tabs:[], 
			tempTab: {
				name: '',
				set: false,
				active: false,
				type: ''
			}
		};
	}
}