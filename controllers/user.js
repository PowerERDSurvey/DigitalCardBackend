const express = require("express");

const jwt = require('jsonwebtoken');
var router = express.Router();
const userModel = require("../models/mvc_User");
const userImageModel =require('../models/mvc_UserImage.js')
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
const helperUtil = require('../util/helper.js');
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();


const sendVerificationEmail = require('../util/emailSender.js');
const upload = require('../middleware/upload.js');

const { insertToUsertToken, listUserTokens, getLatestUserToken, deleteExpiredTokens } = require("../config/usertoken.js");
const { JSON } = require("sequelize");
const { json } = require("body-parser");



// create new user API 
router.post("/user", function (req, res) {

    const user = req.user;
    console.log("user" + req.FIRST_NAME);

    var moment = require('moment');
    var currentTime = moment().utc().valueOf();
    var requestBody = req.body;
    var encryptedString = '';
    // if (requestBody.password) {
    encryptedString = cryptr.encrypt(requestBody.password);
    // }

    requestBody.PASSWORD = encryptedString;
    console.log(requestBody);
    var response;
    var responseObj;
    helperUtil.checkEmailValid(requestBody.email).then(async (isEmailValid) => {//will return email id is valid or invalid
        // const userImages =await userImageModel.getAllUserImageByUserId(user.id);
        if (!isEmailValid) {
            if (requestBody.type == 'GOOGLE_SSO') {
                userModel.getActiveEmails(function (error, result) {
                    if (error) {
                        message = "Error on getting Active Emails";
                        httpStatusCode = 500;
                        response = { "status": httpStatusCode, "message": message };
                        return res.status(httpStatusCode).send(response);

                    } else {

                        for (var email of result) {
                            if (email.primaryEmail == requestBody.email) {
                                if (email.isActive) {

                                    // if ( email.IS_EMAIL_VERIFIED ) {
                                    email.authenticated = true;
                                    const token = jwt.sign(
                                        { email: email },
                                        'RANDOM_TOKEN_SECRET',
                                        { expiresIn: '24h' });
                                    // listUserTokens(email.ID);
                                    // latestUserToken = getLatestUserToken(email.ID);
                                    deleteExpiredTokens(email.id);
                                    insertToUsertToken(email.id, token).then(async (usertoken) => {
                                        // console.log("insert usertoken",usertoken);
                                        const userImages =await userImageModel.getAllUserImageByUserId(email.id);
                                        var responsedata = {
                                            "id": email.id,
                                            "firstName": email.firstName,
                                            "lastName": email.lastName,
                                            "primaryEmail": email.primaryEmail,
                                            "secondaryEmail": email.secondaryEmail,
                                            "mobileNumber": email.mobileNumber,
                                            "companyName": email.companyName,
                                            "designation": email.designation,
                                            "whatsapp": email.whatsapp,
                                            "facebook": email.facebook,
                                            "instagram": email.instagram,
                                            "linkedin": email.linkedin,
                                            "website": email.website,
                                            "city": email.city,
                                            "zipCode": email.zipCode,
                                            "country": email.country,
                                            "state": email.state,
                                            "Address": email.Address,
                                            "type": email.signupType,
                                            "images":userImages,
                                        }
                                        return res.json({ "status": 200, "token": token, "data": responsedata });
                                    }).catch((err) => {
                                        console.log("insert error usertoken", err);
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
                                        status: false,
                                        status: 400,
                                        message: "User is disabled"
                                    })
                                }
                                break;
                            }
                        }


                    }
                });


            }
            else {
                message = "Email Address already exist .";
                httpStatusCode = 400;
                responseObj = { "errorCode": 400 };
                response = { "status": httpStatusCode, "error": responseObj, "message": message };
                return res.status(httpStatusCode).send(response);
            }

        } else if (requestBody.type) {
            if (requestBody.type == 'GOOGLE_SSO') {
                var inputObj = {
                    firstName: requestBody.username,
                    password: requestBody.PASSWORD,
                    primaryEmail: requestBody.email,
                    signupType: requestBody.type,
                    isActive: true
                }

                userModel.create(inputObj, function (err, result) {
                    var httpStatusCode = 0;
                    var responseObj = "";
                    var message = "User created successfully.";
                    if (err) {
                        message = "User creation Failed.";
                        httpStatusCode = 500;
                        responseObj = err;
                        response = { "status": httpStatusCode, "error": responseObj, "message": message };
                        return res.status(httpStatusCode).send(response);
                    } else {
                        if (result.isActive) {
                            // if ( result.IS_EMAIL_VERIFIED ) {
                            result.authenticated = true;
                            const token = jwt.sign(
                                { user: result },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' });
                            // listUserTokens(result.ID);
                            // latestUserToken = getLatestUserToken(result.ID);
                            deleteExpiredTokens(result.id);
                            insertToUsertToken(result.id, token).then(async (usertoken) => {
                                // console.log("insert usertoken",usertoken);
                                const userImages =await userImageModel.getAllUserImageByUserId(result.id);
                                var responsedata = {
                                    "id": result.id,
                                    "firstName": result.firstName,
                                    "lastName": result.lastName,
                                    "primaryEmail": result.primaryEmail,
                                    "secondaryEmail": result.secondaryEmail,
                                    "mobileNumber": result.mobileNumber,
                                    "companyName": result.companyName,
                                    "designation": result.designation,
                                    "whatsapp": result.whatsapp,
                                    "facebook": result.facebook,
                                    "instagram": result.instagram,
                                    "linkedin": result.linkedin,
                                    "website": result.website,
                                    "city": result.city,
                                    "zipCode": result.zipCode,
                                    "country": result.country,
                                    "state": result.state,
                                    "Address": result.Address,
                                    "type": result.signupType,
                                    "images":userImages,
                                }
                                return res.json({ "status": 200, "token": token, "data": responsedata });
                            }).catch((err) => {
                                console.log("insert error usertoken", err);
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
                            return res.json({
                                status: false,
                                status: 400,
                                message: "User is disabled"
                            })
                        }
                    }
                })
            } else {
                helperUtil.checkPasswordValid(requestBody.PASSWORD).then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        message = "Password Address already exist Or password Empty.";
                        httpStatusCode = 400;
                        responseObj = { "errorCode": 400 };
                        response = { "status": httpStatusCode, "error": responseObj, "message": message };
                        return res.status(httpStatusCode).send(response);
                    }
                    else {
                        var primemail =requestBody.email;
                        const token = jwt.sign(
                            { primemail},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '2h' });

                        var inputObj = {
                            userName: requestBody.username,
                            password: requestBody.PASSWORD,
                            primaryEmail: requestBody.email,
                            signupType: requestBody.type,
                            verificationCode : token,
                            verificationExpires : Date.now() + 7200000,
                            // isActive: true
                        }
                        userModel.create(inputObj, async function (err, result) {
                            var httpStatusCode = 0;
                            var responseObj = "";
                            var message = `User created successfully. verification link send to ${primemail} `;
                            if (err) {
                                message = "User creation Failed.";
                                httpStatusCode = 500;
                                responseObj = err;
                                response = { "status": httpStatusCode, "error": responseObj, "message": message };
                            } else {
                                httpStatusCode = 200;
                                responseObj = { ID: result.dataValues.id };
                                try {
                                    const emailsend = await sendVerificationEmail(result.dataValues.id,primemail, token);
                                if(!emailsend) return res.status(400).statusMessage('verification email send failed');

                                response = { "status": httpStatusCode, "data": responseObj, "message": message };
                                } catch (error) {
                                    response = { "status": 400, "data": error, "message": error.message };
                                    return res.status(400).send(response);
                                }
                                
                            }
                            return res.status(httpStatusCode).send(response);
                        })
                    }
                }).catch((err) => {
                    message = "Password retrieved Failed.";
                    httpStatusCode = 500;
                    responseObj = err;
                    response = { "status": httpStatusCode, "error": responseObj, "message": message };
                    return res.status(httpStatusCode).send(response);
                })
            }


        }
        else {
            message = "signup type missing.";
            httpStatusCode = 400;
            responseObj = { "errorCode": 400 };
            response = { "status": httpStatusCode, "error": responseObj, "message": message };
            return res.status(httpStatusCode).send(response);


        }
    }).catch((err) => {
        message = "Email Addresses retrieved Failed.";
        httpStatusCode = 500;
        responseObj = err;
        response = { "status": httpStatusCode, "error": responseObj, "message": message };
        return res.status(httpStatusCode).send(response);
    });
});

