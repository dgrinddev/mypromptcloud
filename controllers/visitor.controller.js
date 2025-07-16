// Omdiriger roden ("/") til "/forside"
function redirectRootToForside(req, res) {
	res.redirect('/forside');
};


// http://localhost:3000/forside
function getForside(req, res) {
	res.render('visitor/forside', {
		pageIdClasses: 'visitor__general visitor__forside',
		title: "Velkommen til MyPromptCloud",
		// navProfileImgSrc: 'profile-icon.png',
	});
};


function getPrisSide(req, res) {
	res.render('visitor/pris', {
		pageIdClasses: 'visitor__general visitor__pris',
	});
};


function getFunktionerSide(req, res) {
	res.render('visitor/funktioner', {
		pageIdClasses: 'visitor__general visitor__funktioner',
	});
};


function getBrugsbetingelserSide(req, res) {
	res.render('visitor/brugsbetingelser', {
		pageIdClasses: 'visitor__general visitor__brugsbetingelser',
		title: "Brugsbetingelser for MyPromptCloud",
		h1: "Brugsbetingelser for MyPromptCloud",
	});
};


function getPrivatlivspolitikSide(req, res) {
	res.render('visitor/privatlivspolitik', {
		pageIdClasses: 'visitor__general visitor__privatlivspolitik',
		title: "Privatlivspolitik for MyPromptCloud",
		h1: "Privatlivspolitik for MyPromptCloud",
	});
};


function getOmSide(req, res) {
	res.render('visitor/om', {
		pageIdClasses: 'visitor__general visitor__om',
		title: "MyPromptCloud - Om MyPromptCloud",
		h1: "Om MyPromptCloud",
	});
};


module.exports = {
	redirectRootToForside: redirectRootToForside,
	getForside: getForside,
	getPrisSide: getPrisSide,
	getFunktionerSide: getFunktionerSide,
	getBrugsbetingelserSide: getBrugsbetingelserSide,
	getPrivatlivspolitikSide: getPrivatlivspolitikSide,
	getOmSide: getOmSide,
};