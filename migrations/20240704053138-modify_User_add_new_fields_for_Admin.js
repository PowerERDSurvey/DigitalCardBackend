'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'role', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'companyId', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'companies',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'isDelete', // new field name
        {
          
            type: Sequelize.BOOLEAN
          
        },
      ),
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isDelete'),
    queryInterface.removeColumn('Users', 'companyId'),
    queryInterface.removeColumn('Users', 'role')
  }
};
