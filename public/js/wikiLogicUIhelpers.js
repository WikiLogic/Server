var wikiLogicUI = {
    'init': function()
    {
    	console.log('loaded!');
        this.initExpander();
    },
	'initExpander' : function(){
		//find .js-expander, register click on it's button
	}
};


/* window load might flicker, maybe use jQuery(document).ready(function($) { */
$(window).load(function(){
	 wikiLogicUI.init();
});