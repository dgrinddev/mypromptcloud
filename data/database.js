const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();


let database;

async function connectToDatabase() {
	const client = await MongoClient.connect(process.env['MONGODBCONNECTIONSTRING']);
	database = client.db(process.env['DATABASENAME']);
}

function getDb() {
	if (!database) {
		throw new Error('You must connect first!');
	}
	return database;
}

module.exports = {
	connectToDatabase: connectToDatabase,
	getDb: getDb
};