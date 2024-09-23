'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Countries', 'timezone', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if you want to make it required
    });

    await queryInterface.addColumn('Countries', 'currency', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if you want to make it required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Countries', 'timezone');
    await queryInterface.removeColumn('Countries', 'currency');
  },
};