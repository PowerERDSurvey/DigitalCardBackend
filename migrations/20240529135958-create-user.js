'use strict';

const { uniq } = require('lodash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      primaryEmail: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      // secondaryEmail: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      //   unique: false
      // },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      verificationCode: {
        type: Sequelize.STRING
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      companyName: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
      whatsapp: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      facebook: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      instagram: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      linkedin: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      website: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      city: {
        type: Sequelize.STRING
      },
      zipCode: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('Users');
  }
};