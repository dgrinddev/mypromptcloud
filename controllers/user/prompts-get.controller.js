const Prompt = require('../../models/user/prompt.model');
const OrganizationSectionItem = require('../../models/user/organization-section.model');


// http://localhost:3000/user/prompts-get/all
async function promptsGet_all(req, res, next) {
	try {
		// finder alle prompts med uid (og ingen ydeligere kritterier). det sidste paramter 'ALL' gør så organization section items returneres som hele deres document og ikke bare dens id
		const prompts = await Prompt.findByCriteria(res.locals.uid, {}, 'ALL');
		
		res.render('user/prompts/prompts-get', {
			pageIdClasses: 'user__prompts_get user__prompts_get__all',
			title: "MyPromptCloud - Alle prompts",
			contentHeaderHeading: "Alle prompts",
			organizationSectionsItems: req.organizationSectionsItems,
			promptItems: prompts,
		});
	} catch (error) {
		next(error);
		return;
	}
};


// http://localhost:3000/user/prompts-get/unsorted
async function promptsGet_unsorted(req, res, next) {
	try {
		// finder alle prompts med uid som ingen 'organization_folders' har (usorterede)
		const prompts = await Prompt.findByCriteria(res.locals.uid, {organization_folders: ""}, 'ALL');
		
		res.render('user/prompts/prompts-get', {
			pageIdClasses: 'user__prompts_get user__prompts_get__unsorted',
			title: "MyPromptCloud - Usorterede prompts",
			contentHeaderHeading: "Usorterede prompts",
			organizationSectionsItems: req.organizationSectionsItems,
			promptItems: prompts,
		});
	} catch (error) {
		next(error);
		return;
	}
};


// http://localhost:3000/user/prompts-get/folders/:id
async function promptsGet_folders(req, res, next) {
	try {
		// finder alle prompts med uid som har en bestemt 'organization_folders'
		const prompts = await Prompt.findByCriteria(res.locals.uid, {organization_folders: req.params.id}, 'ALL');

		let organizationSectionItemLabel;
		if (prompts !== undefined && prompts.length > 0) {
			organizationSectionItemLabel = prompts[0].organization_folders.name;
		} else {
			try {
				organizationSectionItem = await OrganizationSectionItem.findById(
					req.params.id,
					'folders'
				);
				organizationSectionItemLabel = organizationSectionItem.name;
			} catch (error) {
				console.log('der opstod en fejl da jeg prøvede at få organization_folders.name med OrganizationSectionItem.findById() (nok fordi den mappe ikke eksisterer)');
				console.log(error);
				next(error);
				return;
			}
		}

		res.render('user/prompts/prompts-get', {
			pageIdClasses: 'user__prompts_get user__prompts_get__folders user__prompts_get__folders__ID',
			title: `MyPromptCloud - Prompts i mappen "${organizationSectionItemLabel}"`,
			contentHeaderHeading_before: `Prompts i mappen "<span id="contentHeaderHeading_organizationType">`,
			contentHeaderHeading: `${organizationSectionItemLabel}`,
			contentHeaderHeading_after: `</span>"`,
			organizationSectionsItems: req.organizationSectionsItems,
			organizationSectionType_labelSingular_da: 'mappe',
			promptItems: prompts,
		});
	} catch (error) {
		next(error);
		return;
	}
};


// http://localhost:3000/user/prompts-get/categories/:id
async function promptsGet_categories(req, res, next) {
	try {
		// finder alle prompts med uid som har en bestemt 'organization_categories'
		const prompts = await Prompt.findByCriteria(res.locals.uid, {organization_categories: req.params.id}, 'ALL');

		let organizationSectionItemLabel;
		if (prompts !== undefined && prompts.length > 0) {
			organizationSectionItemLabel = prompts[0].organization_categories.name;
		} else {
			try {
				organizationSectionItem = await OrganizationSectionItem.findById(
					req.params.id,
					'categories'
				);
				organizationSectionItemLabel = organizationSectionItem.name;
			} catch (error) {
				console.log('der opstod en fejl da jeg prøvede at få organization_categories.name med OrganizationSectionItem.findById() (nok fordi den kategori ikke eksisterer)');
				console.log(error);
				organizationSectionItemLabel = 'kategorien eksisterer ikke!';
			}
		}

		res.render('user/prompts/prompts-get', {
			pageIdClasses: 'user__prompts_get user__prompts_get__categories user__prompts_get__categories__ID',
			title: `MyPromptCloud - Prompts med kategorien "${organizationSectionItemLabel}"`,
			contentHeaderHeading_before: `Prompts med kategorien "<span id="contentHeaderHeading_organizationType">`,
			contentHeaderHeading: `${organizationSectionItemLabel}`,
			contentHeaderHeading_after: `</span>"`,
			organizationSectionsItems: req.organizationSectionsItems,
			organizationSectionType_labelSingular_da: 'kategori',
			promptItems: prompts,
		});
	} catch (error) {
		next(error);
		return;
	}
};


module.exports = {
	promptsGet_all: promptsGet_all,
	promptsGet_unsorted: promptsGet_unsorted,
	promptsGet_folders: promptsGet_folders,
	promptsGet_categories: promptsGet_categories,
};