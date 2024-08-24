'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class theme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      theme.belongsTo(models.layout, {
        foreignKey: 'layoutId',
        as: 'layout'
      });
      theme.belongsTo(models.BusinessCard, {
        foreignKey: 'cardId',
        as: 'bussinesscard'
      })
    }
  }
  theme.init({
    name: DataTypes.STRING,
    layoutId: DataTypes.INTEGER,
    cardId: DataTypes.INTEGER,
    fontFamily: DataTypes.STRING,
    fontStyle: DataTypes.STRING,
    backgroundColor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'theme',
  });
  return theme;
};