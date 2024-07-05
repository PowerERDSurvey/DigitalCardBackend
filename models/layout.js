'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class layout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  layout.init({
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    script: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'layout',
  });
  return layout;
};