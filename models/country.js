'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Country.hasMany(models.State, {
        foreignKey: 'countryId',
        as: 'states'
      });
    }
  }
  Country.init({
    countryName: DataTypes.STRING,
    timezone: {
      type: DataTypes.STRING,
      allowNull: true, // Set to false if you want to make it required
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true, // Set to false if you want to make it required
    },
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};
