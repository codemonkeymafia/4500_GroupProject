(function(){

	var uniqueAnnouncements = {};
	var todaysDate = new Date().getTime();
	
	var daysFromTodayToInclude = 14; //# days from current date to filter

	// remove -- replaced with onclick in <a>
	// var logoutButton = $('#logout_button');

	var announcementModal;

	var groupRefs = [];

	var currentUser;

	//var announcementsBaseRef = firebase.database().ref("announcements");
	var announcementsBaseRef = firebase.database().ref("announcements");
	

	$(document).ready(function(){

		firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                currentUser = getGlobalUser();
                //populate dynamic checkbox with available groups

                groupRefs.push("all");
				currentUser.groups.forEach(function(group){
					groupRefs.push(group.id);

					
				});
			}
			else {
                // No user is signed in.
                alert("Logging out!");
                window.location.href = "login.html";
            }
        });




			var groupsFound = 0;

			announcementsBaseRef.on("child_added", function(data){
				var groupID = data.key;
				if($.inArray(groupID, groupRefs) !== -1){
					//the user is a part of this group
					++groupsFound;
					var announcementKeys = Object.keys(data.val());

					//filter out duplicate announcements for the current gruup
					announcementKeys.forEach(function(key){
						if(! uniqueAnnouncements.hasOwnProperty(key)){
							uniqueAnnouncements[key] = data.val()[key];
							// $('.announcements_list').prepend(generateAnnouncementFromTemplate(announcement));
						}
					});

					if(groupsFound === groupRefs.length){
						console.log("done loading announcements");
						var anns = [];
						var ks = Object.keys(uniqueAnnouncements);
						ks.sort();
						ks.forEach(function(key){
							anns.push(uniqueAnnouncements[key]);
						});
				
					
						anns.forEach(function(announcement){
							//only display announcements from the last X # days
							if(getDateDifference(announcement,todaysDate) <= daysFromTodayToInclude){
							$('.announcements_list').prepend(generateAnnouncementFromTemplate(announcement));
						}

						});



						//initial list loaded; now listen for new ones
						console.log("listening for announcements to user's groups");

						groupRefs.forEach(function(subRef){
							announcementsBaseRef.child(subRef).on("child_added", function(data){
								var announcement = data.toJSON();
								if(! uniqueAnnouncements.hasOwnProperty(announcement.id)){
									uniqueAnnouncements[announcement.id] = announcement;
									$('.announcements_list').prepend(generateAnnouncementFromTemplate(announcement));
								}
							});
						});
					}
				}
			});


		//when an announcement is clicked, set the modal data source to that announcement,
		//then display it
		$(".root").delegate('.announcement', 'click', function () {
		    $('body').append(showModal($(this).attr('id')));
			$(announcementModal).modal('show');
		});

         


/* // remove - logout link in menu calls logout() directly.
		//logout when the logout button is clicked
		logoutButton.on('click', function(){
			logout();
			
		});
*/

		//clicking the button to add new announcement takes user to create announcement page
		$("#add_announcement_button").on('click', function(){
			window.location.href = "createAnnouncement.html";
		});

		$("#add_user_button").on("click", function(){
			window.location.href = "addUser.html";
		});


		


		// //listen for current/new announcements for ALL users/groups
		// var announcementsRef = firebase.database().ref('announcements/').orderByChild('postDate');

		// announcementsRef.on("child_added", function(data){
		// 	announcements.unshift(data.toJSON());
		// 	$('.announcements_list').prepend(generateAnnouncementFromTemplate(data.toJSON()));
		// });

	});


function getDateDifference(announcement,todaysDate){
	
	var annDate = new Date(announcement.postDate).getTime();
	
	return (todaysDate-annDate)/(24*3600*1000);
}



	//Creates a new announcement card from a given accouncement
	function generateAnnouncementFromTemplate(announcement){
		//TODO: This was a sloppy fix for an issue where child_added was being called twice.
			//the second call with only the announcement key set (other properties like sender were undefined)
		if(!announcement.sender){
			return;
		}

		var firstName = announcement.sender.firstName;

		//convert announcement author info into a simple spaced string
		var authorName = firstName + " " + announcement.sender.lastName;
        //set the priority class for the announcement card based on the integer priority level set
		var priorityClass;
		switch(parseInt(announcement.priority)){
			case 0:
				priorityClass = "priority-low";
				break;
			case 1:
				priorityClass = "priority-medium";
				break;
			case 2:
				priorityClass = "priority-high";
				break;
			default:
				priorityClass = "priority-low";
				break;
		}

		//FIXME: The below code tries to display the announcement date as today if it is undefined in the announcement object
			//THIS IS A SLOPPY FIX
			//For some reason, when an announcement is added after the initial ones are loaded, firebase is notified of the change before the
			//postDate property is set for that new announcement (it was undefined)

		var announcementHTML = `<div class="announcement" id="` + announcement.id + `">
									<div class="announcement-block">
      						 			<div class="announcement-heading">
      										<h5 class="announcement-title text-center ` + priorityClass + `">` + announcement.title + `</h5>
      										<p class="announcement-author text-left">` + authorName + `</p>
      										<p class="announcement-date text-right">` + $.format.date(announcement.postDate, "MMM dd, yyyy - h:mm a")  + `</p>
      									</div>   
        								<hr>
       									<p class="announcement-message">` + announcement.message + `</p>
						      		</div>
						    	</div>`;
		return announcementHTML;
	}


	//Sets the modal data source to the announcement in the hashmap with the given key
	function showModal(key){
		//find the announcement with the specified key
		var announcement = uniqueAnnouncements[key];

		var groupListArr = [];
		var announcementGroups = announcement.groups;


		//capitalize the name of each group in the array of group names, and store it in the array
		for(var index in announcementGroups){
			groupListArr.push(announcementGroups[index].charAt(0).toUpperCase() + announcementGroups[index].slice(1));
		}

		//sort the list of announcement groups in alphabetical order
		groupListArr.sort();

		//convert array of alphabetized group names to a comma-separated string
		var groupList = groupListArr.join(", ");


	
		
		
		announcementModal = `<div id="myModal" class="modal">
							    <div class="modal-dialog">
							        <div class="modal-content">
							            <div class="modal-header">
							                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							                <h4 class="modal-title">` + announcement.title +  `</h4>
							            </div>
							            <div class="modal-body">
							                <p>` + announcement.message + `</p>
							            </div>
							            <div class="modal-footer">
							                <p>Posted by: ` + announcement.sender.firstName + " " + announcement.sender.lastName +  `</p>
							                <p>On: ` + $.format.date(announcement.postDate, "MMM dd, yyyy - h:mm a") + `</p>
							                <p>To: ` + groupList + `</p>
							            </div>
							        </div>
							    </div>
							</div>`;

		return announcementModal;

	}

}());