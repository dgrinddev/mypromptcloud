const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.get('/admin-settings', adminController.getAdminSettings);
router.post('/admin-settings', adminController.adminSettings);

module.exports = router;