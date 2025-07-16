// ______ hvis admin-indstillinger findes i session så tildel dem til locals.adminSettings så de er tilgængelige i views ______
function checkAdminSettings(req, res, next) {
	// find adminSettings fra brugerens session
	// adminSettings blev tildelt til brugerens session ved lagring af indstillingerne fra input (se "adminSettings"-funktionen i admin.controller.js)
	const adminSettings = req.session.adminSettings;

	// hvis adminSettings ikke findes i brugerens session så er det enten fordi vedkommende ikke er en admin bruger eller det er fordi der ikke er nogen indstillinger tilføjet endnu (eller de er blevet slettet/nulstillet)
	if (!adminSettings) {
		// og derfor afslut checkAdminSettings-funktion og gå videre til næste middleware
		return next();
	}

	// Tildel adminSettings til locals´s "adminSettings"-property så den er tilgængelig i alle views
	res.locals.adminSettings = adminSettings;

	// Gå videre til næste middleware
	next();
};

module.exports = checkAdminSettings;