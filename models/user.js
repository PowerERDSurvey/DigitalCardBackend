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
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    primaryEmail: DataTypes.STRING,
    SecondryEmail: DataTypes.STRING,
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
    password: DataTypes.STRING,
    signupType:DataTypes.STRING,
    userName:DataTypes.STRING,
    Address:DataTypes.STRING,
    aboutMe:DataTypes.STRING,
    youtube:DataTypes.STRING,
    department:DataTypes.STRING,
    verificationExpires: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};