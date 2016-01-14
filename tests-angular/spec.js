/*
 * 
 */
describe('EXPLORER', function(){
	beforeEach(module('Explorer'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('Function name', function(){
		it('should equal 1 and 1', function(){
			expect(1).toEqual(1);
		});
	});
});