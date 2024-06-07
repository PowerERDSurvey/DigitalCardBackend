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
   }
}
 

module.exports = utils;