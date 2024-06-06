const userModel = require("../models/mvc_User");//import user.js model file
const { resolve } = require("path");


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
                  if (email.email == curEmail) {
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
   uplaodUserImage: async function(user,file){
    try {
      const { id } = user;
      const files = file;
      const images = [];

      if (files.profilePhoto) {
        const profilePhoto = files.profilePhoto[0];
        const profileImage = await userImage.create({
          filename: profilePhoto.filename,
          filepath: profilePhoto.path,
          type: 'profile',
          userId: id,
        });
        images.push(profileImage);
      }
  
      if (files.coverPhoto) {
        const coverPhoto = files.coverPhoto[0];
        const coverImage = await userImage.create({
          filename: coverPhoto.filename,
          filepath: coverPhoto.path,
          type: 'cover',
          userId: id,
        });
        images.push(coverImage);
      }
      return images;
    } catch (error) {
      return error;
    }
    

    // const user = await User.findByPk(id);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    
   }
}
 

module.exports = utils;