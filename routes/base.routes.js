const express = require('express');
const router = express.Router();

router.get('/401', function(req, res) {
	const errorStatuscode = 401;
	res.status(errorStatuscode).render('shared/error-page-visitor', {
		errorStatuscode: errorStatuscode,
		errorPageType: 'visitor',
		pageIdClasses: 'visitor__error',
		title: `MyPromptCloud - ${errorStatuscode}`,
	});
});

router.get('/403', function(req, res) {
	const errorStatuscode = 403;
	res.status(errorStatuscode).render('shared/error-page-visitor', {
		errorStatuscode: errorStatuscode,
		errorPageType: 'visitor',
		pageIdClasses: 'visitor__error',
		title: `MyPromptCloud - ${errorStatuscode}`,
	});
});

module.exports = router;