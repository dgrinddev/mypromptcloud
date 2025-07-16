const express = require('express');
const promptController = require('../../controllers/user/prompt.controller');
const router = express.Router();

router.get('/add-or-edit', promptController.prompt_getAddOrEdit); // GET: tilføj ny prompt
router.get('/add-or-edit/:id', promptController.prompt_getAddOrEdit); // GET: rediger eksisterende prompt 
router.post('/add-or-edit', promptController.prompt_addOrEdit); // POST: tilføj ny prompt
router.post('/add-or-edit/:id', promptController.prompt_addOrEdit); // POST: rediger eksisterende prompt med id
router.delete('/delete/:id', promptController.prompt_delete);
router.post('/improve', promptController.prompt_improve);

module.exports = router;