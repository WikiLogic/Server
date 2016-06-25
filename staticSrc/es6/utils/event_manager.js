'use strict';

var eventSubscribers = {};

module.exports = {

	subscribe: function(event_name, callback){
		/* Takes the name of an event to subscribe to
		 * and a function to run when that event is fired.
		 * An index number is returned. This will be needed if 
		 * the subscriber is ever to be removed.
		 */
		if (eventSubscribers[event_name]) {
			eventSubscribers[event_name].push(callback);
		} else {
			eventSubscribers[event_name] = [callback];
		}
		console.info('Subscriber added to', event_name);

		return eventSubscribers[event_name].length - 1;
	},

	unsubscribe: function(event_name, index){
		eventSubscribers[event_name].splice(index, 1);
	},

	fire: function(event_name){
		console.info('EVENT: ', event_name);
		if (eventSubscribers[event_name]) {
			for (var s = 0; s < eventSubscribers[event_name].length; s++) { //s for subscriber
				eventSubscribers[event_name][s]();
			}
		}
	}
};