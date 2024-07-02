'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessCard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BusinessCard.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      User.hasMany(models.businessCardImage, {
        foreignKey: 'cardId',
        as: 'images',
      });
    }
  }
  BusinessCard.init({
    userId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    primaryEmail: DataTypes.STRING,
    secondaryEmail: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    verificationCode: DataTypes.STRING,
    isEmailVerified: DataTypes.BOOLEAN,
    mobileNumber: DataTypes.STRING,
    companyName: DataTypes.STRING,
    designation: DataTypes.STRING,
    whatsapp: DataTypes.STRING,
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    website: DataTypes.STRING,
    city: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    Address: DataTypes.STRING,
    aboutMe: DataTypes.STRING,
    youtube: DataTypes.STRING,
    department: DataTypes.STRING,
    vCardDetails: DataTypes.STRING,
    randomKey:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BusinessCard',
  });
  return BusinessCard;
};