//signs user out of application, and redirects to login page
	function logout(){
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  sessionStorage.clear();
		  if(window.location.href !== "login.html"){
		  	window.location.href = "login.html";
		  }

		}).catch(function(error) {
		  // An error happened.
		  console.log("Error logging out of firebase");
		});	
	}

	//save User object to sessionStorage
	function setGlobalUser(user){

		if(sessionStorage){
			sessionStorage.setItem("currentUser", JSON.stringify(user));
		  	window.location.href = "announcements.html";
		}
		else{
			console.log("session storage not available!");
			logout();
		}
	}

	//read and return User object from sessionStorage 
	function getGlobalUser(){
		if(sessionStorage){
			var currentUserString = sessionStorage.getItem("currentUser");
		  	if(!currentUserString){
		  		console.log("Unable to retrieve user!");
				logout();
		  	}
		  	else{
		  		return $.parseJSON(currentUserString);
		  	}
		}
		else{
			console.log("session storage not available!");
			logout();
		}
	}