'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'randomKey', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'cardAllocationCount', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'createdcardcount', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'userAllocatedCount', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'usercreatedCount', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'assignedBy', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'isUserCardAllocated', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      ),
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isUserCardAllocated');
    queryInterface.removeColumn('Users', 'assignedBy');
    queryInterface.removeColumn('Users', 'usercreatedCount');
    queryInterface.removeColumn('Users', 'userAllocatedCount');
    queryInterface.removeColumn('Users', 'createdcardcount');
    queryInterface.removeColumn('Users', 'cardAllocationCount');
    queryInterface.removeColumn('Users', 'randomKey');
  }
};
