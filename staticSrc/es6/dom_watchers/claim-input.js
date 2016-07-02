'use strict';

var trumbowyg = require('trumbowyg');
var actionStateCtrl = require('../state/actions');
var claimApi = require('../api/claim');

module.exports = {
	init: function(){
		console.log('initting trumbowyg');
		$('textarea').trumbowyg({
			prefix: 'trumbowyg-',
			svgPath: false,
			removeformatPasted: true,
			autogrow: true,
			btns: []
		});

		actionStateCtrl.addAction('new_claim', function(rivet){
			
			//who ever called this action better have an id refrence to the text area where this new claim resides
			var newClaimElId = rivet.currentTarget.attributes['data-claim-el-id'].value;

			//so we can use that id to actually get the claimn
			var newClaimString = $('#' + newClaimElId).html();

			//send it to the API
			claimApi.newClaim(newClaimString).done(function(data){
				console.info('new claim has been added!', data);

				//send it to the working list
			}).fail(function(err){
				console.error('new claim api failed', err);

				//send err to the alert system
			});
			
			
		});
	}
}
