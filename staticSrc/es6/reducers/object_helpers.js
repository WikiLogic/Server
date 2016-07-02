
module.exports = {
	cloneThisObject: function(obj) {
		/* A helper function to clone an object - specifically needed to remove rivet's additional functions.
		 * So we can mutate the clone without rivets firing over and over again.
		 * http://heyjavascript.com/4-creative-ways-to-clone-objects/  (no 2)
		 */
		if (obj === null || typeof obj !== 'object') { return obj; }
		var stringObj = JSON.stringify(obj)
		var newObj = (JSON.parse(stringObj));
		return newObj;
	}
}