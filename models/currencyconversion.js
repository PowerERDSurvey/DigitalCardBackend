'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurrencyConversion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CurrencyConversion.init({
    source: DataTypes.STRING,
    destination: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CurrencyConversion',
  });
  return CurrencyConversion;
};