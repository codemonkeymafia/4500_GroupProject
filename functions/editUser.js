(function() {
    var currentUser;
    var groups = [];
    var groupNum = 1;
    var userKey; //key passed to page of user 


    $(document).ready(function() {

    //authentication
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                currentUser = getGlobalUser();
                //populate dynamic checkbox with available groups

                if (!currentUser.isFaculty) {
                    alert("only faculty can access this page");
                    window.location.href = "index.html";
                } else {
                    populateUserInfo();
                }

            } else {
                // No user is signed in.
                alert("Logging out!");
                window.location.href = "login.html";
            }
        });




        //form submission**TODO****
        $("#editUserForm").on("submit", function(e) {
            
            e.preventDefault();
            e.stopImmediatePropagation();

            console.log("Form Submitted");
            var buttonClicked = document.activeElement.getAttribute('value');
            
            //if edit pushed, modify existing record
            if(buttonClicked == 'Edit'){
                
                console.log("Edit pushed for child " + userKey);
                
                var checked = getCheckedGroups();
                console.log(checked);
                
                var userRef = firebase.database().ref('users/' + userKey);
                    console.log($('#firstName').val());
                    console.log($('#lastName').val());
                    console.log($('#email').val());

                    
                //update child with key value, with form data
                userRef.set({ firstName: $('#firstName').val(), lastName: $('#lastName').val(), email: $('#email').val(), id: userKey, groups: checked }).then(function() {
                      console.log('Synchronization succeeded');
                      
                      //redirect back to searchUser page
                       window.location.href  = "searchUser.html";
                    })
                    .catch(function(error) {
                      console.log('Synchronization failed');
                      console.log(error);
                    });
                   
            }
            //if delete pressed, delete user
            else if(buttonClicked == 'Delete'){
                
                console.log("Delete pushed for child " + userKey);
                
                var child = firebase.database().ref('users/').child(userKey);
                 child.remove();
          
                window.location.href  = "searchUser.html";
                          
            }
            else{
                console.log("Invalid button pressed");
            }

        });




        //form validation
        $('#editUserForm').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                firstName: {
                    validators: {
                        notEmpty: {
                            message: 'The first name is required and cannot be empty'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z]+$/,
                            message: 'First name can only contain letters'
                        }
                    }
                },
                lastName: {
                    validators: {
                        notEmpty: {
                            message: 'The last name is required and cannot be empty'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z]+$/,
                            message: 'Last name can only contain letters'
                        }
                    }
                },
                //
                //placeholder if we actually want dynamic form validation
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Please enter an email address'
                        },
                        emailAddress: {
                            message: 'The value is not a valid email address'
                        }
                    }

                }
            }

        });



    });

    //*******FUNCTIONS****************************************

    //populte form with user data based off firebase key passed to page
    function populateUserInfo() {
        
        userKey = param('user-key');
        console.log(userKey);
        fillForm(getUserInfo(userKey));
    }


    //from URL get user key passed to this page
    function param(name) {
        return (location.search.split(name + '=')[1] || '').split('&')[0];
    }

    //get user info using key provided
    function getUserInfo(keyValue) {

        var userRef = firebase.database().ref('users/');

        userRef.child(keyValue).once('value', function(snapshot) {

            fillForm(snapshot.val());
        });

    }
    
    //populate form
    function fillForm(userObj) {
        console.log(userObj);
        console.log(userObj.firstName);
        console.log(userObj.lastName);
        console.log(userObj.email);
        $('#firstName').val(userObj.firstName);
        $('#lastName').val(userObj.lastName);
        $('#email').val(userObj.email);
        populateCheckBox(userObj);
    }

    //populate checkboxes
    //function to create checkboxes from groups available to user, or if admin - all groups in firebase DB
    function populateCheckBox(userObj) {


        //admin can send announcement to any group
        var groupRef = firebase.database().ref('groups/');

        var checkboxIndex = 0;

        //query firebase group nodes and use 'name' to populate checkbox group
        groupRef.orderByChild('name').on('child_added', function(snapshot) {

            groups.push(snapshot.val());

            $("#groupCheckbox").append(groupHtmlFromObject(snapshot.val(), checkboxIndex, userObj.groups));
            checkboxIndex += 1;
            groupNum++;
        });

    }

    //function to build html string for checkboxes
    //check box if exists as a group the user is associated with
    function groupHtmlFromObject(fbGroup, index, grpList ) {
        var isChecked = "";
        
        for(var grp in grpList){
            console.log(grpList[grp]);
            if(grpList[grp].name === fbGroup.name){
            isChecked = "checked";
            }
        }
        
        var html = '<input type = "checkbox" id = "group' + groupNum + '"class = "checkboxGroups" name = "group" value="' + index + '"';
        html += 'data-group="' + fbGroup.name + '"' + isChecked + '>';
        html += '<label>' + fbGroup.name + '</label></br>';
        return html;
    }
    
    //get checked groups before editing
    function getCheckedGroups(){
        
        var checkedGroups = [];
        var groupObj = [];
        
        $(".checkboxGroups:checked").each(function() {
            checkedGroups.push($(this).attr('data-group'));
        });
        
        var groupRef = firebase.database().ref('groups/');

        var checkboxIndex = 0;

        //query firebase group nodes and use 'name' to populate checkbox group
        groupRef.orderByChild('name').on('child_added', function(snapshot) {

        
         for(var grp in checkedGroups){
            console.log(checkedGroups[grp]);
            if(checkedGroups[grp] === snapshot.val().name){
            groupObj.push(snapshot.val());
            }
        }
         
        });
        
        return groupObj;

    }
    




}());