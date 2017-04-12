(function() {

    var groupNum = 1;

    $(document).ready(function() {
        
        populateCheckBox();
    
        $("#back_button").on("click", function(){
            //window.location.href = "announcements.html";
            var groups = [];
            $(".checkboxGroups").each(function(){
                if($(this).is(':checked')){  
                    console.log($(this).attr('data-group'));
                    groups.push($(this).attr('data-group'));
                }
               
            });
            console.log( groups);
        });

        $("#announcementEntry_form").on("submit", function(e){
            e.preventDefault();
            var priority = $("#announcemet_priority").val();
            var title = $("#announcement_title").val();
            var message = $("#announcement_message").val();
            var user = new User(null, "Jeffery", "Calhoun", "jcd39@mail.umsl.edu", null, true, true, null, null);
            
            //add checked boxes to groups array
            var groups = [];
            $(".checkboxGroups").each(function(){
                if($(this).is(':checked')){  
                    groups.push($(this).attr('data-group'));
                }
            });
            
            addAnnouncement(user, title, message, priority, groups);
        });
  
    });



    function populateCheckBox() {

        var groupRef = firebase.database().ref('groups/');

        //query firebase group nodes and use 'name' to populate checkbox group
        groupRef.orderByChild('name').on('child_added', function(snapshot) {
           
            $("#groupCheckbox").append(groupHtmlFromObject(snapshot.val()));
            groupNum++;
        });

    }

    //create checkbox input dynamically and use 'data-group' attribute to store group name for DB record downstream
    function groupHtmlFromObject(fbGroup) {

        var html = '<input type = "checkbox" id = "group' + groupNum + '"class = "checkboxGroups" name = "group' + groupNum + '"';
        html += 'data-group="' + fbGroup.name + '">';
        html +='<label>' + fbGroup.name + '</label></br>';
        return html;
    }

    //create label for checkbox
    function getLabel(fbGroup) {

        return '<label>  ' + fbGroup.name + '<label></br>';
    }




    function addGroup(name, users) {

        var groupsRef = firebase.database().ref('groups/');
        var newGroupKey = groupsRef.push().key;
        var newGroup = new Group(newGroupKey, name, users);

        var updates = {};
        updates['/groups/' + newGroupKey] = newGroup;
        firebase.database().ref().update(updates);

    }

    function addAnnouncement(faculty, title, message, priority, groups){

        var announcementsRef = firebase.database().ref('announcements/');
        var newAnnouncementKey = announcementsRef.push().key;
        var newAnnouncement = new Announcement(newAnnouncementKey, faculty, title, message, priority, groups);

        var updates = {};
        updates['/announcements/' + newAnnouncementKey] = newAnnouncement;
        firebase.database().ref().update(updates).then(function(){
            window.location.href="announcements.html";
        }, function(error){
            alert("Failed to add announcement!");
        });
    }

    // function addAnnouncement(announcement) {
    //     var key = firebase.database().ref('announcements/').push().key;
    //     announcement.id = key;
    //     console.log(announcement);
    //     firebase.database().ref('announcements/' + key).set({
    //         announcement: announcement
    //     }).then(function(){
    //         // window.location.href="announcements.html";
    //     });
    // }


}());