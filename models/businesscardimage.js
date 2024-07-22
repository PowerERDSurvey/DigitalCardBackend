'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class businessCardImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      businessCardImage.belongsTo(models.BusinessCard, {
        foreignKey: 'cardId',
        onDelete: 'CASCADE',
      });
    }
  }
  businessCardImage.init({
    filename: DataTypes.STRING,
    filepath: DataTypes.STRING,
    type: DataTypes.STRING,
    cardId: DataTypes.INTEGER,
    data: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'businessCardImage',
  });
  return businessCardImage;
};