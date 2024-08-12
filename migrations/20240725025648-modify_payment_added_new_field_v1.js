'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn(
      'payments', // table name
      'subId', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('payments', 'subId')
  }
};
