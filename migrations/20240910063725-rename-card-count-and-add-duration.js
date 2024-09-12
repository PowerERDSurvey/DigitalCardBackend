'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('products', 'cardCount', 'cardPrice');

    await queryInterface.addColumn('products', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.addColumn('products', 'currency', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'currency');
    await queryInterface.removeColumn('products', 'duration');
    await queryInterface.renameColumn('products', 'cardPrice', 'cardCount');



  }
};