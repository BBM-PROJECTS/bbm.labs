'use strict';

const { faker } = require("@faker-js/faker");


module.exports = {
  async up(queryInterface, Sequelize) {
    const walletAddresses = [];

    for (let i = 0; i < 2; i++) {
      const usdtWalletAddress = `0x${faker.random.alphaNumeric(40)}`; // Assuming Ethereum-based USDT address format

      walletAddresses.push({
        id: faker.datatype.uuid(),
        address: usdtWalletAddress,
        currency_accepted: "USDT",
        type: "TRC20",
        max_amount: faker.finance.amount(), // Change from maxAmount to max_amount
        exchange: faker.company.buzzVerb(),
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,

      });
    }

    await queryInterface.bulkInsert("wallet_addresses", walletAddresses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("wallet_addresses", null, {});
  },
};
