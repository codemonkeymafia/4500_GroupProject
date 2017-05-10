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
 *  Javascript model for Group class 
 */

function Group(id, name, users){
	
	this.id = id || "";
	this.name = name || "";
	this.users = users || [];
}
