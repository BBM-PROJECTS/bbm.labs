"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const platforms = ["BBM", "BBM Ace", "BBM Capitalis"];
		const contacts = [];

		for (let i = 0; i < 10; i++) {
			contacts.push({
				id: faker.string.uuid(),
				fullname: faker.person.fullName(),
				email: faker.internet.email(),
				phone_number: faker.phone.number(),
				subject: faker.lorem.words(5),
				message: faker.lorem.paragraph(),
				platform: platforms[Math.floor(Math.random() * platforms.length)],
				created_at: new Date(),
				updated_at: new Date(),
			});
		}

		await queryInterface.bulkInsert("Contacts", contacts, {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Contacts", null, {});
	},
};
