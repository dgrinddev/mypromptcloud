const mongodb = require('mongodb');
const db = require('../../data/database');

const OrganizationSectionItem = require('./organization-section.model');


class Prompt {
	constructor(promptData) {
		this.uid = promptData.uid;
		this.title = promptData.title;
		this.prompttype = promptData.prompttype;
		this.content = promptData.content;
		this.organization_folders = promptData.organization_folders;
		this.organization_categories = promptData.organization_categories;
		if (promptData._id) {
			this.id = promptData._id.toString();
		}
	}

	
	static async updateManyDocuments(uid, additionalCriteria = {}, updateConfig) {
		// Opret basis kriterie for søgning, hvor 'uid' er lig med brugerens ID
		let baseCriteria;
		if (uid) {
			let uid_ID;
			try {
				uid_ID = new mongodb.ObjectId(uid);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			baseCriteria = { uid: uid_ID };
		} else {
			baseCriteria = {};
		}
		// Omdan organization_folders til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria.organization_folders) {
			let organization_folders_ID;
			try {
				organization_folders_ID = new mongodb.ObjectId(additionalCriteria.organization_folders);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria.organization_folders = organization_folders_ID;
		}
		// Omdan organization_categories til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria.organization_categories) {
			let organization_categories_ID;
			try {
				organization_categories_ID = new mongodb.ObjectId(additionalCriteria.organization_categories);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria.organization_categories = organization_categories_ID;
		}
		// Omdan id til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria._id) {
			let id_ID;
			try {
				id_ID = new mongodb.ObjectId(additionalCriteria._id);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria._id = id_ID;
		}
		// Kombiner basis kriterie med ekstra kriterier
		const finalCriteria = { ...baseCriteria, ...additionalCriteria };
		// Definer update operation
		const updateOperation = { $set: updateConfig };
		try {
			// Udfør opdatering på MongoDB
			await db
			.getDb()
			.collection('prompts')
			.updateMany(finalCriteria, updateOperation);
			return;
		} catch (error) {
			console.error("Fejl ved opdatering af dokumenter: ", error);
			throw error;
		}
	}


	static async findByCriteria(uid, additionalCriteria = {}, organizationSectionItemsAs) {
		// Opret basis kriterie for søgning, hvor 'uid' er lig med brugerens ID
		let baseCriteria;
		if (uid) {
			let uid_ID;
			try {
				uid_ID = new mongodb.ObjectId(uid);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			baseCriteria = { uid: uid_ID };
		} else {
			baseCriteria = {};
		}
		// Omdan organization_folders til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria.organization_folders) {
			let organization_folders_ID;
			try {
				organization_folders_ID = new mongodb.ObjectId(additionalCriteria.organization_folders);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria.organization_folders = organization_folders_ID;
		}
		// Omdan organization_categories til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria.organization_categories) {
			let organization_categories_ID;
			try {
				organization_categories_ID = new mongodb.ObjectId(additionalCriteria.organization_categories);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria.organization_categories = organization_categories_ID;
		}
		// Omdan id til ObjectId, hvis den findes i additionalCriteria
		if (additionalCriteria._id) {
			let id_ID;
			try {
				id_ID = new mongodb.ObjectId(additionalCriteria._id);
			} catch (error) {
				error.code = 404;
				throw error;
			}
			additionalCriteria._id = id_ID;
		}
		// Kombiner basis kriterie med ekstra kriterier
		const finalCriteria = { ...baseCriteria, ...additionalCriteria };
		// console.log('finalCriteria: ');
		// console.log(finalCriteria);
		const allPrompts = await db
		.getDb()
		.collection('prompts')
		.find(finalCriteria)
		.sort({ _id: -1 }) // Sorterer efter '_id' i faldende rækkefølge (nyeste først)
		.toArray();
		// console.log('allPrompts: ');
		// console.log(allPrompts);
		if (!allPrompts) {
			const error = new Error('Something went wrong when trying to find prompts belonging to user.');
			error.code = 404;
			throw error;
		}
		const formattedPrompts = [];
		const organizationSectionTypes = ['folders', 'categories'];
		let index;
		// console.log('organizationSectionTypes: ');
		// console.log(organizationSectionTypes);
		// console.log('organizationSectionTypes[0]: ');
		// console.log(organizationSectionTypes[0]);
		for (const promptDocument of allPrompts) {
			// console.log('promptDocument: ');
			// console.log(promptDocument);
			// gem en ny const 'created_at' ved at udlede datoen fra ObjectId
			const created_at = promptDocument._id.getTimestamp();
			// lav en instance of Prompt så jeg kan få "id"-property i stedet for "_id"-property
			let promptInstance = new Prompt(promptDocument);
			// console.log('promptInstance: ');
			// console.log(promptInstance);
			// Tilføj en ny property 'created_at' og få datoen fra created_at const
			promptInstance.created_at = created_at;
			// console.log('promptInstance efter created_at property er tilføjet: ');
			// console.log(promptInstance);
			// console.log(`er det sandt at organizationSectionItemsAs indeholder en af disse?: '_id', 'id', 'organization_section_type', 'name', 'ALL'.: ${['_id', 'id', 'organization_section_type', 'name', 'ALL'].includes(organizationSectionItemsAs)}`);
			index = 0;
			if (['_id', 'id', 'organization_section_type', 'name', 'ALL'].includes(organizationSectionItemsAs)){

				// console.log(`index: ${index}`);
				// console.log(`har den ${organizationSectionTypes[index]}?: ${promptInstance[`organization_${organizationSectionTypes[index]}`] ? 'true' : 'false'}`);
				if (promptInstance[`organization_${organizationSectionTypes[index]}`]) {
					// console.log(`promptInstance har organization_${organizationSectionTypes[index]}`);
					try {
						// lav en instance af OrganizationSectionItem så jeg kan få "id"-property i stedet for "_id"-property
						const organizationSectionItemInstance = new OrganizationSectionItem({
							organization_section_type: organizationSectionTypes[index],
							_id: promptInstance[`organization_${organizationSectionTypes[index]}`]
						});
						// console.log('organizationSectionItemInstance: ');
						// console.log(organizationSectionItemInstance);
						// lav en ny instance af OrganizationSectionItem som indeholder alt data fra databasen om denne item
						const organizationSectionItem = await OrganizationSectionItem.findById(
							organizationSectionItemInstance.id,
							organizationSectionTypes[index]
						);
						// console.log('organizationSectionItem: ');
						// console.log(organizationSectionItem);
						if (organizationSectionItemsAs === 'ALL') {
							// i promptInstance´s "organization_[folders|categories]"-property indsæt den pågældende organizationSectionItem
							promptInstance[`organization_${organizationSectionTypes[index]}`] = organizationSectionItem;
						} else {
							// i promptInstance´s "organization_[folders|categories]"-property indsæt værdien fra den pågældende organizationSectionItem´s property (værdien fra en af dens properties: '_id', 'organization_section_type' eller 'name')
							promptInstance[`organization_${organizationSectionTypes[index]}`] = organizationSectionItem[organizationSectionItemsAs];
						}
						// console.log('promptInstance efter organizationSectionItemsAs: ');
						// console.log(promptInstance);
					} catch (error) {
						console.error(`Error fetching organization_${organizationSectionTypes[index]} for prompt ID ${promptInstance.id}:`, error.message);
						promptInstance[`organization_${organizationSectionTypes[index]}`] = '';
						// console.log('promptInstance i catch error: ');
						// console.log(promptInstance);
					}
				}
				index++;

				// console.log(`index: ${index}`);
				// console.log(`har den ${organizationSectionTypes[index]}?: ${promptInstance[`organization_${organizationSectionTypes[index]}`] ? 'true' : 'false'}`);
				if (promptInstance[`organization_${organizationSectionTypes[index]}`]) {
					// console.log(`promptInstance har organization_${organizationSectionTypes[index]}`);
					try {
						// lav en instance af OrganizationSectionItem så jeg kan få "id"-property i stedet for "_id"-property
						const organizationSectionItemInstance = new OrganizationSectionItem({
							organization_section_type: organizationSectionTypes[index],
							_id: promptInstance[`organization_${organizationSectionTypes[index]}`]
						});
						// console.log('organizationSectionItemInstance: ');
						// console.log(organizationSectionItemInstance);
						// lav en ny instance af OrganizationSectionItem som indeholder alt data fra databasen om denne item
						const organizationSectionItem = await OrganizationSectionItem.findById(
							organizationSectionItemInstance.id,
							organizationSectionTypes[index]
						);
						// console.log('organizationSectionItem: ');
						// console.log(organizationSectionItem);
						if (organizationSectionItemsAs === 'ALL') {
							// i promptInstance´s "organization_[folders|categories]"-property indsæt den pågældende organizationSectionItem
							promptInstance[`organization_${organizationSectionTypes[index]}`] = organizationSectionItem;
						} else {
							// i promptInstance´s "organization_[folders|categories]"-property indsæt værdien fra den pågældende organizationSectionItem´s property (værdien fra en af dens properties: '_id', 'organization_section_type' eller 'name')
							promptInstance[`organization_${organizationSectionTypes[index]}`] = organizationSectionItem[organizationSectionItemsAs];
						}
						// console.log('promptInstance efter organizationSectionItemsAs: ');
						// console.log(promptInstance);
					} catch (error) {
						console.error(`Error fetching organization_${organizationSectionTypes[index]} for prompt ID ${promptInstance.id}:`, error.message);
						promptInstance[`organization_${organizationSectionTypes[index]}`] = '';
						// console.log('promptInstance i catch error: ');
						// console.log(promptInstance);
					}
				}
				index++;

			}
			delete promptInstance.uid;
			// console.log('promptInstance før push til formattedPrompts: ');
			// console.log(promptInstance);
			formattedPrompts.push(promptInstance);
		}
		// console.log('formattedPrompts efter for loop: ');
		// console.log(formattedPrompts);
		return formattedPrompts;
	}


	async save() {
		let uid_ID;
		let organization_folders_ID;
		let organization_categories_ID;
		try {
			uid_ID = new mongodb.ObjectId(this.uid);
			organization_folders_ID = this.organization_folders === '' ? '' : new mongodb.ObjectId(this.organization_folders);
			organization_categories_ID = this.organization_categories === '' ? '' : new mongodb.ObjectId(this.organization_categories);
		} catch (error) {
			error.code = 404;
			throw error;
		}

		const promptData = {
			uid: uid_ID,
			title: this.title,
			prompttype: this.prompttype,
			content: this.content,
			organization_folders: organization_folders_ID,
			organization_categories: organization_categories_ID,
		};

		if (this.id) {
			const promptId = new mongodb.ObjectId(this.id);
			await db
			.getDb()
			.collection('prompts')
			.updateOne({_id: promptId}, {$set: promptData});
		} else {
			await db
			.getDb()
			.collection('prompts')
			.insertOne(promptData);
		}
	}


	remove() {
		const promptId = new mongodb.ObjectId(this.id);
		return db
		.getDb()
		.collection('prompts')
		.deleteOne({_id: promptId});
	}


}

module.exports = Prompt;