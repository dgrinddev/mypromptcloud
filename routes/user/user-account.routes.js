const express = require('express');
const userAccountController = require('../../controllers/user/user-account.controller');
const router = express.Router();

router.get('/settings', userAccountController.userAccount_get_settings);
router.get('/subscription', userAccountController.userAccount_get_subscription);

module.exports = router;