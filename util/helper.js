// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
// 	host: global.gConfig.host,
// 	dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
// const userImage = require('../models/userimage.js')(sequelize, DataTypes);
const { forEach } = require("lodash");
const userModel = require("../models/mvc_User");//import user.js model file
const userImageModel = require("../models/mvc_UserImage")
const { resolve } = require("path");
var path = require('path');
var baseDir = global.__basedir;


let utils = {


  //  getActiveEmails:function(id,curEmail){
  checkEmailValid: async function (curEmail) {
    var isValid = true;
    return new Promise(async (resolve, reject) => {
      if (!curEmail) {
        isValid = false;
        resolve(isValid);
      } else {
        //  userModel.getAllEmailAddress(id,function(error,result){
        try {

          const result = await userModel.getActiveEmails();
          if (result.length == 0) resolve(isValid);;
          for (var email of result) {
            if (email.primaryEmail == curEmail) {
              isValid = false;
              break;
            }
          }
          resolve(isValid);
        } catch (error) {
          reject(error);
        }

      }



    });
  },
  //  getActiveEmails:function(id,curEmail){
  checkPasswordValid: function (curPass) {
    var isValid = true;
    return new Promise(async (resolve, reject) => {
      if (!curPass) {
        isValid = false;
        resolve(isValid);
      } else {
        //  userModel.getAllEmailAddress(id,function(error,result){

        try {
          const user = await userModel.getActivePassword();
          if (user.length == 0) resolve(isValid);;
          for (let index = 0; index < user.length; index++) {
            if (user[index].password == curPass) {
              isValid = false;
              break;
            }


          }
          resolve(isValid);
        } catch (error) {
          reject(error);
        }
        // userModel.getActivePassword(function(error,users){
        //   if(error){
        //     reject(error);
        //   }else{

        //       for ( var user of users ) {
        //         if (user.password == curPass) {
        //         isValid = false;
        //           break;
        //         }
        //     }
        //     resolve(isValid);

        // }
        // });
      }



    });
  },
  //upload uswr related files
  uplaodUserImage: async function (user, files) {
    try {
      // const { id } = user;
      const images = [];



      if (files.profilePhoto) {
        const profilePhoto = files.profilePhoto[0];
        // const profileImage = await userImage.create({
        //     filename: profilePhoto.filename,
        //     filepath: profilePhoto.path,
        //     type: 'profile',
        //     userId: user,
        // });
        // images.push(profileImage);
        const profileImage = await userImageModel.createByUserId(profilePhoto, "profilePhoto", user);


        //  const filePath = path.join(baseDir, 'uploads',profileImage.filename);

        images.push(profileImage);
      }

      if (files.coverPhoto) {
        const coverPhoto = files.coverPhoto[0];
        // const coverImage = await userImage.create({
        //     filename: coverPhoto.filename,
        //     filepath: coverPhoto.path,
        //     type: 'cover',
        //     userId: user,
        // });
        // images.push(coverImage);
        const coverImage = await userImageModel.createByUserId(coverPhoto, "coverPhoto", user);
        images.push(coverImage);
      }
      return images;
    } catch (error) {
      throw new Error('Image upload failed: ' + error.message);
    }


    // const user = await User.findByPk(id);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }


  },
  responseSender: async function (res, type, httpStatusCode, responseObj, message) {
    var response = { "status": httpStatusCode, "data": responseObj, "message": message };
    if (type == 'error') {
      response = { "status": httpStatusCode, "error": responseObj, "message": message };
    }
    return await res.status(httpStatusCode).send(response);
  },

  generateRandomPassword: async function () {
    const length = 8;
    const specialChars = '@*';

    const getRandomSpecialChar = () => specialChars[Math.floor(Math.random() * specialChars.length)];
    const getRandomChar = () => String.fromCharCode(Math.floor(Math.random() * 94) + 33);

    // Generate random characters ensuring no special characters at the front and back
    let password = '';
    while (password.length < length - 1) {
      const char = getRandomChar();
      if (!specialChars.includes(char) || password.length > 0) {
        password += char;
      }
    }

    // Add one special character in the middle of the password
    const middleIndex = Math.floor(Math.random() * (password.length - 2)) + 1;
    password = password.slice(0, middleIndex) + getRandomSpecialChar() + password.slice(middleIndex);

    return password;
  }
}


module.exports = utils;