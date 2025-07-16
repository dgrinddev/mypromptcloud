function protectRoutes(req, res, next) {
	const protectionOn = true;
	if (protectionOn) {
		let requestedPath = '';
		if (req.originalUrl) {
			requestedPath = req.originalUrl;
		}
	
		if (requestedPath.startsWith('/user') && !res.locals.isAuth) {
			return res.redirect('/401');
		}
	
		if (requestedPath.startsWith('/admin') && !res.locals.isAdmin) {
			return res.redirect('/403');
		}
		
		if (requestedPath.startsWith('/auth') && !requestedPath.startsWith('/auth/logout')) {
			if (res.locals.isAdmin) {
				return res.redirect('/admin/admin-settings');
			}
			if (res.locals.isAuth) {
				return res.redirect('/user/prompts-get/all');
			}
		}
	}

	next();
}

module.exports = protectRoutes;