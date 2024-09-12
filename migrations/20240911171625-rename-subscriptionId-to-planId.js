'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the column
    await queryInterface.renameColumn('userSubscriptions', 'subscriptionId', 'planId');

    // Update the foreign key reference
    await queryInterface.changeColumn('userSubscriptions', 'planId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'products', // Updated reference model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the column name change


    // Revert the foreign key reference
    await queryInterface.changeColumn('userSubscriptions', 'subscriptionId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'subscriptions', // Original reference model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.renameColumn('userSubscriptions', 'planId', 'subscriptionId');
  }
};
