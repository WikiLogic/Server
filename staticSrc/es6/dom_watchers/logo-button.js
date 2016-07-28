var eventManager = require('../utils/event_manager');

module.exports = {
	init(){
		$('.js-logo-button').on('click', function(){
			$('.js-root-sidebar').toggleClass('root-sidebar--show-menu');
			eventManager.fire('main_logo_clicked');
		});
	}
}