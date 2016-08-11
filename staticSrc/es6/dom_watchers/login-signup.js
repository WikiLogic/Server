'use strict';

module.exports = {
	init(){
		$('.js-login').on('click', function(){
			console.log('login button clicked!');
			//email
			var speakFriend = $('.js-speak-friend').val();
			//password
			var andEnter = $('.js-and-enter').val();
			
			$.post("login", {
				email: speakFriend,
				password: andEnter
			},
			function(data, status){
				
				if (status == 'success') {
					//redirect to the editor... ?
					window.location.href = "/editor";
				}
			}).done(function(responce){
				console.log('complete', responce);
			}).fail(function(err){
				console.log('login fail', err);
			})
		});

		$('.js-signup').on('click', function(){
			console.log('signup button clicked!');
			//email
			var speakFriend = $('.js-speak-friend').val();
			//password
			var andEnter = $('.js-and-enter').val();
			$.post("signup", {
				email: speakFriend,
				password: andEnter
			},
			function(data, status){
				
				if (status == 'success') {
					//redirect to the editor... ?
					window.location.href = "/editor";
				}
			}).done(function(responce){
				console.log('complete', responce);
			}).fail(function(err){
				console.log('login fail', err);
			})
		});

		$('.js-login-tab').on('click', function(){
			
		});
	}
}