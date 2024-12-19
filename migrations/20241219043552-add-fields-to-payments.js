'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'Name', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed
    });
    await queryInterface.addColumn('payments', 'userName', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed
    });
    await queryInterface.addColumn('payments', 'companyName', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('payments', 'companyName');
    await queryInterface.removeColumn('payments', 'userName');
    await queryInterface.removeColumn('payments', 'Name');
  }
};
