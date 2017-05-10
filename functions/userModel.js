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
 *  Javacript User class
 */	

function User(id, firstName, lastName, email, groups, isFaculty, isAdmin, phone, office){
		this.id = id || null;
		this.firstName = firstName || null;
		this.lastName = lastName || null;
		this.email = email || null;
		this.isFaculty = isFaculty || false;
		this.isAdmin = isAdmin || false;
		this.groups = groups || [];
		this.phone = phone || null;
		this.office = office || null;
	}
