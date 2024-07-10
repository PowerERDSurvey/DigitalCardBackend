'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('themes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      layoutId: {
        type: Sequelize.INTEGER,
        allowNull:false,
           references: {
            model: 'layouts',
            key: 'id',
          },
          onUpdate: 'CASCADE'
      },
      cardId: {
        type: Sequelize.INTEGER,
        allowNull:false,
           references: {
            model: 'BusinessCards',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      },
      fontFamily: {
        type: Sequelize.STRING
      },
      fontStyle: {
        type: Sequelize.STRING
      },
      backgroundColor: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('themes');
  }
};