const express = require('express');
const router = express.Router();

router.get('/test_centreret_indhold_med_header_og_footer', function(req, res){
	res.render('test_views/test_centreret_indhold_med_header_og_footer', {
		title: "MyPromptCloud - Test",
		// bemærk: centered-content-form-pages.js virker ikke i dette slags layout. den kan dog komme til det med noget tilpasning af koden deri hvis ønsket
		// extraScripts: ['/scripts/shared/centered-content-form-pages.js'],
	});
});

module.exports = router;