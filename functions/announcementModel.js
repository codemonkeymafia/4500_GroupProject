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
 *  Javascript model for Announcement Class
 */

function Announcement(id, faculty, title, message, priority, groups){


		this.id = id || "";
		this.postDate = new Date();
		this.expiryDate = new Date(this.postDate.getTime() + 7 * 24 * 60 * 60 * 1000);
		this.title = title || "Untitled";
		this.message = message;
		this.sender = {
			firstName: faculty.firstName || "",
			lastName: faculty.lastName || ""
		}
		this.priority = priority;
		this.groups = groups || [];


		function setSender(faculty){
			this.sender.firstName = faculty.firstName;
			this.sender.lastName = faculty.lastName;
		}
	}
