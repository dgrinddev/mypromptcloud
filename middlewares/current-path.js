// ______ gem nuværende sti i locals.currentPath (eks: Pris-siden = "/pris", Forsiden = "/forside", Prompt-oversigt-siden = "/user/oversigt") ______
function currentPath(req, res, next) {
	// Nuværende path gemmes i locals.currentPath
	res.locals.currentPath = req.path;

	// ___ deklarerer variabler: locals.isVisitorPage ___
	// Tjekker om der IKKE er flere "/" i URL'en efter den første (eks. '/forside' returnerer true)
	res.locals.isVisitorPage = !req.path.includes('/', 1);

	// ___ deklarerer ydeligere variabler: locals.isUserPage, locals.isAuthPage, locals.isAdminPage ___
	// Hvis url starter med en af de strings i array så er variablen true ellers false
	res.locals.isUserPage = ['/user/'].some(prefix => req.path.startsWith(prefix));
	res.locals.isAuthPage = ['/auth/'].some(prefix => req.path.startsWith(prefix));
	res.locals.isAdminPage = ['/admin/'].some(prefix => req.path.startsWith(prefix));

	next();
};

module.exports = currentPath;