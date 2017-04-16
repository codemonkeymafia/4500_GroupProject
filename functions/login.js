(function(){

	//hide the logout button if the user isn't already signed in

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	//User is signed in to firebase
	  	//read user info from database and store in session storage
	  	firebase.database().ref("users/" + user.uid).once("value").then(function(snapshot){
	  		// console.log("snapshot: " + JSON.stringify(snapshot.val()));
	  		
	  		// console.log(snapshot.val());

	  		setGlobalUser(snapshot.val());
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
		  // $('#login_submit').prop('disabled', false);
		});
		
	}



	// //Creates a user with specified email and randomly generated password in firebase,  then sends password reset link to that user's email
	// function registerUser(email){
	// 	var password = generateRandomPassword();

	// 	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){

	// 		console.log("user created");
	// 		sendPasswordResetEmail(email);

	// 	}, function(error) {
	// 	  // Handle Errors here.
	// 	  var errorCode = error.code;
	// 	  var errorMessage = error.message;
	// 	  // ...
	// 	  console.log(errorMessage);
	// 	});

	// }


	// //Given an email, sends a password reset link to the user with that email, via Firebase

	// function sendPasswordResetEmail(email){
	// 	firebase.auth().sendPasswordResetEmail(email).then(function() {
	// 		  // Email sent.
	// 		  console.log("password reset email sent");
	// 		}, function(error) {
	// 		  // An error happened.
	// 		  console.log("failed to send password reset email");
	// 		});
	// }

	// //Generates a random password
	// function generateRandomPassword(){
	// 	var randomstring = Math.random().toString(36).slice(-8);
	// 	return randomstring;
	// }

//------------------------
	//These functions will be moved to appropriate files in the application later
	function addAnnouncement(faculty, title, message, priority, groups){

		var announcementsRef = firebase.database().ref('announcements/');
		var newAnnouncementKey = announcementsRef.push().key;
		var newAnnouncement = new Announcement(newAnnouncementKey, faculty, title, message, priority, groups);

		var updates = {};
		updates['/announcements/' + newAnnouncementKey] = newAnnouncement;
		firebase.database().ref().update(updates);
	}

	function addGroup(name, users){

		var groupsRef = firebase.database().ref('groups/');
		var newGroupKey = groupsRef.push().key;
		var newGroup = new Announcement(newGroupKey, name, users);

		var updates = {};
		updates['/groups/' + newGroupKey] = newGroup;
		firebase.database().ref().update(updates);

	}


	// function addUser(firstName, lastName, email, groups, isFaculty, isAdmin, phone, office){
	// 	var usersRef = firebase.database().ref('users/');
	// 	var newUserKey = usersRef.push().key;
	// 	var newUser = new User(newUserKey, firstName, lastName, email, groups, isFaculty, isAdmin, phone, office);

	// 	var updates = {};
	// 	updates['/users/' + newUserKey] = user;
	// 	firebase.database().ref().update(updates);
	// }

//---------------------------

}());