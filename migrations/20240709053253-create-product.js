'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      cardCount: {
        type: Sequelize.INTEGER
      },
      layoutCount: {
        type: Sequelize.INTEGER
      },
      layoutId: {
        type: Sequelize.STRING
      },
      isDelete:{
        type: Sequelize.BOOLEAN
      },
      isActive:{
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull:false,
           references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
         model: 'Users',
         key: 'id',
       },
       onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('products');
  }
};