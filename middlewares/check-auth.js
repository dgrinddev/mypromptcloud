// ______ hvis uid findes i session så tildel til locals.uid så den er tilgængelige i views ______
function checkAuthStatus(req, res, next) {
	// find uid fra brugerens session
	// uid blev tildelt til brugerens session ved login (se "login"-funktionen i auth.controller.js)
	const uid = req.session.uid;

	// hvis uid ikke findes i brugerens session så er vedkommende ikke logget ind
	if (!uid) {
		// og derfor afslut checkAuthStatus-funktion og gå videre til næste middleware
		return next();
	}

	// hvis uid findes i brugerens session så er vedkommende logget ind
	// Tildel uid til locals´s "uid"-property så den er tilgængelig i alle views
	res.locals.uid = uid;
	// Tildel true til locals´s "isAuth"-property så den er tilgængelig i alle views
	res.locals.isAuth = true;
	// Tildel værdien fra req.session.isAdmin til locals´s "isAdmin"-property så den er tilgængelig i alle views (se funktionen "createUserSession" for at se der hvor req.session.isAdmin tildeles sin værdi som kan være true eller false)
	res.locals.isAdmin = req.session.isAdmin;
	// Gå videre til næste middleware
	next();
};

module.exports = checkAuthStatus;