router.get('/user/:id/verify/:token',async function (req,res){
    try {
        let userActivateTocken = await userModel.getUsertokenById(req.params.id,req.params.token);
        if (!userActivateTocken) return res.status(400).send({message:'invalid link/ user already verified'});
        var requestBody = {
            isActive : true,
            verificationCode: 'verified',

        }
        userModel.update(userActivateTocken.id, requestBody, async function (err, result) {
            if (err) return res.status(500).send({error:err,message:'Email verification faild'});
            return res.status(200).send({message:'Email Verified successfully'});
        });
        
    } catch (error) {
        return res.status(500).send({message:'Email Verified successfully','error':error});
    }
});

// update user detail
// router.put("/user/:ID",auth,bodyParser,upload.fields([
//     { name: 'profilePhoto', maxCount: 1 },
//     { name: 'coverPhoto', maxCount: 1 }
//   ]), function (req, res) {

   

//     var UserId = req.params.ID;
//     var requestBody =  req.body;
//     console.log(req.body);
//     var response;
//     userModel.update(UserId, requestBody, async function (err, result) {
//         var httpStatusCode = 0;
//         var responseObj = "";
//         var message = "User updates successfully.";
//         if (err) {
//             message = "User updation Failed.";
//             httpStatusCode = 500;
//             responseObj = err;
//             response = { "status": httpStatusCode, "error": responseObj, "message": message };
//         } else {
           
