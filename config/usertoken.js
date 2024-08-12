// const {sequelize ,DataTypes} = require('../config/sequelize');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
  host: global.gConfig.host,
  dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
const UserToken = require('../models/usertokens')(sequelize, DataTypes);

const insertToUsertToken = async function (userId, token) {

  return UserToken.create(
    {
      userId: userId,
      token: token
    }
  );

} //const insertToUsertToken =  function (userId, token)

const listUserTokens = async function (userId) {

  var queryInputs = {};

  queryInputs.attributes = [
    "userId",
    "token",
    "createdAt",
    "updatedAt",
  ];

  queryInputs.where = {
    userId: {
      [Sequelize.Op.eq]: userId,
    },
  };

  queryInputs.order = [['createdAt', 'DESC']]

  await UserToken.findAll(queryInputs)
    .then((userTokens) => {
      // userTokens.forEach((userToken)=>{
      //     //console.log("log userId",userToken.dataValues.userId);
      //     //console.log("log token",userToken.dataValues.token);
      //     //console.log("log createdAt",userToken.dataValues.createdAt);
      //     //console.log("log updatedAt",userToken.dataValues.updatedAt);
      // });
      //   //console.log("list usertoken",userTokens);
    }
    ).catch((error) => {
      console.error("list error usertoken ", error);
    });

} //const listUserTokens = function (userId)

const getLatestUserToken = async function (userId) {

  var queryInputs = {};

  queryInputs.attributes = [
    "userId",
    "token",
    "createdAt",
    "updatedAt",
  ];

  queryInputs.where = {
    userId: {
      [Sequelize.Op.eq]: userId,
    },
  };

  queryInputs.order = [['createdAt', 'DESC']]

  return UserToken.findOne(queryInputs);

} //const listUserTokens = function (userId)


const deleteExpiredTokens = async function (userId) {

  const currentDate = new Date();
  const date24HoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
  var queryInputs = {};

  queryInputs.where = {
    userId: userId,
    createdAt: {
      [Sequelize.Op.lt]: date24HoursAgo,
    }
  };

  await UserToken.destroy(queryInputs)
    .then((deletionInfo) => {
      console.info("delete usertoken", deletionInfo);
    })
    .catch((error) => {
      console.error('delete error usertoken', error);
    });

} //const deleteExpiredTokens = function (userId)

module.exports = { insertToUsertToken, listUserTokens, getLatestUserToken, deleteExpiredTokens };