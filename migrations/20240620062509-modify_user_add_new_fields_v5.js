'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'randomKey', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'randomKey')
  }
};
