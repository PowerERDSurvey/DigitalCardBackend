// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
// 	host: global.gConfig.host,
// 	dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });
// const userImage = require('../models/userimage.js')(sequelize, DataTypes);
const { forEach } = require("lodash");
const userModel = require("../models/mvc_User");//import user.js model file
const userImageModel =require("../models/mvc_UserImage")
const { resolve } = require("path");
var path = require('path');
var baseDir=global.__basedir;


let utils = {


//  getActiveEmails:function(id,curEmail){
 checkEmailValid:function(curEmail){
  var isValid = true;
  return new Promise((resolve, reject)=>{
      if (!curEmail) {
        isValid = false;
        resolve(isValid);
      }else{
        //  userModel.getAllEmailAddress(id,function(error,result){
          userModel.getActiveEmails(function(error,result){
            if(error){
              reject(error);
            }else{
              
                for ( var email of result ) {
                  if (email.primaryEmail == curEmail) {
                  isValid = false;
                    break;
                  }
              }
              resolve(isValid);
            
          }
          });
      }
   
   
  
 });
 },
 //  getActiveEmails:function(id,curEmail){
  checkPasswordValid:function(curPass){
    var isValid = true;
    return new Promise((resolve, reject)=>{
        if (!curPass) {
          isValid = false;
          resolve(isValid);
        }else{
          //  userModel.getAllEmailAddress(id,function(error,result){
            userModel.getActivePassword(function(error,users){
              if(error){
                reject(error);
              }else{
                
                  for ( var user of users ) {
                    if (user.password == curPass) {
                    isValid = false;
                      break;
                    }
                }
                resolve(isValid);
              
            }
            });
        }
     
     
   
   });
   },
//upload uswr related files
   uplaodUserImage: async function(user,files){
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
         const profileImage =await userImageModel.createByUserId(profilePhoto,"profilePhoto",user);
         
         
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
          const coverImage =await userImageModel.createByUserId(coverPhoto,"coverPhoto",user);
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

    
   }
}
 

module.exports = utils;