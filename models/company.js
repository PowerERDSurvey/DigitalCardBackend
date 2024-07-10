'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      company.hasMany(models.User,{
        foreignKey:'companyId',
        as:'company'
      }),
      company.belongsTo(models.User,{
        foreignKey:'createdBy',
        as:'company'
      }),
      company.belongsTo(models.User,{
        foreignKey:'updatedBy',
        as:'company'
      });
      company.hasMany(models.userSubscription,{
        foreignKey:'companyId',
        as:'userSubscription'
      })
    }
  }
  company.init({

    companyName: DataTypes.STRING,
    address: DataTypes.STRING,
    mobileNumber: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    randomKey: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN,
    noOfUsers: DataTypes.INTEGER,
    noOfAdmin: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'company',
  });
  return company;
};