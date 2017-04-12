
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