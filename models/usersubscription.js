'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userSubscription.belongsTo(models.product, {
        foreignKey: 'planId',
        as: 'product'
      });
      userSubscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      });
      userSubscription.belongsTo(models.company, {
        foreignKey: 'companyId',
        as: 'company'
      });
    }
  }
  userSubscription.init({
    subscriptionName: DataTypes.STRING,
    layout: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    planId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    companyId: DataTypes.INTEGER,
    cardCount: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'userSubscription',
  });
  return userSubscription;
};