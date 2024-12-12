'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('Countries',
      { pincode: 6 }, // Set pincode for India
      { countryName: 'India' }
    );

    await queryInterface.bulkUpdate('Countries',
      { pincode: 5 }, // Set pincode for the United States
      { countryName: 'United States' }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('Countries',
      { pincode: null }, // Reset pincode for India
      { countryName: 'India' }
    );

    await queryInterface.bulkUpdate('Countries',
      { pincode: null }, // Reset pincode for the United States
      { countryName: 'United States' }
    );
  }
};
