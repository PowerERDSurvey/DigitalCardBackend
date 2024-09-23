'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CurrencyConversionRate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CurrencyConversionRate.init({
    currency_code: DataTypes.STRING(3),
    conversion_rate: DataTypes.DECIMAL(10, 4),
    base_currency: DataTypes.STRING(3)
  }, {
    sequelize,
    modelName: 'CurrencyConversionRate',
  });
  return CurrencyConversionRate;
};