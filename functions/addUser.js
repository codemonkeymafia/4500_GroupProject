(function() {

    var currentUser;

    //TODO: Make this script execute before the page even renders
    //Verify that the user is authenticated and priveleged
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //user is logged into firebase
        currentUser = getGlobalUser();

        if( !currentUser.isFaculty ){
            alert("Only faculty can access this page!");
                window.location.href = "announcements.html";
        }
        else{
           //user is verified as faculty
           populateCheckBox();
        }

        //hide and disable the option to add users as faculty if the current user is not an admin
        if( !currentUser.isAdmin ){
            $("#isFacultyField").remove();
            $("#facultyInfo").remove();
        }

      } else {
        // No user is signed in.
        alert("No User!; Logging Out!");
        window.location.href = "login.html";
      }
    });

    var groupNum = 1;

    var groups = [];

    $(document).ready(function() {

        $("#facultyInfo").hide();
        

        //when the back button is clicked, go back to announcements page    
        $("#back_button").on("click", function(){
            window.location.href = "announcements.html";
            
        });

        //when the submit button is pressed for the new announcements form,
        //get the data and try to add new announcement to firebase
        $("#addUserForm").on("submit", function(e){
            e.preventDefault();
            e.stopImmediatePropagation();

            //disable the button while processing
            $("#add_user_submit").attr("disabled", true);

            var email = $("#email").val();
            var firstName = $("#firstName").val();
            var lastName = $("#lastName").val();
            var isAdmin = $("#isAdmin").is(':checked');
            var isFaculty = $("#isFaculty").is(':checked');

            var selectedGroups = new Array();
            $.each($("input[name='group']:checked"), function() {
                // console.log("checked");
              selectedGroups.push(groups[$(this).val()]);
              // or you can do something to the actual checked checkboxes by working directly with  'this'
              // something like $(this).hide() (only something useful, probably) :P
            });


            var phone = $("#phone-areaCode").val() + $("#phone-prefix").val() + $("#phone-suffix").val();
            var office = $("#office").val();
            
            var user = new User(null, firstName, lastName, email, selectedGroups, isFaculty, isAdmin, (isFaculty ? phone : undefined), (isFaculty ? office : undefined));
            
            registerUser(user);
            
            


            
        });

        $("#isFaculty").on("change", function(){
            $("#facultyInfo").toggle();
        });
  
    });


    //TODO: Should be populated by groups a user belongs to; or all groups if the user is an administrator
    function populateCheckBox() {

        if(currentUser.isAdmin){
            //admin can send announcement to any group
            var groupRef = firebase.database().ref('groups/');

            var checkboxIndex = 0;

            //query firebase group nodes and use 'name' to populate checkbox group
            groupRef.orderByChild('name').on('child_added', function(snapshot) {

                groups.push(snapshot.val());
               
                $("#groupCheckbox").append(groupHtmlFromObject(snapshot.val(), checkboxIndex));
                checkboxIndex += 1;
                groupNum++;

            });

        }
        else{

            //only populate the current user's groups
            var checkboxIndex = 0;

            currentUser.groups.forEach(function(group){
                $("#groupCheckbox").append(groupHtmlFromObject(group, checkboxIndex));
                checkboxIndex += 1;
                groupNum++;

            });
        }


    }

    //create checkbox input dynamically and use 'data-group' attribute to store group name for DB record downstream
    function groupHtmlFromObject(fbGroup, index) {

        var html = '<input type = "checkbox" id = "group' + groupNum + '"class = "checkboxGroups" name = "group" value="' + index + '"';
        html += 'data-group="' + fbGroup.name + '">';
        html +='<label>' + fbGroup.name + '</label></br>';
        return html;
    }


    //create label for checkbox
    function getLabel(fbGroup) {

        return '<label>  ' + fbGroup.name + '<label></br>';
    }

    //Creates a user with specified email and randomly generated password in firebase,  then sends password reset link to that user's email
    function registerUser(user){
        var password = generateRandomPassword();

        firebase.auth().createUserWithEmailAndPassword(user.email, password).then(function(newFIRUser){

            console.log("user created");
            sendPasswordResetEmail(user, newFIRUser);

        }, function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorMessage);
        });

    }

    //Given an email, sends a password reset link to the user with that email, via Firebase

    function sendPasswordResetEmail(user, newFIRUser){
        firebase.auth().sendPasswordResetEmail(user.email).then(function() {
              // Email sent.
              console.log("password reset email sent");
              addUser(user, newFIRUser);
              $("#add_user_submit").attr("disabled", false);

            }, function(error) {
              // An error happened.
              console.log("failed to send password reset email");
              $("#add_user_submit").attr("disabled", false);
            });
    }

    //Generates a random password
    function generateRandomPassword(){
        var randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    }

    function addUser(user, newFIRUser){
        var uid = newFIRUser.uid;
        var usersRef = firebase.database().ref('users/');
        // var newUserKey = usersRef.push().key;
        var newUser = new User(uid, user.firstName, user.lastName, user.email, user.groups, user.isFaculty, user.isAdmin, user.phone, user.office);
        usersRef.child(uid).set(newUser, function(){
            $("#add_user_submit").attr("disabled", false);
            //user added to the users database; now add the user to appropriate groups
            var selectedGroups = newUser.groups;

            selectedGroups.forEach(function(group){
                console.log("attempting to add user to " + group.name);
                addUserToGroup(newUser, group);
            });
        });
        // var updates = {};
        // updates['/users/' + newUserKey] = user;
        // firebase.database().ref().update(updates);

        
    }

    function addUserToGroup(user, group){
        var groupUsersRef = firebase.database().ref('groups/' + group.id + "/users/" + user.id + "/");


        groupUsersRef.push(user.id).then(function(){
            // console.log(user.firstName + "added to " + group.name);
        });
    }


}());