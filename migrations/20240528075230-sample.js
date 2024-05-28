'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  
  await queryInterface.createTable('ero_email_identity', {
    ROW_ID: {
      unique: true,
      autoIncrement: true,
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ORG_ID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    EMAIL_ADDRESS: {
      type: Sequelize.DataTypes.STRING(80),
      allowNull: false
    }
    
});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ero_emailindentity');
  }
  
};
