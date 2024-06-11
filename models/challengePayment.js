// models/challengePayment.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class ChallengePayment extends Model {
		static associate(models) {
			this.belongsTo(models.User, { foreignKey: "user_id" });
			this.belongsTo(models.Challenge, { foreignKey: "challenge_id" });
		}
	}

	ChallengePayment.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			challenge_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			paid_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			paranoid: true,
			timestamps: true,
			underscored: true,
			modelName: "ChallengePayment",
			tableName: "challenge_payments",
		},
	);
	return ChallengePayment;
};
