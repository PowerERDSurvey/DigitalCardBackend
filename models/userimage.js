'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userImage extends Model {
    static associate(models) {
      // Define association here
      userImage.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }

  userImage.init({
    filename: DataTypes.STRING,
    filepath: DataTypes.STRING,
    type: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    data:DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'userImage',
  });

  return userImage;
};
