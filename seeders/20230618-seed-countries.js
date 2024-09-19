'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Countries', [
      {
        countryName: 'India',
        currency: 'INR', // Add currency for India
        timezone: 'Asia/Kolkata', // Add timezone for India
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        countryName: 'United States',
        currency: 'USD', // Add currency for the United States
        timezone: 'America/New_York', // Add timezone for the United States
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Countries', {
      countryName: {
        [Sequelize.Op.in]: ['India', 'United States'] // Remove the specific countries
      }
    }, {});
  }
};
