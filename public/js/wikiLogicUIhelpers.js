var wikiLogicUI = {
    'init': function()
    {
        this.initExpander();
    },
	'initExpander' : function(){
		/*
		 * Gives any element with the class 'js-collapsable' a button to collaps the next sibling
		 */
		$('.js-collapsable-title').each(function(){
			//$(this).prepend('<img src="/icons/black/plus.svg" alt="" class="js-collapsable--btn">');
			$(this).prepend('<div class="js-collapsable--btn"></div>');
			$(this).find('.js-collapsable--btn').on('click', function(){
				console.log('collapse btn clicked!', $(this).parent());
				//animate slide shut
				$(this).parent().next('.js-collapsable-content').slideToggle();
				$(this).parent().toggleClass('collapsed');
			});
		});
	}
};


/* window load might flicker, maybe use jQuery(document).ready(function($) { */
$(window).load(function(){
	 wikiLogicUI.init();
});	