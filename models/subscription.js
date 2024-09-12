'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      subscription.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'subscription'
      }),
        subscription.belongsTo(models.User, {
          foreignKey: 'updatedBy',
          as: 'subscription'
        })
      subscription.belongsTo(models.product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
  }
  subscription.init({
    planName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    Description: DataTypes.STRING,
    currency: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'subscription',
  });
  return subscription;
};