// ______ deklarer funktion til at få flashed data. kan bruges når en side med en formular indlæses ______
function getSessionData(req) {
	// få eventuelt gemt input data (hvis noget er blevet gemt af flashDataToSession-funktionen)
	const sessionData = req.session.flashedData;
	// nulstil session´s "flashedData"-property
	req.session.flashedData = null;
	// returner den eventuelt gemte input data (input data gemmes ikke og vil forsvinde ved næste reload eller viderestilling men er tilgængelig lige nu)
	return sessionData;
};

// ______ deklarer funktion til at flashe data til session. kan bruges når en formular submittes ______
function flashDataToSession(req, data, action) {
	// gem input data (fra formularen) i brugerens session (under "flashedData"-property)
	req.session.flashedData = data;
	// efter session er gemt så udfør den function der er i action
	req.session.save(action);
};

module.exports = {
	getSessionData: getSessionData,
	flashDataToSession: flashDataToSession
};