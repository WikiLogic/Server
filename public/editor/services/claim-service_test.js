'use strict';
var claimService;

describe('Claim Service', function(){
	beforeEach(module('Editor'));

	beforeEach(inject(function(_claimService_){
		claimService = _claimService_;
	}));

	describe('saveDraftToProfile(draftClaim)', function(){
		
		it('should exist', function(){
			expect(claimService.saveDraftToProfile).toBeDefined();
		});
	});
});