// ______ for alle indkommende requests: tildel en token til locals´s "csrfToken"-property ______
function addCsrfToken(req, res, next) {
	// locals vil være tilgængelig i alle views og andre filer
	// csrfToken() er en method fra "csrf-sync"-modulet
	res.locals.csrfToken = req.csrfToken();
	// gå videre til næste middleware
	next();
};

module.exports = addCsrfToken;