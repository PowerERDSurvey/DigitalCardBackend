const { update } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var User = require('../models/user')(sequelize, DataTypes);



let users = {
  create: async function (inputParams) {
    console.log('inputParams' + inputParams);


    return await User.create(inputParams);
  },
  update: async function (UserId, inputParams) {
   const updatedUser = await User.update(
      inputParams,
      {
        where: {
          id: UserId,
        },
        returning: true,
      },
    );
    return await User.findOne({ where: { id: UserId } });
  },
  getActiveEmails: async function () {
    var queryInputs = {
      // attributes: ['email'],
      where: {
        IsActive: true,
      }
    };


    return await User.findAll(queryInputs);

  },
  getActivePassword: async function () {
    var queryInputs = {
      attributes: ['password'],
      where: {
        IsActive: true,
      }
    };


    return await User.findAll(queryInputs);

  },
  getOneUser: async function (userId) {
    return await User.findOne({
      attributes: ['verificationCode', 'verificationExpires', 'isActive'],
      where: { id: userId },
      rejectOnEmpty: true,
    });
  },
  getUsertokenById: async function (userId,verificationCodeParam) {
    return await User.findOne({
      where: { id: userId,verificationCode : verificationCodeParam },
      attributes: ['id','verificationCode', 'verificationExpires', 'isActive'],
      // rejectOnEmpty: true,
    })
  },
  getUser: async function (userId) {
    return await User.findOne({where: { id: userId}})
  },
  getSuperAdmin: async function (userId) {
    return await User.findOne({where: { id: userId, role : 'SUPER_ADMIN', IsActive: true}})
  },
  getUserByRole: async function (rolepar) {
    return await User.findAll({where: { role: rolepar, isDelete: false}})
  },
  getCompanybasedUser: async function (companyIdpar,rolepar) {
    return await User.findAll({where: { companyId :companyIdpar, role: rolepar, isDelete: false}})
  },
  deleteUser: async function(adminId,UserId){
    const updatedUser = await User.update({isDelete : true, updatedBy: adminId },{
        where: {
            id: UserId
        },
        returning: true,
    });
    return updatedUser;
}
}

module.exports = users;