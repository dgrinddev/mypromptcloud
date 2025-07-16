const User = require('../models/auth/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

// ______ indlæser "/tilmeld"-siden ______
function getTilmeld(req, res) {
	let sessionData = sessionFlash.getSessionData(req);

	// hvis der ikke er noget flashed data så sæt alle værdierne til en tom string så de ikke er undefined
	if (!sessionData) {
		sessionData = {
			email: '',
			password: '',
			confirmPassword: '',
			betingelserCheckbox: false,
		};
	}

	// indlæs/genindlæs "/tilmeld"-siden
	// http://localhost:3000/auth/tilmeld
	res.render('auth/tilmeld', {
		pageIdClasses: 'auth__general auth__tilmeld',
		title: "MyPromptCloud - Tilmeld",
		inputData: sessionData,
	});
}

// ______ håndterer submit af formularen på "/tilmeld"-siden ______
async function tilmeld(req, res, next) {
	// få fat i den indtastede data og læg den ind i enteredData´s properties
	// ------
	// de 3 første input er strings
	// ------
	// værdien af checkbox er "1" (string) eller "0" (string) ved checked og undefined hvis unchecked
	// Boolean() ændrer værdien til true (boolean) ved checked og false (boolean) hvis unchecked
	const enteredData = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body['confirm-password'],
		betingelserCheckbox: Boolean(req.body['betingelser-checkbox']),
	};

	// valider indtastede data i formularen (se i '../util/validation' hvordan dataene valideres)
	if (
		!validation.userDetailsAreValid(
			req.body.email,
			req.body.password,
			Boolean(req.body['betingelser-checkbox'])
		) ||
		!validation.passwordIsConfirmed(req.body.password, req.body['confirm-password'])
	) {
		// hvis de indtastede data ikke lever op til valideringen:
		// så flash input data (enteredData) til session sammen med en fejlbesked og en messageType
		sessionFlash.flashDataToSession(
			req,
			{
				message: 'Tjek venligst dit input. Du skal indtaste gyldig email og kode samt acceptere betingelser',
				messageType: 'danger',
				...enteredData
			},
			() => {
				// viderestil til "/tilmeld"-siden efter ovenstående er flashed til session
				res.redirect('/auth/tilmeld');
			}
		);
		// afslut tilmeld-funktionen
		return;
	}

	// lav ny User object ud fra indtastet email og password
	const user = new User(
		req.body.email,
		req.body.password
	);

	try {
		// tjek om bruger med indtastet email allerede eksisterer i database
		const existsAlready = await user.existsAlready();
		if (existsAlready) {
			// hvis bruger med indtastet email allerede eksisterer i database:
			// så flash input data (enteredData) til session sammen med en fejlbesked og en messageType
			sessionFlash.flashDataToSession(
				req,
				{
					message: 'Bruger findes allerede',
					messageType: 'danger',
					...enteredData
				},
				() => {
					// viderestil til "/tilmeld"-siden efter ovenstående er flashed til session
					res.redirect('/auth/tilmeld');
				}
			);
			// afslut tilmeld-funktionen
			return;
		}

		// gem brugeren i database
		await user.tilmeld();
	} catch (error) { // hvis alt ovenstående i try-block fejler så send fejlen videre så den bliver håndteret af anden fejlhåndterings-middleware senere
		return next(error);
	}

	// hvis alt ovenstående er lykkedes uden problemmer:
	// så flash en succes besked til session
	sessionFlash.flashDataToSession(
		req,
		{
			message: 'Tillykke! Din bruger er oprettet succesfuldt. Indtast e-mailadresse og adgangskode herunder for at logge ind.',
			messageType: 'success',
		},
		() => {
			// viderestil til "/login"-siden efter ovenstående er flashed til session
			res.redirect('/auth/login');
		}
	);
}

// indlæser "/login"-siden
function getLogin(req, res) {
	// tildel eventuelt flashed data til sessionData (hvis der er en fejl- eller succes-besked eller noget indtastet data)
	let sessionData = sessionFlash.getSessionData(req);

	// hvis der ikke er noget flashed data så sæt alle værdierne til en tom string så de ikke er undefined
	if (!sessionData) {
		sessionData = {
			email: '',
			password: '',
		};
	}

	// indlæs/genindlæs "/login"-siden
	// http://localhost:3000/auth/login
	res.render('auth/login', {
		pageIdClasses: 'auth__general auth__login',
		title: "MyPromptCloud - Login",
		inputData: sessionData,
	});
}

// håndterer submit af formularen på "/login"-siden
async function login(req, res, next) {
	// lav nyt user object som indeholder den indtastede email og adgangskode
	const user = new User(req.body.email, req.body.password);

	let existingUser;
	try {
		// find eksisterende bruger i databasen med den indtastede email
		existingUser = await user.getUserWithSameEmail();
	} catch (error) { // hvis ovenstående i try-block fejler så send fejlen videre så den bliver håndteret af anden fejlhåndterings-middleware senere
		return next(error);
	}

	// gør en fejlmeddelelse klar som kan bruges i flere tilfælde
	const sessionErrorData = {
		message: 'Tjek venligst den indtastede email og kode',
		messageType: 'danger',
		email: user.email,
		password: user.password,
	};

	if (!existingUser) { // hvis bruger med indtastet email ikke eksisterer i database:
		// så flash input data til session sammen med en fejlbesked og en messageType (sessionErrorData)
		sessionFlash.flashDataToSession(req, sessionErrorData, () => {
			// viderestil til "/login"-siden efter sessionErrorData er flashed til session
			res.redirect('/auth/login');
		});
		// afslut login-funktionen
		return;
	}
	
	// sammenlign den rå adgangskode fra user object (den indtastede adgangskode) med den hashed adgangskode fra existingUser
	const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
	
	if (!passwordIsCorrect) { // hvis adgangskode ikke matcher:
		// så flash input data til session sammen med en fejlbesked og en messageType (sessionErrorData)
		sessionFlash.flashDataToSession(req, sessionErrorData, () => {
			// viderestil til "/login"-siden efter sessionErrorData er flashed til session
			res.redirect('/auth/login');
		});
		// afslut login-funktionen
		return;
	}

	// hvis alt ovenstående er lykkedes uden problemmer:
	// Vælg callbackFunction baseret på om bruger er admin eller ej
	let callbackFunction;
	if (existingUser.isAdmin) { // hvis admin:
		// callbackFunction viderestiller til "/admin-settings"-siden
		callbackFunction = () => {
			res.redirect('/admin/admin-settings');
		};
	} else { // hvis almindelig bruger:
		// callbackFunction viderestiller til "/prompts-get/all"-siden
		callbackFunction = () => {
			res.redirect('/user/prompts-get/all');
		};
	}

	// gem existingUser´s _id (_id fra databasen) i brugerens session (under "uid"-property) og gem også værdien af isAdmin (som er true hvis brugeren er en admin bruger)
	// og derefter viderestil til enten "/admin-settings"-siden eller "/oversigt"-siden ( afhængig af hvad callbackFunction er sat til)
	authUtil.createUserSession(req, existingUser, callbackFunction);
}

// håndterer post requests til "/auth/logout"
function logout(req, res) {
	// slet uid i brugerens session så de ikke anses som logget ind fremover
	authUtil.destroyUserAuthSession(req, () => {
		// og derefter viderestil til "/forside"
		res.redirect('/forside');
	});
};

module.exports = {
	getTilmeld: getTilmeld,
	tilmeld: tilmeld,
	getLogin: getLogin,
	login: login,
	logout: logout,
};