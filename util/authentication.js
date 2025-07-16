// ______ deklarer funktion til at få fat i brugerens id og admin-status fra database og tildel til brugerens session ______
function createUserSession(req, user, action) {
	// gem user´s _id (user object fra database) i brugerens session (under "uid"-property)
	req.session.uid = user._id.toString();
	// gem user´s admin-status (user object fra database) i brugerens session (under "isAdmin"-property)
	req.session.isAdmin = user.isAdmin;
	// efter session er gemt så udfør den function der er i action
	// session modul gemmer automatisk men i tilfælde som dette hvor den side der viderestilles til afhænger af at session er blevet gemt så sikrer denne metode at der gemmes inden der viderestilles
	req.session.save(action);
};

// ______ deklarer funktion til at køre når brugeren logger ud ______
function destroyUserAuthSession(req, action) {
	// fjern user´s _id (user object fra database) fra "uid"-property i brugerens session så de anses som værende logget ud fremover
	req.session.uid = null;
	req.session.save(action);
};

module.exports = {
	createUserSession: createUserSession,
	destroyUserAuthSession: destroyUserAuthSession,
}