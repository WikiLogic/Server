'use strict';
var draftService;

describe('Claim Service', function(){
	beforeEach(module('Editor'));

	beforeEach(inject(function(_draftService_){
		draftService = _draftService_;
	}));

	describe('saveDraftToProfile(draftClaim)', function(){
		
		it('should exist', function(){
			expect(draftService.saveDraftToProfile).toBeDefined();
		});
	});
});