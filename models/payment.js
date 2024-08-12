'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {

    static associate(models) {
      payment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  payment.init({
    checkoutId: DataTypes.STRING,
    productName: DataTypes.STRING,
    status: DataTypes.STRING,
    created: DataTypes.INTEGER,
    subId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};