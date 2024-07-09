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
      company.belongsTo(models.User,{
        foreignKey:'createdBy',
        as:'product'
      }),
      company.belongsTo(models.User,{
        foreignKey:'updatedBy',
        as:'product'
      })
    }
  }
  product.init({
    name: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    cardCount: DataTypes.INTEGER,
    layoutCount: DataTypes.INTEGER,
    layoutId: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    isDelete:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};