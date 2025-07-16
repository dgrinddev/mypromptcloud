const express = require('express');
const userGeneralController = require('../../controllers/user/user-general.controller');
const router = express.Router();

router.get('/oversigt', userGeneralController.userGeneral_get_oversigt);
router.get('/history', userGeneralController.userGeneral_get_history);
router.get('/share', userGeneralController.userGeneral_get_share);
router.get('/export-import', userGeneralController.userGeneral_get_exportImport);

module.exports = router;