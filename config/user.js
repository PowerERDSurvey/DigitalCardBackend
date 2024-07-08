const { update } = require('lodash');
const { sequelize, DataTypes } = require('../config/sequelize');
var User = require('../models/user')(sequelize, DataTypes);



let users = {
  create: async function (inputParams, cb) {
    console.log('inputParams' + inputParams);


    User.create(inputParams).then(async (user) => {
      console.log('user' + user);
      cb(null, user);
    }).catch((err) => {
      cb(err, null);
    });
  },
  update: async function (UserId, inputParams, cb) {
    User.update(
      inputParams,
      {
        where: {
          id: UserId,
        },
        returning: true,
      },
    ).then(() => {
      return User.findOne({ where: { id: UserId } }); // Fetch the updated user
    })
      .then((updatedUser) => {
        console.log('Updated user:', updatedUser);
        cb(null, updatedUser);
      })
      .catch((err) => {
        cb(err, null);
      });
  },
  getActiveEmails: function (cb) {
    var queryInputs = {
      // attributes: ['email'],
      where: {
        IsActive: true,
      }
    };


    User.findAll(queryInputs).then((email_addresses) => {
      cb(null, email_addresses);
    }).catch((err) => {
      cb(err, null);
    });

  },
  getActivePassword: function (cb) {
    var queryInputs = {
      attributes: ['password'],
      where: {
        IsActive: true,
      }
    };


    User.findAll(queryInputs).then((password) => {
      cb(null, password);
    }).catch((err) => {
      cb(err, null);
    });

  },
  getOneUser: function (userId, cb) {
    User.findOne({
      attributes: ['verificationCode', 'verificationExpires', 'isActive'],
      where: { id: userId },
      rejectOnEmpty: true,
    }).then((user) => {
      cb(null, user);
    }).catch((err) => {
      cb(err, null);
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
  deleteUser: async function(UserId){
    const updatedUser = await User.update({isDelete : true },{
        where: {
            id: UserId
        },
        returning: true,
    });
    return updatedUser;
}
}

module.exports = users;