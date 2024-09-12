'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'layouts', {
      type: Sequelize.STRING(500), // Assuming layouts will be stored as a JSON object
      allowNull: true
    });

    await queryInterface.addColumn('payments', 'cardCount', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('payments', 'duration', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.renameColumn('payments', 'subId', 'planId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('payments', 'planId', 'subId');
    await queryInterface.removeColumn('payments', 'duration');
    await queryInterface.removeColumn('payments', 'cardCount');
    await queryInterface.removeColumn('payments', 'layouts');

  }
};
