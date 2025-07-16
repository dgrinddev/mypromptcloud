const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/tilmeld', authController.getTilmeld);
router.post('/tilmeld', authController.tilmeld);
router.get('/login', authController.getLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;