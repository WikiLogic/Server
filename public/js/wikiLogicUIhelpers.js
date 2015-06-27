var wikiLogicUI = {
    'init': function()
    {
        this.initExpander();
    },
	'initExpander' : function(){
		$('.js-platinum-accordion-wrap').each(function(){
			var coverHeight = $(this).find('.js-platinum-accordion-cover').height();
			console.log('cover height: ', coverHeight);
			$(this).css('min-height', coverHeight);
		});


		/* Animation 1 
		-----------------------------------------------------------------------------------------------------------------*/
		$('.js-animate-grey-reveal').each(function(){
			var coverHeight = $(this).find('.js-platinum-accordion-cover').height();
			$(this).find('.js-platinum-accordion-cover').css('bottom', -coverHeight);
		});

		$('.js-animate-grey-reveal').on('click', function(){
			//find js-platinum-accordion-content-wrap height
			var expandedHeight = $(this).find('.js-platinum-accordion-content-wrap').height();
			//animate expander to height
			$(this).find('.js-platinum-accordion-expander').animate({height:expandedHeight});
		});

		$('.js-animate-grey-reveal').find('.js-platinum-accordion-close').on('click', function(event){
			$(this).closest('.js-platinum-accordion-wrap').find('.js-platinum-accordion-expander').animate({height:0});
			event.stopPropagation();
		});


		$('.js-animate-push-from-top-with-fade').find('.js-platinum-accordion-close').on('click', function(event){
			var thisWrap = $(this).closest('.js-platinum-accordion-wrap');
			thisWrap.find('.js-platinum-accordion-content-wrap').animate({height:0});
			thisWrap.find('.js-platinum-accordion-cover').animate({top:0,opacity:1});
			event.stopPropagation();
		});
	}
};


/* window load might flicker, maybe use jQuery(document).ready(function($) { */
jQuery(window).load(function(){
	 wikiLogicUI.init();
});