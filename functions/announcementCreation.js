(function() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

        } else {
            // No user is signed in.
            alert("Logging out!");
            window.location.href = "login.html";
        }
    });

    var groupNum = 1;

    $(document).ready(function() {

        populateCheckBox();


        $('#announcementEntry_form').bootstrapValidator({
            container: '#messages',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                announcement_title: {
                    validators: {
                        notEmpty: {
                            message: 'The title is required and cannot be empty'
                        }
                    }
                },
                announcement_message: {
                    validators: {
                        notEmpty: {
                            message: 'An Announcement is required and cannot be empty'
                        }

                    }
                },
                'group[]': {
                    validators: {
                        choice: {
                            min: 1,
                            max: 4,
                            message: 'Please choose at least one Distribution Group'
                        }
                    }

                }
            }

        });



        //when the back button is clicked, go back to announcements page    
        $("#back_button").on("click", function() {
            window.location.href = "announcements.html";
        });

        //when the submit button is pressed for the new announcements form,
        //get the data and try to add new announcement to firebase
        $("#announcementEntry_form").on("submit", function(e) {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                var priority = $("#announcemet_priority").val();
                var title = $("#announcement_title").val();
                var message = $("#announcement_message").val();
                var user = new User(null, "Jeffery", "Calhoun", "jcd39@mail.umsl.edu", null, true, true, null, null);

                //add checked boxes to groups array
                var groups = [];
                $(".checkboxGroups").each(function() {
                    if ($(this).is(':checked')) {
                        groups.push($(this).attr('data-group'));
                    }
                });
                console.log("success");
                addAnnouncement(user, title, message, priority, groups);
            }
        });

    });



    function populateCheckBox() {

        var groupRef = firebase.database().ref('groups/');

        //query firebase group nodes and use 'name' to populate checkbox group
        groupRef.orderByChild('name').on('child_added', function(snapshot) {

            $("#groupCheckbox").append(groupHtmlFromObject(snapshot.val()));
            $('#announcementEntry_form').bootstrapValidator('addField', 'group[]');
            groupNum++;
        });

    }

    //create checkbox input dynamically and use 'data-group' attribute to store group name for DB record downstream
    function groupHtmlFromObject(fbGroup) {

        var html = '<input type = "checkbox" id = "group' + groupNum + '"class = "checkboxGroups" name = "group[]"';
        html += 'data-group="' + fbGroup.name + '">';
        html += '<label>' + fbGroup.name + '</label></br>';
        return html;
    }


    //create label for checkbox
    function getLabel(fbGroup) {

        return '<label>  ' + fbGroup.name + '<label></br>';
    }


    //Creates a new group in Firebase
    function addGroup(name, users) {

        var groupsRef = firebase.database().ref('groups/');
        var newGroupKey = groupsRef.push().key;
        var newGroup = new Group(newGroupKey, name, users);

        var updates = {};
        updates['/groups/' + newGroupKey] = newGroup;
        firebase.database().ref().update(updates);

    }


    //Creates a new announcement in Firebase
    function addAnnouncement(faculty, title, message, priority, groups) {

        var announcementsRef = firebase.database().ref('announcements/');
        var newAnnouncementKey = announcementsRef.push().key;
        var newAnnouncement = new Announcement(newAnnouncementKey, faculty, title, message, priority, groups);

        var updates = {};
        updates['/announcements/' + newAnnouncementKey] = newAnnouncement;
        firebase.database().ref().update(updates).then(function() {
            window.location.href = "announcements.html";
        }, function(error) {
            alert("Failed to add announcement!");
        });
    }


}());