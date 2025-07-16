// Require path (bruges til at lave en sti flere steder i koden)
const path = require('path');
// Require express (back end web application framework)
const express = require('express');
// Require vm (ved ikk hvad er. måske noget den selv har tilføjet)
const { Script } = require('vm');
// Require csrf-sync (bruges til CSRF protection)
const { csrfSync } = require("csrf-sync");
// Require express session modul
const expressSession = require('express-session');
// Require session config
const createSessionConfig = require('./config/session');
// Require database
const db = require('./data/database');

// Require middlewares
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const currentPathMiddleware = require('./middlewares/current-path');
const adminSettingsMiddleware = require('./middlewares/admin-settings');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const notFoundMiddleware = require('./middlewares/not-found');

// Require mine routes
const baseRoutes = require('./routes/base.routes');
const visitorRoutes = require('./routes/visitor.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const testRoutes = require('./routes/test.routes');

// express: back end web application framework
const app = express();
// indstil ejs som template engine
app.set('view engine', 'ejs');
// indstil hvor views/ejs-templates findes
app.set('views', path.join(__dirname, 'views'));
// indstil hvor static filer findes
app.use(express.static('public'));
// Bruges til at sende body fra formularer til serveren
app.use(express.urlencoded({ extended: false }));
// Bruges til at sende json i ajax requests til serveren
app.use(express.json());
// Brug sessions til at opbevare information om brugeren (som f.eks. om vedkommende er logget ind)
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Brug CSRF protection
const csrfOptions = {
	getTokenFromRequest: (req) => {
		// Hvis den indkommende request er multipart content type, så få token fra header
		if (req.is('multipart') || req.method === 'DELETE') {
			return req.headers['x-csrf-token'];
		}
		// Ellers brug body for alle andre request typer
		return req.body['_csrf'];
	},
};
const {
	invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
	generateToken, // Use this in your routes to generate, store, and get a CSRF token.
	getTokenFromRequest, // use this to retrieve the token submitted by a user
	getTokenFromState, // The default method for retrieving a token from state.
	storeTokenInState, // The default method for storing a token in state.
	revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
	csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync(csrfOptions);
app.use(csrfSynchronisedProtection);

// Brug mine middlewares
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);
app.use(currentPathMiddleware);
app.use(adminSettingsMiddleware);

// Mine routes
app.use(baseRoutes);
app.use(visitorRoutes);
app.use('/auth', protectRoutesMiddleware, authRoutes);
app.use('/user', protectRoutesMiddleware, userRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);
app.use(testRoutes);

// Håndtering når siden ikke kan findes
app.use(notFoundMiddleware);
// Brug fejlhåndterings middleware (ved fejl på serveren)
app.use(errorHandlerMiddleware);

// Forbind til database
db.connectToDatabase()
	.then(function () {
		// hvis forbinde til database lykkedes:
		// lyt efter indkommende requests på port xxxx
		const port = process.env['PORT'];
		app.listen(port, () => {
			console.log(`App lytter efter indkommende requests på port ${port}: http://localhost:${port}/forside`);
		});
	})
	.catch(function (error) {
		// hvis forbinde til database fejler:
		console.log('Kunne ikke oprette forbindelse til databasen!');
		console.log(error);
	});