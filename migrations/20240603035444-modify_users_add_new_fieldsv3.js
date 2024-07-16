'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'Address', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'passwordVerificationCode', // new field name
        {
          type: Sequelize.STRING(1000),
          allowNull: true,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([


      queryInterface.removeColumn('Users', 'passwordVerificationCode'),
      queryInterface.removeColumn('Users', 'Address'),
    ]);
  }
};
