const express = require('express');
const organizationSectionController = require('../../controllers/user/organization-section.controller');
const router = express.Router();

router.post('/add-or-edit-item', organizationSectionController.addOrEditOrganizationSectionItem);
router.delete('/delete-item/:organization_section_type/:id', organizationSectionController.deleteOrganizationSectionItem);

module.exports = router;