'use strict';

/* The State Factory
 * You should see in every state controller a request here. 
 * Pass in a state template (an object of the structure you require) and this will return an object
 * conforming to that template without any shared refrences. Otherwise, you might find some troubling
 * side effects when modifying states.
 */

module.exports = {
	create: function(stateTemplate){
		var returnState = Object.create(stateTemplate);
		for (var attr in returnState){
			//array
			if (Array.isArray(returnState[attr])) {
				returnState[attr] = [];
			} else {
				returnState[attr] = returnState[attr];
			}
		}

		return returnState;
	}
}