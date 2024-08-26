'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusinessCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userRandomkey: {
        type: Sequelize.STRING,
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      primaryEmail: {
        type: Sequelize.STRING
      },
      // secondaryEmail: {
      //   type: Sequelize.STRING
      // },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      isDelete: {
        type: Sequelize.BOOLEAN
      },
      verificationCode: {
        type: Sequelize.STRING
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN
      },
      mobileNumber: {
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      designation: {
        type: Sequelize.STRING
      },
      whatsapp: {
        type: Sequelize.INTEGER
      },
      facebook: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      linkedin: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      zipCode: {
        type: Sequelize.INTEGER,
        validate: {
          len: [6, 6]
        }
      },
      country: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      aboutMe: {
        type: Sequelize.STRING
      },
      youtube: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      vCardDetails: {
        type: Sequelize.STRING(2000)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      randomKey: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BusinessCards');
  }
};