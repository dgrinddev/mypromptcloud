// http://localhost:3000/user/oversigt
function userGeneral_get_oversigt(req, res) {
	res.render('user/general-pages/oversigt', {
		pageIdClasses: 'user__general user__oversigt',
		title: 'MyPromptCloud - Oversigt',
		header: 'Oversigt',
		// navProfileImgSrc: 'profile-icon.png',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


// http://localhost:3000/user/history
function userGeneral_get_history(req, res) {
	res.render('user/general-pages/history', {
		pageIdClasses: 'user__general user__history',
		title: 'MyPromptCloud - Historik & Versionering',
		header: 'Historik & Versionering',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


// http://localhost:3000/user/share
function userGeneral_get_share(req, res) {
	res.render('user/general-pages/share', {
		pageIdClasses: 'user__general user__share',
		title: 'MyPromptCloud - Deling & Samarbejde',
		header: 'Deling & Samarbejde',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


// http://localhost:3000/user/export-import
function userGeneral_get_exportImport(req, res) {
	res.render('user/general-pages/export-import', {
		pageIdClasses: 'user__general user__exportImport',
		title: 'MyPromptCloud - Eksport / Import',
		header: 'Eksport / Import',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


module.exports = {
	userGeneral_get_oversigt: userGeneral_get_oversigt,
	userGeneral_get_history: userGeneral_get_history,
	userGeneral_get_share: userGeneral_get_share,
	userGeneral_get_exportImport: userGeneral_get_exportImport,
};