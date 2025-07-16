const mongodb = require('mongodb');
const db = require('../../data/database');

class OrganizationSectionItem {
	constructor(organizationSectionItemData) {
		this.uid = organizationSectionItemData.uid;
		this.organization_section_type = organizationSectionItemData.organization_section_type; // 'folders', 'categories'
		this.name = organizationSectionItemData.name;
		if (organizationSectionItemData._id) {
			this.id = organizationSectionItemData._id.toString();
		}
	}


	static async findAll(uid, organization_section_type) {
		let userId;
		try {
			userId = new mongodb.ObjectId(uid);
		} catch (error) {
			error.code = 404;
			throw error;
		}

		const allOrganizationSectionItems = await db
		.getDb()
		.collection(organization_section_type)
		.find({uid: userId})
		.toArray();
		
		if (!allOrganizationSectionItems) {
			const error = new Error(`Something went wrong when trying to find organization section items belonging to user (uid: ${userId}).`);
			error.code = 404;
			throw error;
		}

		return allOrganizationSectionItems.map(function(itemDocument) {
			let organizationSectionItemInstance = new OrganizationSectionItem(itemDocument);
			delete organizationSectionItemInstance.uid;
			delete organizationSectionItemInstance.organization_section_type;
			return organizationSectionItemInstance;
		});
	}


	static async findByCriteria(uid, additionalCriteria = {}, organization_section_type) {
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
		const allPrompts = await db
		.getDb()
		.collection(organization_section_type)
		.find(finalCriteria)
		.toArray();
		if (!allPrompts) {
			const error = new Error('Something went wrong when trying to find organization section items belonging to user.');
			error.code = 404;
			throw error;
		}

		const formattedPrompts = [];
		for (const promptDocument of allPrompts) {
			let promptInstance = new OrganizationSectionItem(promptDocument);
			delete promptInstance.uid;
			delete promptInstance.organization_section_type;
			formattedPrompts.push(promptInstance);
		}
		return formattedPrompts;
	}


	static async findById(itemId, organization_section_type) {
		let id;
		try {
			id = new mongodb.ObjectId(itemId);
		} catch (error) {
			error.code = 404;
			throw error;
		}
		const item = await db
			.getDb()
			.collection(organization_section_type)
			.findOne({ _id: id });

		if (!item) {
			const error = new Error(`Could not find organization section item with provided id (${id}).`);
			error.code = 404;
			throw error;
		}

		return new OrganizationSectionItem(item);
	}


	async save() {
		let userId;
		try {
			userId = new mongodb.ObjectId(this.uid);
		} catch (error) {
			error.code = 404;
			throw error;
		}

		const itemData = {
			uid: userId,
			organization_section_type: this.organization_section_type,
			name: this.name,
		};

		let newOrEditedOrganizationSectionItemId;
		if (this.id) {
			const organizationSectionItemId = new mongodb.ObjectId(this.id);
			const newOrEditedOrganizationSectionItemDocument = await db
			.getDb()
			.collection(this.organization_section_type)
			.updateOne({_id: organizationSectionItemId}, {$set: itemData});
			newOrEditedOrganizationSectionItemId = organizationSectionItemId;
		} else {
			const newOrEditedOrganizationSectionItemDocument = await db
			.getDb()
			.collection(this.organization_section_type)
			.insertOne(itemData);
			newOrEditedOrganizationSectionItemId = newOrEditedOrganizationSectionItemDocument.insertedId;
		}

		const newOrganizationSectionItemInstance = await OrganizationSectionItem.findById(
			newOrEditedOrganizationSectionItemId,
			this.organization_section_type
		);

		delete newOrganizationSectionItemInstance.uid;
		delete newOrganizationSectionItemInstance.organization_section_type;
		return newOrganizationSectionItemInstance;
	}

	
	remove() {
		const itemId = new mongodb.ObjectId(this.id);
		return db
		.getDb()
		.collection(this.organization_section_type)
		.deleteOne({_id: itemId});
	}


}

module.exports = OrganizationSectionItem;