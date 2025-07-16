const bcrypt = require('bcryptjs');
const db = require('../../data/database');

// ______ User model ______
class User {
	// Konstruer User object med email og password parametre
	constructor(email, password) {
		this.email = email;
		this.password = password;
	};

	// definer funktion til at finde bruger med email i database
	getUserWithSameEmail() {
		return db.getDb().collection('users').findOne({email: this.email});
	}

	// definer funktion til at tjekke om email allerede findes iblandt brugerne i database
	async existsAlready() {
		const existingUser = await this.getUserWithSameEmail();
		if (existingUser) {
			return true;
		}
		return false;
	}

	// definer funktion til at gemme brugeren i databasen ved tilmelding
	async tilmeld() {
		// krypter den indtastede adgangskode
		const hashedPassword = await bcrypt.hash(this.password, 12);

		// indsæt brugerinfo i databasen
		await db.getDb().collection('users').insertOne({
			email: this.email,
			password: hashedPassword
		});
	}

	// definer funktion til at tjekke om har korrekt password
	hasMatchingPassword(hashedPassword) {
		// sammenlign den rå adgangskode fra user object med en hashed adgangskode leveret som paramter
		return bcrypt.compare(this.password, hashedPassword);
	}
};

module.exports = User;