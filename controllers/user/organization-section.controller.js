const OrganizationSectionItem = require('../../models/user/organization-section.model');
const Prompt = require('../../models/user/prompt.model');


async function addOrEditOrganizationSectionItem(req, res, next) {
	const organizationSectionItemData = {
		uid: res.locals.uid,
		organization_section_type: req.body.organization_section_type,
	};

	const organizationSectionTypeLabels = {
		folders: {
			labelDefinite_da: 'mappen',
		},
		categories: {
			labelDefinite_da: 'kategorien',
		},
	};

	let validationConditions = [];
	if (organizationSectionItemData.organization_section_type && ['folders', 'categories'].includes(organizationSectionItemData.organization_section_type)) {
		
		const name = req.body.name.trim();
		let nameHasValue = false;
		if (name && name.length > 0) {
			nameHasValue = true;
			organizationSectionItemData.name = name;
		}

		let noTechnicalErrors = true;
		let nameIsAvailable = true;
		if (nameHasValue) {
			try {
				const organizationSectionWithSameName_INSTANCE = await OrganizationSectionItem.findByCriteria(
					res.locals.uid,
					{name: organizationSectionItemData.name},
					organizationSectionItemData.organization_section_type
				);
				// hvis organizationSectionWithSameName_INSTANCE har nogle items så er navnet i brug
				if (organizationSectionWithSameName_INSTANCE.length > 0) {
					// hvis brugere er ved at redigere et item og denne har samme id som idét på organizationSectionWithSameName_INSTANCE så tillad denne ændring
					if (req.body.item_id && organizationSectionWithSameName_INSTANCE[0].id === req.body.item_id) {
						nameIsAvailable = true;
					} else {
						nameIsAvailable = false;
					}
				} else {
					nameIsAvailable = true;
				}
			} catch (error) {
				console.log(error);
				noTechnicalErrors = false;
			}
		}

		validationConditions = [
			{
				invalidMessage: `FEJL: Der var intet indhold i ${ req.body.item_id ? 'det nye navn' : 'navnet' } på ${organizationSectionTypeLabels[organizationSectionItemData.organization_section_type].labelDefinite_da} du prøvede at ${ req.body.item_id ? 'redigere' : 'oprette' }.`,
				check: nameHasValue
			},
			{
				invalidMessage: `FEJL: Navnet på ${organizationSectionTypeLabels[organizationSectionItemData.organization_section_type].labelDefinite_da} du prøvede at ${ req.body.item_id ? 'redigere' : 'oprette' } er allerede i brug. Foretag en ændring og prøv igen. Hvis du ønsker præcis samme navn så kan du for eksempel blot ændre et af bogstaverne fra stort til småt eller omvendt.`,
				check: nameIsAvailable
			},
			{
				invalidMessage: `FEJL: Der opstod en teknisk fejl.`,
				check: noTechnicalErrors
			},
		];
	} else {
		validationConditions = [
			{
				invalidMessage: 'FEJL: Der findes ingen organization section type af den type der er sendt i request.',
				check: false
			},
		];
	}

	let validateRes = [];
	validationConditions.forEach(condition => {
		if (!condition.check) {
			validateRes.push(condition.invalidMessage);
		}
	});

	let statuscode = 400;
	let feedbackMessages = validateRes.join('\n');
	let newOrganizationSectionItem;

	if (validateRes.length === 0) {
		try {
			if (req.body.item_id) {
				organizationSectionItemData._id = req.body.item_id;
			}
			const organizationSectionItemInstance = new OrganizationSectionItem(organizationSectionItemData);
			newOrganizationSectionItem = await organizationSectionItemInstance.save();

			statuscode = 201;
			feedbackMessages = 'organization-section item added successfully!';
			if (req.body.item_id) {
				feedbackMessages = 'organization-section item edited successfully!';
				statuscode = 200;
			}
		} catch (error) {
			console.log(error);
			feedbackMessages = `Der opstod en teknisk fejl under oprettelsen af ${organizationSectionTypeLabels[organizationSectionItemData.organization_section_type].labelDefinite_da}.`;
			if (req.body.item_id) {
				feedbackMessages = `Der opstod en teknisk fejl under redigeringen af ${organizationSectionTypeLabels[organizationSectionItemData.organization_section_type].labelDefinite_da}.`;
			}
		}
	}

	res.status(statuscode).json({
		message: feedbackMessages,
		newOrganizationSectionItem: newOrganizationSectionItem,
	});
};


async function deleteOrganizationSectionItem(req, res, next) {
	let organizationSectionItem;
	try {
		organizationSectionItem = await OrganizationSectionItem.findById(
			req.params.id,
			req.params.organization_section_type
		);
		await organizationSectionItem.remove();

		// Opdaterer alle dokumenter, hvor 'uid' matcher, og 'organization_categories' er lig med 'categoryId'
		const additionalCriteria = {};
		additionalCriteria[`organization_${req.params.organization_section_type}`] = req.params.id;
		const updateConfig = {};
		updateConfig[`organization_${req.params.organization_section_type}`] = '';
		Prompt.updateManyDocuments(
			res.locals.uid,
			additionalCriteria,
			updateConfig
		)
	} catch (error) {
		return next(error);
	}
	res.json({message: 'Deleted item!'})
};


module.exports = {
	addOrEditOrganizationSectionItem: addOrEditOrganizationSectionItem,
	deleteOrganizationSectionItem: deleteOrganizationSectionItem,
};