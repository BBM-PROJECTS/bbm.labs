// models/walletAddress.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class WalletAddress extends Model {
        static associate(models) {
            // Add associations here if needed
        }
    }

    WalletAddress.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            max_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            exchange: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            currency_accepted: {
                type: DataTypes.STRING,
                allowNull: false,
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
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            paranoid: true,
            timestamps: true,
            underscored: true,
            modelName: "WalletAddress",
            tableName: "wallet_addresses",
        },
    );

    return WalletAddress;
};
