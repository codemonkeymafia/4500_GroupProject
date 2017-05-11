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
 *  Javascript code for searching for a user.
 */

(function() {

    var currentUser;
    var users = [];

    $(document).ready(function() {

        //check authentication
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                currentUser = getGlobalUser();
                //populate dynamic checkbox with available groups

                if (!currentUser.isFaculty) {
                    alert("only faculty can access this page");
                    window.location.href = "announcements.html";
                } else {
                    populateListBox();
                }

            } else {
                // No user is signed in.
                alert("Logging out!");
                window.location.href = "login.html";
            }
        });

        //load list box
        $(".chzn-select").chosen();


    });

    //*******Functions******************
    //populate list box with users from DB (lastname firstname)
    function populateListBox() {
        var fullName = "";
        var userNum = 1;
        //user reference  
        var userRef = firebase.database().ref('users/');

        userRef.orderByChild('lastName').on('child_added', function(snapshot) {

            users.push(snapshot.val());
            console.log(snapshot.val());
            fullName = snapshot.val().lastName + " " + snapshot.val().firstName;

            appendToChosen(snapshot.val().id, fullName);
            userNum += 1;

        });

    }

    //append names to available drop down
    function appendToChosen(id, value) {
        $('.chzn-select')
            .append($('<option></option>')
                .val(id)
                .html(value)).trigger('chosen:updated');
    }

}());
