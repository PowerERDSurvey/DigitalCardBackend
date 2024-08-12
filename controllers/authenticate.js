var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
const jwt = require('jsonwebtoken');
const express = require("express");
var router = express.Router();
const userImageModel = require('../models/mvc_UserImage.js');
const companyModel = require('../models/mvc_company.js');
const baseDir = global.__dirname;

const { sequelize, DataTypes } = require('../config/sequelize');
var User = require('../models/user')(sequelize, DataTypes);

const { insertToUsertToken, listUserTokens, getLatestUserToken, deleteExpiredTokens } = require("../config/usertoken.js");

module.exports.authenticate = async function (req, res) {
  var userame = req.body.username;
  var password = req.body.password;

  await User.findAll({
    where: {
      userName: userame
      // userName: {
      //   [Sequelize.Op.eq]: sequelize.where(sequelize.col('userName'), '=', userame)
      //   // [Sequelize.Op.eq]: sequelize.where(sequelize.col('userName'), '=', userame)
      // }
    },
    // collation: 'utf8_bin'

  }).then(async (results) => {
    if (results.length > 0) {
      var checkCasesen = userame.toLowerCase() == results[0].userName.toLowerCase();
      if (checkCasesen) {
        decryptedString = cryptr.decrypt(results[0].password);

        if (password == decryptedString) {
          const user = results[0];
          if (user.isActive) {
            if (user.companyId) {
              const companyDetail = await companyModel.getActiveCompanyById(user.companyId);
              if (companyDetail?.isActive == false) return res.json({ message: "your company is InActive state" });
            }
            // if ( user.IS_EMAIL_VERIFIED ) {
            user.authenticated = true;
            const token = jwt.sign(
              { user: user },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' });
            // listUserTokens(user.ID);
            // latestUserToken = getLatestUserToken(user.ID);
            await deleteExpiredTokens(user.id);
            await insertToUsertToken(user.id, token).then(async (usertoken) => {
              // var images=[];

              const userImages = await userImageModel.getAllUserImageByUserId(user.id);
              // userImages.forEach(element => {
              //   element.filepath = path.join(baseDir, element.filepath);
              //   // element.filepath = path.join(baseDir, 'uploads',profileImage.filename);
              //   images.push(element);
              // });

              // //console.log("insert usertoken",usertoken);
              responsedata = {
                "id": user.id,
                "firstName": user.firstName,
                "userName": user.userName,
                "lastName": user.lastName,
                "primaryEmail": user.primaryEmail,
                // "secondaryEmail": user.secondaryEmail,
                "mobileNumber": user.mobileNumber,
                "companyName": user.companyName,
                "designation": user.designation,
                "whatsapp": user.whatsapp,
                "facebook": user.facebook,
                "instagram": user.instagram,
                "linkedin": user.linkedin,
                "youtube": user.youtube,
                "website": user.website,
                "city": user.city,
                "zipCode": user.zipCode,
                "country": user.country,
                "state": user.state,
                "Address": user.Address,
                "aboutMe": user.aboutMe,
                "type": user.signupType,
                "images": userImages,
                "randomKey": user.randomKey,
                "role": user.role,
                "companyId": user.companyId,
                "usercreatedCount": user.usercreatedCount,
                "userAllocatedCount": user.userAllocatedCount,
                "createdcardcount": user.createdcardcount,
                "cardAllocationCount": user.cardAllocationCount,
                "isUserCardAllocated": user.isUserCardAllocated,
              }
              return res.json({ "status": 200, "token": token, "data": responsedata });
            }).catch((err) => {
              //console.log("insert error usertoken", err);
            });
            // } 
            // else {
            //   return res.json({
            //     status:false,
            //     status:402,
            //     message:"Email not verified. Please complete Email Verification process"
            //   });
            // }
          }
          else {
            if (!user.isEmailVerified) {
              return res.json({ message: "An email send to your account please verify" })
            }

            return res.json({
              status: false,
              status: 400,
              message: "Error found in Login please contact admin"
            })
          }


        } else {
          return res.json({
            status: false,
            status: 401,
            message: "userName and password does not match"
          });
        }
      } else {
        return res.json({
          status: false,
          status: 401,
          message: "userName does not match"
        });
      }


    }
    else {
      return res.json({
        status: false,
        status: 404,
        message: "User does not exist."
      });
    }
  }).catch((err) => {
    return res.json({
      status: false,
      status: 500,
      error: err,
      message: 'there are some error with query'
    })
  })

}
