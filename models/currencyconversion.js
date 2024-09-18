'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CurrencyConversion extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  CurrencyConversion.init({
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'CurrencyConversion',
  });

  return CurrencyConversion;
};