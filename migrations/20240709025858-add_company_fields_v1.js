'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'companies', // table name
        'noOfUsers', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'companies', // table name
        'noOfAdmin', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      // queryInterface.addColumn(
      //   'companies', // table name
      //   'ActiveCardCount', // new field name
      //   {
      //     type: Sequelize.INTEGER,
      //     allowNull: false,
      //   },
      // ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.removeColumn('companies', 'ActiveCardCount'),
      queryInterface.removeColumn('companies', 'noOfAdmin'),
      queryInterface.removeColumn('companies', 'noOfUsers')
    ])
  }
};
