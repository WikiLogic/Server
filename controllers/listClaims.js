var express = require('express'),
    router = express.Router();

/*          /list-claims
 * =================================
 * This is a server side controller that deals with asking the Database for lists of claims.
 * 
 */

	router.get('/:type', function(req, res) {
		var listType = req.param('by');
		console.log('routes recieving request for ', listType);
		var genericClaim = {
			description: 'this is claim 1',
			axiom: false,
			status: true,
			supporting: [
				{
					status: true,
					reasons: [
						{
							description: 'this is a child claim',
							status: true
						}
					]
				},
				{
					status: true,
					reasons: [
						{
							description: 'this is a child claim',
							status: true
						}
					]
				}
			],
			opposing: [
				{
					status: false,
					reasons: [
						{
							description: 'this is a child claim',
							status: false
						}
					]
				},
				{
					status: false,
					reasons: [
						{
							description: 'this is a child claim',
							status: false
						}
					]
				}
			],
			usedIn: [
				{
					status: true,
					reasons: [
						{
							description: 'this is a parent claim',
							status: true
						}
					]
				},
				{
					status: true,
					reasons: [
						{
							description: 'this is a parent claim',
							status: true
						}
					]
				}
			],
			meta: {
				user: {
					local: {
						email: 'email@email.com'
					}
				},
				created: 'today',
				statusChangeCount: 12,
				viewCount: 100
			}
		};
	  res.send(genericClaim);
	});

module.exports = router