/*
 *  CS 4500 Introduction to the Software Engineering Profession
 *  Keith W. Miller
 *  UMSL Music Department Announcement Application
 *  Code Monkey Mafia
 *  Amanda Rawls - Group Leader
 *  Jeffery Calhoun
 *  Stefan Rothermich
 *  James Steimel
 *  
 *  Javascript to handle login
 */

(function(){

	//hide the logout button if the user isn't already signed in

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	//User is signed in to firebase
	  	//read user info from database and store in session storage
	  	firebase.database().ref("users/" + user.uid).once("value").then(function(snapshot){

	  		if(snapshot.val() == undefined){
		  		//user authenticated, but no profile entry in database. Delete user, revoking authentication credentials

		  		alert("Your credentials are no longer valid; your account will be deleted!");
		  		deleteUserAuth(user);
		  	}
	  		else{
	  			setGlobalUser(snapshot.val());
	  		}
	  	});

	  } else {
	    // No user is signed in.
	  }
	});
	

	var statusMessage = $('#status');
	

	$(document).ready(function(){



		$('#login_form').on('submit', function(e){
			//prevent page reload when login button is clicked
			e.preventDefault();
			e.stopImmediatePropagation();
			$('#login_submit').prop('disabled', true);

			//get email from email field; then clear the field
			var email= $('#login_email').val();
			$('#login_email').val('');

			//get password from password field; then clear the field
			var password = $('#login_password').val();
			$('#login_password').val('');

			//login with the given email and password; and disable the login button
			login(email, password);
			
		});


	
	});


	//signs the user in; currently shows the logout button only if the user is signed in
	function login(email, password){

		firebase.auth().signInWithEmailAndPassword(email, password).then(function(){

			console.log("user signed in");

			//Will call authStateChanged function defined above


			

		}, function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // ...
		  alert("signin failed");
		  console.log("signin failed");
		  $('#login_submit').prop('disabled', false);
		});
		
	}


//------------------------
	//These functions will be moved to appropriate files in the application later

	function addGroup(name, users){

		var groupsRef = firebase.database().ref('groups/');
		var newGroupKey = groupsRef.push().key;
		var newGroup = new Announcement(newGroupKey, name, users);

		var updates = {};
		updates['/groups/' + newGroupKey] = newGroup;
		firebase.database().ref().update(updates);

	}


//---------------------------

}());
