'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      product.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'product'
      }),
        product.belongsTo(models.User, {
          foreignKey: 'updatedBy',
          as: 'product'
        }),
        product.hasMany(models.subscription, {
          foreignKey: 'productId',
          as: 'product',
        });
    }
  }
  product.init({
    name: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    cardPrice: DataTypes.INTEGER,
    layoutCount: DataTypes.INTEGER,
    layoutId: DataTypes.STRING,
    plantype: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isDelete: DataTypes.BOOLEAN,
    duration: DataTypes.INTEGER,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};