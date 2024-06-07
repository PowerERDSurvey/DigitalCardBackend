var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
const jwt = require('jsonwebtoken');
const express = require("express");
var router = express.Router();

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(global.gConfig.database, global.gConfig.username, global.gConfig.password, {
	host: global.gConfig.host,
	dialect: global.gConfig.dialect /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
var User = require('../models/user')(sequelize, DataTypes);

const {insertToUsertToken, listUserTokens, getLatestUserToken, deleteExpiredTokens} = require("../config/usertoken.js");

module.exports.authenticate=async function(req,res){
    var userame=req.body.username;
    var password=req.body.password;
    
     User.findAll({
      where: {
        userName: userame
        // userName: {
        //   [Sequelize.Op.eq]: sequelize.where(sequelize.col('userName'), '=', userame)
        //   // [Sequelize.Op.eq]: sequelize.where(sequelize.col('userName'), '=', userame)
        // }
      },
      // collation: 'utf8_bin'
      
    }).then((results)=>{
       if(results.length >0){
        var checkCasesen =userame === results[0].userName;
        if (checkCasesen) {
          decryptedString = cryptr.decrypt(results[0].password);

            if(password==decryptedString){
              const user = results[0];
                if(user.isActive){
                  // if ( user.IS_EMAIL_VERIFIED ) {
                    user.authenticated = true;
                    const token = jwt.sign(
                      { user: user},
                      'RANDOM_TOKEN_SECRET',
                      { expiresIn: '24h' });
                    // listUserTokens(user.ID);
                    // latestUserToken = getLatestUserToken(user.ID);
                    deleteExpiredTokens(user.id);
                    insertToUsertToken(user.id, token).then((usertoken) => {
                      // console.log("insert usertoken",usertoken);
                      responsedata={"id":user.id,
                      "firstName":user.firstName,
                      "userName": user.userName,
                      "lastName":user.lastName,
                      "primaryEmail": user.primaryEmail,
                      "SecondryEmail": user.SecondryEmail,
                      "mobileNumber": user.mobileNumber,
                      "companyName":user.companyName,
                      "designation":user.designation,
                      "whatsapp":user.whatsapp,
                      "facebook":user.facebook,
                      "instagram":user.instagram,
                      "linkedin":user.linkedin,
                      "website":user.website,
                      "city":user.city,
                      "zipCode":user.zipCode,
                      "country":user.country,
                      "state":user.state,
                      "Address": user.Address,
                      "type": user.signupType,
                    }
                      res.json({"status":200,"token" : token,"data":responsedata});
                    }).catch((err)=>{
                      console.log("insert error usertoken",err);
                    });
                  // } 
                  // else {
                  //   res.json({
                  //     status:false,
                  //     status:402,
                  //     message:"Email not verified. Please complete Email Verification process"
                  //   });
                  // }
                }
                else {
                  res.json({
                    status:false,
                    status:400,
                    message:"User is disabled"
                  })
                }
              
              
            }else{
                res.json({
                  status:false,
                  status:401,
                  message:"userName and password does not match"
                 });
            }
        } else {
          res.json({
            status:false,
            status:401,
            message:"userName does not match"
           });
        }
            
          
        }
        else{
          res.json({
              status:false,  
              status:404,  
            message:"User does not exist."
          });
        }
    }).catch((err)=>{
      res.json({
        status:false,
        status:500,
        error:err,
        message:'there are some error with query'
        })
    })

}
