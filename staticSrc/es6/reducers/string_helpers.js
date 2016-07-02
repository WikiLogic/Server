'use strict';

module.exports = {

	hasWhiteSpace: function(s) {
		return /\s/g.test(s);
	},

	hasUpperCaseChars: function(s){
		return /[A-Z]/.test(s);
	}
}