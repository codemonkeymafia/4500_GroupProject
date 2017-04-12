
	function User(id, firstName, lastName, email, groups, isFaculty, isAdmin, phone, office){
		this.id = id || "";
		this.firstName = firstName || "";
		this.lastName = lastName || "";
		this.email = email || "";
		this.isFaculty = isFaculty || false;
		this.isAdmin = isAdmin || false;
		this.groups = groups || [];
		this.phone = phone || "";
		this.office = office || "";
	}