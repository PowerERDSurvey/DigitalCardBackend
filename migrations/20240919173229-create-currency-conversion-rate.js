'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CurrencyConversionRates', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      currency_code: {
        type: Sequelize.STRING(3), // VARCHAR(3)
        allowNull: false,
      },
      conversion_rate: {
        type: Sequelize.DECIMAL(10, 4), // DECIMAL(10, 4)
        allowNull: false,
      },
      base_currency: {
        type: Sequelize.STRING(3), // VARCHAR(3)
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CurrencyConversionRates');
  }
};