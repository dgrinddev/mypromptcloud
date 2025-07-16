function notFoundHandler(req, res) {
	let requestedPath = '';
	if (req.path) {
		requestedPath = req.path;
	}

	const errorStatuscode = 404;

	// Brug en switch-sætning til at bestemme hvilken error-side der skal serves
	switch (true) {

		// Tjekker om der IKKE er flere "/" i URL'en efter den første (eks. '/forside' returnerer true)
		case !requestedPath.includes('/', 1): // visitor-sider
			res.status(errorStatuscode).render('shared/error-page-visitor', {
				errorStatuscode: errorStatuscode,
				errorPageType: 'visitor',
				pageIdClasses: 'visitor__error',
				title: `MyPromptCloud - ${errorStatuscode}`,
			});
			break;

		// Hvis url starter med en af de strings i array så returneres true ellers false
		case ['/user'].some(prefix => requestedPath.startsWith(prefix)):
			res.status(errorStatuscode).render('shared/error-page-user', {
				errorStatuscode: errorStatuscode,
				errorPageType: 'user',
				pageIdClasses: 'user__error',
				title: `MyPromptCloud - ${errorStatuscode}`,
				organizationSectionsItems: req.organizationSectionsItems ?? {folders: [], categories: []},
			});
			break;

		// Hvis url starter med en af de strings i array så returneres true ellers false
		case ['/auth'].some(prefix => requestedPath.startsWith(prefix)):
			res.status(errorStatuscode).render('shared/error-page-auth', {
				errorStatuscode: errorStatuscode,
				errorPageType: 'auth',
				pageIdClasses: 'auth__error',
				title: `MyPromptCloud - ${errorStatuscode}`,
			});
			break;

		// Hvis url starter med en af de strings i array så returneres true ellers false
		case ['/admin'].some(prefix => requestedPath.startsWith(prefix)):
			res.status(errorStatuscode).render('shared/error-page-admin', {
				errorStatuscode: errorStatuscode,
				errorPageType: 'admin',
				pageIdClasses: 'admin__error',
				title: `MyPromptCloud - ${errorStatuscode}`,
			});
			break;

		// i alle andre tilfælde
		default:
			res.status(errorStatuscode).render('shared/error-page-default', {
				errorStatuscode: errorStatuscode,
				errorPageType: 'default',
				pageIdClasses: 'default__error',
				title: `MyPromptCloud - ${errorStatuscode}`,
			});
			break;

	}
}

module.exports = notFoundHandler;