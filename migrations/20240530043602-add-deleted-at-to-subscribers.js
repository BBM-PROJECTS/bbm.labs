"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Subscribers", "deleted_at", {
			type: Sequelize.DATE,
			allowNull: true,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Subscribers", "deleted_at");
	},
};
