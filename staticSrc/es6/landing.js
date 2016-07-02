$ = require('jquery');



$('.js-login').on('click', function(){
	console.log('login button clicked!');
	//email
	var speakFriend = $('.js-speak-friend').val();
	//password
	var andEnter = $('.js-and-enter').val();

	console.log('speakFriend: ', speakFriend);
	console.log('andEnter: ', andEnter);
	
	$.post("login", {
		email: speakFriend,
		password: andEnter
	},
	function(data, status){
		
		if (status == 'success') {
			//redirect to the editor... ?
			window.location.href = "/editor";
		}
	}).done(function(){
		console.log('complete');
	}).fail(function(){
		console.log('login fail');
	})
});

$('.js-signup').on('click', function(){
	console.log('signup button clicked!');
});