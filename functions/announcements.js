(function(){

	var announcements = [];
	var logoutButton = $('#logout_button');

	var announcementModal;

	$(document).ready(function(){

		//when an announcement is clicked, set the modal data source to that announcement,
		//then display it
		$("body").delegate('.announcement', 'click', function () {
		    $('body').append(showModal($(this).index()));
			$(announcementModal).modal('show');
		});


		//logout when the logout button is clicked
		logoutButton.on('click', function(){
			logout();
			
		});

		//clicking the button to add new announcement takes user to create announcement page
		$("#add_announcement_button").on('click', function(){
			window.location.href = "createAnnouncement.html";
		});

		$("#add_user_button").on("click", function(){
			window.location.href = "addUser.html";
		});


		//listen for current/new announcements for ALL users/groups
		var announcementsRef = firebase.database().ref('announcements/').orderByChild('postDate');

		announcementsRef.on("child_added", function(data){
			announcements.unshift(data.toJSON());
			$('.announcements_list').prepend(generateAnnouncementFromTemplate(data.toJSON()));
		});

	});




	//Creates a new announcement card from a given accouncement
	function generateAnnouncementFromTemplate(announcement){

		//convert announcement author info into a simple spaced string
		var authorName = announcement.sender.firstName + " " + announcement.sender.lastName;
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

		var announcementHTML = `<div class="announcement">
									<div class="announcement-block">
      						 			<div class="announcement-heading">
      										<h5 class="announcement-title text-center ` + priorityClass + `">` + announcement.title + `</h5>
      										<p class="announcement-author text-left">` + authorName + `</p>
      										<p class="announcement-date text-right">` + $.format.date(announcement.postDate || new Date(), "MMM dd, yyyy")  + `</p>
      									</div>   
        								<hr>
       									<p class="announcement-message">` + announcement.message + `</p>
						      		</div>
						    	</div>`;
		return announcementHTML;
	}


	//Sets the modal data source to the announcement at the selected position
	function showModal(position){
		var announcement = announcements[position];

		var groupList = "";

		//FIXME: The following code should create a list of groups from the announcemnt groups array
			//currently, it simply tries to get one group from the announcemen

		if(announcement.groups){

			groupList += announcement.groups[0].name;
		}
		
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
							                <p>On: ` + $.format.date(announcement.postDate || new Date(), "MMM dd, yyyy") + `</p>
							                <p>To: ` + (groupList || "All") + `</p>
							            </div>
							        </div>
							    </div>
							</div>`;

		return announcementModal;

	}

}());