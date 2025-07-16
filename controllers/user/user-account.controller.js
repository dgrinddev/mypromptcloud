// http://localhost:3000/user/account/settings
function userAccount_get_settings(req, res) {
	res.render('user/account/settings', {
		pageIdClasses: 'user__account user__account__settings',
		title: 'MyPromptCloud - Brugerindstillinger',
		header: 'Brugerindstillinger',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


// http://localhost:3000/user/account/subscription
function userAccount_get_subscription(req, res) {
	res.render('user/account/subscription', {
		pageIdClasses: 'user__account user__account__subscription',
		title: 'MyPromptCloud - Abonnement',
		header: 'Abonnement',
		organizationSectionsItems: req.organizationSectionsItems,
	});
};


module.exports = {
	userAccount_get_settings: userAccount_get_settings,
	userAccount_get_subscription: userAccount_get_subscription,
};