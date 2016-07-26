'use strict';

/* The State Factory
 * You should see in every state controller a request here. 
 * Pass in a state template (an object of the structure you require) and this will return an object
 * conforming to that template without any shared refrences. Otherwise, you might find some troubling
 * side effects when modifying states.
 */

module.exports = {
	create: function(stateTemplate){
		console.info("1: ", stateTemplate);
		var returnState = Object.create(stateTemplate);
		console.info("2: ", stateTemplate);
		for (var attr in returnState){
			//array
			if (Array.isArray(returnState[attr])) {
				returnState[attr] = [];
				console.log('array', attr);
			} else {
				console.log('attr', attr);
				returnState[attr] = returnState[attr];
			}
		}
		console.info("3: ", returnState);

		return returnState;
	}
}