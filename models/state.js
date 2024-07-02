'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      State.belongsTo(models.Country, {
        foreignKey: 'countryId',
        as: 'country'
      });
    }
  }
  State.init({
    countryId: DataTypes.INTEGER,
    stateName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'State',
  });
  return State;
};