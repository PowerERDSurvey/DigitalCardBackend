'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.userImage, {
        foreignKey: 'userId',
        as: 'images',
      });
      User.hasMany(models.company, {
        foreignKey: 'createdBy',
        as: 'company',
      });
      User.hasMany(models.company, {
        foreignKey: 'updatedBy',
        as: 'company',
      });
      User.hasMany(models.product, {
        foreignKey: 'createdBy',
        as: 'product',
      });
      User.hasMany(models.product, {
        foreignKey: 'updatedBy',
        as: 'product',
      });
      User.hasMany(models.subscription, {
        foreignKey: 'createdBy',
        as: 'subscription',
      });
      User.hasMany(models.subscription, {
        foreignKey: 'updatedBy',
        as: 'subscription',
      });
      User.hasMany(models.BusinessCard, {
        foreignKey: 'userId',
        as: 'businessCards',
      });
      User.belongsTo(models.company, {
        foreignKey: 'companyId',
        as: 'company',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.userSubscription, {
        foreignKey: 'userId',
        as: 'userSubscription'
      });
      User.hasMany(models.payment, {
        foreignKey: 'userId',
        as: 'payment'
      });
      User.belongsTo(User, {
        as: 'Creator',
        foreignKey: 'createdBy',
      });
      User.belongsTo(User, {
        as: 'Updater',
        foreignKey: 'updatedBy',
      });
      User.belongsTo(User, {
        as: 'assigner',
        foreignKey: 'assignedBy',
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    primaryEmail: DataTypes.STRING,
    // secondaryEmail: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    verificationCode: DataTypes.STRING,
    passwordVerificationCode: DataTypes.STRING,
    randomInitialPassword: DataTypes.STRING,
    isEmailVerified: DataTypes.BOOLEAN,
    isDelete: DataTypes.BOOLEAN,
    mobileNumber: DataTypes.INTEGER,
    companyName: DataTypes.STRING,
    designation: DataTypes.STRING,
    whatsapp: DataTypes.INTEGER,
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    website: DataTypes.STRING,
    city: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    password: DataTypes.STRING,
    signupType: DataTypes.STRING,
    userName: DataTypes.STRING,
    Address: DataTypes.STRING,
    aboutMe: DataTypes.STRING,
    youtube: DataTypes.STRING,
    department: DataTypes.STRING,
    verificationExpires: DataTypes.DATE,
    randomKey: DataTypes.STRING,
    role: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    usercreatedCount: DataTypes.INTEGER,
    userAllocatedCount: DataTypes.INTEGER,
    createdcardcount: DataTypes.INTEGER,
    cardAllocationCount: DataTypes.INTEGER,
    assignedBy: DataTypes.INTEGER,
    isUserCardAllocated: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};