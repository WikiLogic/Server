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
		alert("Data: " + data + "\nStatus: " + status);
	});
});

$('.js-signup').on('click', function(){
	console.log('signup button clicked!');
});