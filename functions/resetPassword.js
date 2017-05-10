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
 *  Javascript to reset passwords.
 */

(function(){
	$(document).ready(function(){
		

		$("#resetPasswordForm").on("submit", function(e){
			e.preventDefault();
			e.stopImmediatePropagation();
			$("#message").html("");
			$("#submitButton").attr("disabled", true);
			var email = $("#email").val();
			sendPasswordResetEmail(email);
		});

		$("#back_button").on("click", function(){
			window.location.href = "login.html";
		});

	})

	function sendPasswordResetEmail(email){
		firebase.auth().sendPasswordResetEmail(email).then(function(){
			$("#message").html("Password reset email sent.");
			$("#email").val("");

		}).catch(function(err){
			$("#message").html("Unable to send password reset email.");
			$("#submitButton").attr("disabled", false);
		});
	}
}());
