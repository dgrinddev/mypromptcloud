const express = require('express');
const promptsGetController = require('../../controllers/user/prompts-get.controller');
const router = express.Router();

router.get('/all', promptsGetController.promptsGet_all);
router.get('/unsorted', promptsGetController.promptsGet_unsorted);
router.get('/folders/:id', promptsGetController.promptsGet_folders);
router.get('/categories/:id', promptsGetController.promptsGet_categories);

module.exports = router;