//             if (req.files) {
//                 // const imageUpload = helperUtil.
//                 try {
//                     const images = await helperUtil.uplaodUserImage(UserId, req.files);
//                     if (images) {
//                         httpStatusCode = 200;
//                         responseObj = result.dataValues;
//                         responseObj.images = images;
//                         response = { "status": httpStatusCode, "data": responseObj, "message": message };
//                     } else {
//                         httpStatusCode = 400;
//                         response = { "status": httpStatusCode, "message": "Image upload failed" };
//                     }
//                     return res.status(httpStatusCode).json(response);
//                 } catch (error) {
//                     return res.status(400).json({ error: error.message });
//                 }
//             } else {
//                 httpStatusCode = 200;
//                 responseObj = result.dataValues;
//                 response = { "status": httpStatusCode, "data": responseObj, "message": message };
//             }
            
            
//         }
//         return res.status(httpStatusCode).send(response);
//     });
// });

router.post("/user/:ID", auth, bodyParser, function (req, res) {
    var UserId = req.params.ID;
    var response;
    userModel.getOneUser(UserId, function (err, result) {
        var httpStatusCode = 0;
        var responseObj = "";
        var message = "User get successfully.";
        if (err) {
            message = "User get Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = { "status": httpStatusCode, "error": responseObj, "message": message };
        } else {
            httpStatusCode = 200;
            responseObj = {
                "id": result.id,
                "firstName": result.firstName,
                "userName": result.userName,
                "lastName": result.lastName,
                "primaryEmail": result.primaryEmail,
                "secondaryEmail": result.secondaryEmail,
                "mobileNumber": result.mobileNumber,
                "companyName": result.companyName,
                "designation": result.designation,
                "whatsapp": result.whatsapp,
                "facebook": result.facebook,
                "instagram": result.instagram,
                "linkedin": result.linkedin,
                "website": result.website,
                "city": result.city,
                "zipCode": result.zipCode,
                "country": result.country,
                "state": result.state,
                "type": result.signupType,
                
            };
            response = { "status": httpStatusCode, "data": responseObj, "message": message };
        }
        res.status(httpStatusCode).send(response);
    });
    getOneUser
});

module.exports = router;