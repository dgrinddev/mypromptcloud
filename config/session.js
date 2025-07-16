const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');
require('dotenv').config();


function createSessionStore() {
	const MongoDBStore = mongoDbStore(expressSession);

	const store = new MongoDBStore({
		uri: process.env['MONGODBCONNECTIONSTRING'],
		databaseName: process.env['DATABASENAME'],
		collection: 'sessions'
	});

	return store;
}

function createSessionConfig() {
	return {
		secret: process.env['EXPRESSSESSIONSECRET'],
		resave: false,
		saveUninitialized: false,
		store: createSessionStore(),
		cookie: {
			maxAge: 2 * 24 * 60 * 60 * 1000 // 2 dage
		}
	};
}

module.exports = createSessionConfig;