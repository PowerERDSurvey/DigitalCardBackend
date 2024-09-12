'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the foreign key constraint
    await queryInterface.removeConstraint('userSubscriptions', 'usersubscriptions_ibfk_2');
  },

  async down(queryInterface, Sequelize) {
    // Re-add the foreign key constraint if needed
    await queryInterface.addConstraint('userSubscriptions', {
      fields: ['planId'],
      type: 'foreign key',
      name: 'usersubscriptions_ibfk_2', // Name of the constraint
      references: {
        table: 'subscriptions', // Reference table
        field: 'id', // Reference field
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
};