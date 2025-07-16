const sessionFlash = require('../util/session-flash');

// ______ indlæser "/admin-settings"-siden ______
function getAdminSettings(req, res) {
	let sessionDataDefaults;

	if (req.session.adminSettings) { // hvis der er gemt admin indstillinger i brugerens session
		const adminSettingsDb = req.session.adminSettings;
		// så indstil sessionDataDefaults´s properties til at være lig med værdierne fra admin indstillinger der er gemt (og hvis disse ikke findes så tildel en standard værdi)
		sessionDataDefaults = {
			soMeIconsColor: adminSettingsDb.soMeIconsColor
			? adminSettingsDb.soMeIconsColor
			: '#6c757d',
			soMeIconX_checkbox: adminSettingsDb.soMeIconX_checkbox
			? adminSettingsDb.soMeIconX_checkbox
			: '1',
			soMeIconInsta_checkbox: adminSettingsDb.soMeIconInsta_checkbox
			? adminSettingsDb.soMeIconInsta_checkbox
			: '1',
			soMeIconFacebook_checkbox: adminSettingsDb.soMeIconFacebook_checkbox
			? adminSettingsDb.soMeIconFacebook_checkbox
			: '1',
		};
	} else { // hvis der IKKE er gemt admin indstillinger i brugerens session
		// så tildel disse standard værdier
		sessionDataDefaults = {
			soMeIconsColor: '#6c757d',
			soMeIconX_checkbox: '1',
			soMeIconInsta_checkbox: '1',
			soMeIconFacebook_checkbox: '1',
		};
	}

	// tildel eventuelt flashed data til sessionData (hvis der er en fejl- eller succes-besked eller noget indtastet data)
	let sessionData = sessionFlash.getSessionData(req);
	
	// hvis der ikke er noget flashed data
	if (!sessionData) {
		// så sæt sessionData til at være lig med standard værdierne for indstillingerne
		sessionData = sessionDataDefaults;
	}

	// indlæs/genindlæs "/admin-settings"-siden
	res.render('admin/admin-settings', {
		pageIdClasses: 'admin__general admin__admin_settings',
		title: "MyPromptCloud - Admin",
		inputData: sessionData,
	});
}

// ______ håndterer submit af formularen på "/admin-settings"-siden ______
async function adminSettings(req, res) {
	// få fat i den indtastede data og læg den ind i enteredData´s properties
	// ------
	// værdien af `req.body.soMeIconsColor` er en string med en HEX farvekode (for eksempel: "#6c757d")
	// ------
	// værdien af en af disse checkboxes er "1" (string) eller "0" (string) ved checked og undefined hvis unchecked
	// Boolean() ændrer værdien til true (boolean) ved checked og false (boolean) hvis unchecked
	// `+`-tegnet ændrer værdien til 1 (number) ved checked og 0 (number) hvis unchecked
	// toString() ændrer værdien til "1" (string) ved checked og "0" (string) hvis unchecked
	const enteredData = {
		soMeIconsColor: req.body.soMeIconsColor,
		soMeIconX_checkbox: (+Boolean(req.body.soMeIconX_checkbox)).toString(),
		soMeIconInsta_checkbox: (+Boolean(req.body.soMeIconInsta_checkbox)).toString(),
		soMeIconFacebook_checkbox: (+Boolean(req.body.soMeIconFacebook_checkbox)).toString(),
	};

	let errorMessage = '';
	let amountOfErrors = 0;

	// valider input
	if (
		!req.body.soMeIconsColor ||
		!/^#[a-fA-F0-9]{6}$/.test(req.body.soMeIconsColor) || // Regex: HEX-farvekode (# efterfulgt af 6 hexadecimale tegn)
		!req.body.soMeIconsColor.trim().length === 7
	) {
		// hvis ikke godkendt så indsæt en besked i errorMessage
		errorMessage += 'Ingen farve valgt eller ugyldig værdi'
		// og øg amountOfErrors med 1
		amountOfErrors++;
	}

	// amountOfCheckedSoMeIcons: er lig med antallet af checked checkboxes
	const amountOfCheckedSoMeIcons = (
		(+Boolean(req.body.soMeIconX_checkbox)) +
		(+Boolean(req.body.soMeIconInsta_checkbox)) +
		(+Boolean(req.body.soMeIconFacebook_checkbox))
	);

	// hvis antallet af checked checkboxes er 0
	if (amountOfCheckedSoMeIcons === 0) {
		// tilføj til errorMessage: hvis mængden af fejl er over 0 (hvis dette ikke er den første fejl) så tilføj den første string, ellers tilføj den anden string
		errorMessage += amountOfErrors > 0 ? '. Derudover skal du også vælge' : 'Vælg';
		// tilføj det resterende af sætningen til errorMessage
		errorMessage += ' mindst 1 sociale medier ikon';
		// og øg amountOfErrors med 1
		amountOfErrors++;
	}

	// hvis mængden af fejl er over 0 (hvis de indtastede data ikke lever op til valideringen)
	if (amountOfErrors > 0) {
		// så flash input data (enteredData) til session sammen med en fejlbesked og en messageType
		sessionFlash.flashDataToSession(
			req,
			{
				message: errorMessage,
				messageType: 'danger',
				...enteredData
			},
			() => {
				// viderestil til "/admin-settings"-siden efter input data er flashed til session
				res.redirect('/admin/admin-settings');
			}
		);
		// afslut adminSettings-funktionen
		return;
	}

	// hvis mængden af fejl er lig 0 (hvis de indtastede data lever op til valideringen)
	// så gem indtastet værdier fra inputs i brugerens session (under "adminSettings"-property)
	req.session.adminSettings = enteredData;
	// efter session er gemt så flashDataToSession (med en besked, beskedtype og enteredData) og derefter viderestilles til "/admin-settings"-siden.
	// session modul gemmer automatisk men i tilfælde som dette hvor den side der viderestilles til afhænger af at session er blevet gemt så sikrer denne metode at der gemmes inden der viderestilles
	req.session.save(() => {
		sessionFlash.flashDataToSession(
			req,
			{
				message: 'Indstillinger gemt! Se ændringerne ved at vælge "Tilbage til forsiden" i dropdown-menuen ovenfor og derefter scroll ned i bunden af forsiden.',
				messageType: 'success',
				...enteredData
			},
			() => {
				// viderestil til "/admin-settings"-siden efter ovenstående er gemt og flashed til session
				res.redirect('/admin/admin-settings');
			}
		);
	});
}

module.exports = {
	getAdminSettings: getAdminSettings,
	adminSettings: adminSettings,
};