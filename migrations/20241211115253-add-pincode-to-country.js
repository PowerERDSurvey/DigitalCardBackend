'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('countries', 'pincode', {
      type: Sequelize.INTEGER,
      allowNull: false, // Change to false if you want to make it required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('countries', 'pincode');
  }
};
