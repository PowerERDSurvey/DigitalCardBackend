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
      queryInterface.addColumn(
        'Users', // table name
        'randomInitialPassword', // new field name
        {
          type: Sequelize.STRING(1000),
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', // table name
        'createdBy', // new field name
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
        'updatedBy', // new field name
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
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([


      queryInterface.removeColumn('Users', 'passwordVerificationCode'),
      queryInterface.removeColumn('Users', 'Address'),
    ]);
  }
};
