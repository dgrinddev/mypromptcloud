const express = require('express');
const router = express.Router();

const organizationSectionRoutes = require('./user/organization-section.routes');
const promptRoutes = require('./user/prompt.routes');
const promptsGetRoutes = require('./user/prompts-get.routes');
const userGeneralRoutes = require('./user/user-general.routes');
const userAccountRoutes = require('./user/user-account.routes');

const getOrganizationSectionItemsMiddleware = require('../middlewares/user/get-organization-section-items');
// router.use(getOrganizationSectionItemsMiddleware);

router.use('/organization-section', organizationSectionRoutes);
router.use('/prompt', getOrganizationSectionItemsMiddleware, promptRoutes);
router.use('/prompts-get', getOrganizationSectionItemsMiddleware, promptsGetRoutes);
router.use('/', getOrganizationSectionItemsMiddleware, userGeneralRoutes);
router.use('/account', getOrganizationSectionItemsMiddleware, userAccountRoutes);

module.exports = router;