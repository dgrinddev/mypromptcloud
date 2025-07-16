const OrganizationSectionItem = require('../../models/user/organization-section.model');

async function getAllOrganizationSectionItems(req, res, next) {
	try {
		let organizationSectionsItems = {
			folders: await OrganizationSectionItem.findAll(res.locals.uid, 'folders'),
			categories: await OrganizationSectionItem.findAll(res.locals.uid, 'categories'),
		};
		req.organizationSectionsItems = organizationSectionsItems;
		next();
	} catch (error) {
		return next(error);
	}
};

module.exports = getAllOrganizationSectionItems;