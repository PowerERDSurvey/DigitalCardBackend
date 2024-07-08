const express = require("express");

const jwt = require('jsonwebtoken');
var router = express.Router();
const userModel = require("../models/mvc_User");
const userImageModel = require('../models/mvc_UserImage.js')
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


router.post("/user", async function (req, res) {
    const user = req.user;
    const requestBody = req.body;
    let encryptedPassword = cryptr.encrypt(requestBody.password);
    requestBody.PASSWORD = encryptedPassword;
    console.log(requestBody);

    try {
        await handleUserCreation(req, res, requestBody, user);
    } catch (error) {
        return await sendErrorResponse(res, 500, error, 'User creation failed.');
    }
});

async function handleUserCreation(req, res, requestBody, user) {
    const isEmailValid = await helperUtil.checkEmailValid(requestBody.email);

    if (!isEmailValid && requestBody.type !== 'GOOGLE_SSO') {
        return await sendErrorResponse(res, 400, {}, 'Email Address already exists.');
    }

    if (requestBody.type === 'GOOGLE_SSO') {
        return await handleGoogleSSOUser(req, res, requestBody, user);
    } else {
        return await handleStandardUser(req, res, requestBody, user, isEmailValid);
    }
}

async function handleGoogleSSOUser(req, res, requestBody, user) {
    const inputObj = createUserInputObject(requestBody);

    const result = await userModel.create(inputObj);
    if (!result.isActive) {
        return await sendErrorResponse(res, 400, {}, 'User is disabled');
    }

    const token = generateToken(result);
    await deleteExpiredTokens(result.id);
    await insertTokenAndRespond(res, result.id, token, user, result);
}

async function handleStandardUser(req, res, requestBody, user, isEmailValid) {
    if (!isEmailValid) {
        return await handleExistingEmail(req, res, requestBody, user);
    }

    const isPasswordValid = await helperUtil.checkPasswordValid(requestBody.PASSWORD);
    if (!isPasswordValid) {
        return await sendErrorResponse(res, 400, {}, 'Password is invalid or empty.');
    }

    const token = generateToken({ email: requestBody.email });
    const inputObj = createUserInputObject(requestBody, token);
    const result = await userModel.create(inputObj);

    if (!result) {
        return await sendErrorResponse(res, 400, {}, 'User created but no values to show.');
    }

    const responseObj = { ID: result.dataValues.id };
    const emailSent = await sendVerificationEmail(result.dataValues.id, requestBody.email, token);

    if (!emailSent) {
        return await sendErrorResponse(res, 400, responseObj, 'Verification email sending failed.');
    }

    return await sendSuccessResponse(res, responseObj, 'User created successfully');
}

async function handleExistingEmail(req, res, requestBody, user) {
    const result = await userModel.getActiveEmails();
    if (result.length === 0) {
        return await sendErrorResponse(res, 400, {}, 'No active emails found.');
    }

    for (const email of result) {
        if (email.primaryEmail === requestBody.email) {
            if (email.isActive) {
                const token = generateToken({ email: email });
                await deleteExpiredTokens(email.id);
                return await insertTokenAndRespond(res, email.id, token, user, email);
            } else {
                return res.json({ status: false, status: 400, message: 'User is disabled' });
            }
        }
    }
}

function createUserInputObject(requestBody, token = null) {
    return {
        firstName: requestBody.username,
        password: requestBody.PASSWORD,
        primaryEmail: requestBody.email,
        signupType: requestBody.type,
        isActive: true,
        role: requestBody.role,
        companyId: requestBody.companyId,
        verificationCode: token,
        randomKey: requestBody.randomKey,
        verificationExpires: Date.now() + 7200000
    };
}

function generateToken(payload) {
    return jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
}

async function deleteExpiredTokens(userId) {
    // Implement token deletion logic
}

async function insertTokenAndRespond(res, userId, token, user, email) {
    try {
        await insertToUsertToken(userId, token);
        const userImages = await userImageModel.getAllUserImageByUserId(userId);
        const responseData = createResponseData(email, user, userImages, token);
        return res.json({ status: 200, token: token, data: responseData });
    } catch (err) {
        console.log('Insert error user token', err);
    }
}

function createResponseData(email, user, userImages, token) {
    return {
        id: email.id,
        firstName: email.firstName,
        lastName: email.lastName,
        primaryEmail: email.primaryEmail,
        secondaryEmail: email.secondaryEmail,
        mobileNumber: email.mobileNumber,
        companyName: email.companyName,
        designation: email.designation,
        aboutMe: email.aboutMe,
        whatsapp: email.whatsapp,
        facebook: email.facebook,
        instagram: email.instagram,
        linkedin: email.linkedin,
        youtube: email.youtube,
        website: email.website,
        city: email.city,
        zipCode: email.zipCode,
        country: email.country,
        state: email.state,
        Address: email.Address,
        type: email.signupType,
        images: userImages,
        randomKey: user.randomKey,
        role: user.role,
        companyId: user.companyId,
        authenticated: true,
    };
}

async function sendErrorResponse(res, statusCode, responseObj, message) {
    return await helperUtil.responseSender(res, 'error', statusCode, responseObj, message);
}

async function sendSuccessResponse(res, responseObj, message) {
    return await helperUtil.responseSender(res, 'data', 200, responseObj, message);
}


// router.post("/user", async function (req, res) {

//     const user = req.user;
//     var requestBody = req.body;
//     var encryptedString = '';
//     encryptedString = cryptr.encrypt(requestBody.password);

//     requestBody.PASSWORD = encryptedString;
//     console.log(requestBody);

//     var message = "";
//     var httpStatusCode = 500;
//     var responseObj = {};
//     // if (!UserId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
//     try {


//         const isEmailValid = await helperUtil.checkEmailValid(requestBody.email);

//         if (!isEmailValid) {
//             if (requestBody.type != 'GOOGLE_SSO') return await helperUtil.responseSender(res, 'error', 400, responseObj, `Email Address already exist .`);

//             const result = await userModel.getActiveEmails();
//             if (result.length == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Not have active emails`);
//             for (var email of result) {
//                 if (email.primaryEmail == requestBody.email) {
//                     if (email.isActive) {
//                         email.authenticated = true;
//                         const token = jwt.sign(
//                             { email: email },
//                             'RANDOM_TOKEN_SECRET',
//                             { expiresIn: '24h' });
//                         deleteExpiredTokens(email.id);
//                         insertToUsertToken(email.id, token).then(async (usertoken) => {
//                             const userImages = await userImageModel.getAllUserImageByUserId(email.id);
//                             var responsedata = {
//                                 "id": email.id,
//                                 "firstName": email.firstName,
//                                 "lastName": email.lastName,
//                                 "primaryEmail": email.primaryEmail,
//                                 "secondaryEmail": email.secondaryEmail,
//                                 "mobileNumber": email.mobileNumber,
//                                 "companyName": email.companyName,
//                                 "designation": email.designation,
//                                 "aboutMe": email.aboutMe,
//                                 "whatsapp": email.whatsapp,
//                                 "facebook": email.facebook,
//                                 "instagram": email.instagram,
//                                 "linkedin": email.linkedin,
//                                 "youtube": email.youtube,
//                                 "website": email.website,
//                                 "city": email.city,
//                                 "zipCode": email.zipCode,
//                                 "country": email.country,
//                                 "state": email.state,
//                                 "Address": email.Address,
//                                 "type": email.signupType,
//                                 "images": userImages,
//                                 "randomKey": user.randomKey,
//                                 "role": user.role,
//                                 "companyId": user.companyId
//                             }
//                             return res.json({ "status": 200, "token": token, "data": responsedata });
//                         }).catch((err) => {
//                             console.log("insert error usertoken", err);
//                         });
//                     }
//                     else {
//                         return res.json({
//                             status: false,
//                             status: 400,
//                             message: "User is disabled"
//                         })
//                     }
//                     break;
//                 }
//             }

//         }
//         else if (requestBody.type) {
//             if (requestBody.type == 'GOOGLE_SSO') {
//                 var inputObj = {
//                     firstName: requestBody.username,
//                     password: requestBody.PASSWORD,
//                     primaryEmail: requestBody.email,
//                     signupType: requestBody.type,
//                     isActive: true,
//                     role: requestBody.role,
//                     companyId: requestBody.companyId
//                 }

//                 const result = userModel.create(inputObj);

//                 if (!result.isActive) return await helperUtil.responseSender(res, 'error', 400, responseObj, "User is disabled");


//                 result.authenticated = true;
//                 const token = jwt.sign(
//                     { user: result },
//                     'RANDOM_TOKEN_SECRET',
//                     { expiresIn: '24h' });
//                 deleteExpiredTokens(result.id);
//                 insertToUsertToken(result.id, token).then(async (usertoken) => {
//                     const userImages = await userImageModel.getAllUserImageByUserId(result.id);
//                     var responsedata = {
//                         "id": result.id,
//                         "firstName": result.firstName,
//                         "lastName": result.lastName,
//                         "primaryEmail": result.primaryEmail,
//                         "secondaryEmail": result.secondaryEmail,
//                         "mobileNumber": result.mobileNumber,
//                         "companyName": result.companyName,
//                         "designation": result.designation,
//                         "aboutMe": result.aboutMe,
//                         "whatsapp": result.whatsapp,
//                         "facebook": result.facebook,
//                         "instagram": result.instagram,
//                         "linkedin": result.linkedin,
//                         "youtube": result.youtube,
//                         "website": result.website,
//                         "city": result.city,
//                         "zipCode": result.zipCode,
//                         "country": result.country,
//                         "state": result.state,
//                         "Address": result.Address,
//                         "type": result.signupType,
//                         "images": userImages,
//                         "randomKey": user.randomKey,
//                         "role": user.role,
//                         "companyId": user.companyId
//                     }
//                     return res.json({ "status": 200, "token": token, "data": responsedata });
//                 }).catch((err) => {
//                     console.log("insert error usertoken", err);
//                 });





//             }
//             else {

//                 const isPasswordValid = await helperUtil.checkPasswordValid(requestBody.PASSWORD);
//                 if (!isPasswordValid) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Password Address already exist Or password Empty.`);

//                 var primemail = requestBody.email;
//                 const token = jwt.sign(
//                     { primemail },
//                     'RANDOM_TOKEN_SECRET',
//                     { expiresIn: '2h' });

//                 var inputObj = {
//                     userName: requestBody.username,
//                     password: requestBody.PASSWORD,
//                     primaryEmail: requestBody.email,
//                     signupType: requestBody.type,
//                     verificationCode: token,
//                     randomKey: requestBody.randomKey,
//                     verificationExpires: Date.now() + 7200000,
//                     role: requestBody.role,
//                     companyId: requestBody.companyId
//                     // isActive: true
//                 }

//                 const result = await userModel.create(inputObj);
//                 if (!result) return await helperUtil.responseSender(res, 'error', 400, responseObj, `User created but dont have values to show`);


//                 responseObj = { ID: result.dataValues.id };
//                 const emailsend = await sendVerificationEmail(result.dataValues.id, primemail, token);
//                 if (!emailsend) return await helperUtil.responseSender(res, 'error', 400, responseObj, `verification send faild`);

//                 // response = { "status": httpStatusCode, "data": responseObj, "message": message };
//                 return await helperUtil.responseSender(res, 'data', 200, responseObj, `user created successfully`);


//             }
//         }
//         else {
//             return await helperUtil.responseSender(res, 'error', 400, responseObj, "signup type missing.");
//         }

//     } catch (error) {
//         message = `user creation failed.`;
//         responseObj = error;
//         return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
//     }



// });


// create new user API 
// router.post("/user", function (req, res) {

//     const user = req.user;
//     console.log("user" + req.FIRST_NAME);

//     var moment = require('moment');
//     var currentTime = moment().utc().valueOf();
//     var requestBody = req.body;
//     var encryptedString = '';
//     // if (requestBody.password) {
//     encryptedString = cryptr.encrypt(requestBody.password);
//     // }

//     requestBody.PASSWORD = encryptedString;
//     console.log(requestBody);
//     var response;
//     var responseObj;
//     helperUtil.checkEmailValid(requestBody.email).then(async (isEmailValid) => {//will return email id is valid or invalid
//         // const userImages =await userImageModel.getAllUserImageByUserId(user.id);
//         if (!isEmailValid) {
//             if (requestBody.type == 'GOOGLE_SSO') {
//                 userModel.getActiveEmails(function (error, result) {
//                     if (error) {
//                         message = "Error on getting Active Emails";
//                         httpStatusCode = 500;
//                         response = { "status": httpStatusCode, "message": message };
//                         return res.status(httpStatusCode).send(response);

//                     } else {

//                         for (var email of result) {
//                             if (email.primaryEmail == requestBody.email) {
//                                 if (email.isActive) {

//                                     // if ( email.IS_EMAIL_VERIFIED ) {
//                                     email.authenticated = true;
//                                     const token = jwt.sign(
//                                         { email: email },
//                                         'RANDOM_TOKEN_SECRET',
//                                         { expiresIn: '24h' });
//                                     // listUserTokens(email.ID);
//                                     // latestUserToken = getLatestUserToken(email.ID);
//                                     deleteExpiredTokens(email.id);
//                                     insertToUsertToken(email.id, token).then(async (usertoken) => {
//                                         // console.log("insert usertoken",usertoken);
//                                         const userImages = await userImageModel.getAllUserImageByUserId(email.id);
//                                         var responsedata = {
//                                             "id": email.id,
//                                             "firstName": email.firstName,
//                                             "lastName": email.lastName,
//                                             "primaryEmail": email.primaryEmail,
//                                             "secondaryEmail": email.secondaryEmail,
//                                             "mobileNumber": email.mobileNumber,
//                                             "companyName": email.companyName,
//                                             "designation": email.designation,
//                                             "aboutMe": email.aboutMe,
//                                             "whatsapp": email.whatsapp,
//                                             "facebook": email.facebook,
//                                             "instagram": email.instagram,
//                                             "linkedin": email.linkedin,
//                                             "youtube": email.youtube,
//                                             "website": email.website,
//                                             "city": email.city,
//                                             "zipCode": email.zipCode,
//                                             "country": email.country,
//                                             "state": email.state,
//                                             "Address": email.Address,
//                                             "type": email.signupType,
//                                             "images": userImages,
//                                             "randomKey": user.randomKey,
//                                             "role": user.role,
//                                             "companyId": user.companyId
//                                         }
//                                         return res.json({ "status": 200, "token": token, "data": responsedata });
//                                     }).catch((err) => {
//                                         console.log("insert error usertoken", err);
//                                     });
//                                     // } 
//                                     // else {
//                                     //   res.json({
//                                     //     status:false,
//                                     //     status:402,
//                                     //     message:"Email not verified. Please complete Email Verification process"
//                                     //   });
//                                     // }
//                                 }
//                                 else {
//                                     res.json({
//                                         status: false,
//                                         status: 400,
//                                         message: "User is disabled"
//                                     })
//                                 }
//                                 break;
//                             }
//                         }


//                     }
//                 });


//             }
//             else {
//                 message = "Email Address already exist .";
//                 httpStatusCode = 400;
//                 responseObj = { "errorCode": 400 };
//                 response = { "status": httpStatusCode, "error": responseObj, "message": message };
//                 return res.status(httpStatusCode).send(response);
//             }

//         } else if (requestBody.type) {
//             if (requestBody.type == 'GOOGLE_SSO') {
//                 var inputObj = {
//                     firstName: requestBody.username,
//                     password: requestBody.PASSWORD,
//                     primaryEmail: requestBody.email,
//                     signupType: requestBody.type,
//                     isActive: true,
//                     role: requestBody.role,
//                     companyId: requestBody.companyId
//                 }

//                 userModel.create(inputObj, function (err, result) {
//                     var httpStatusCode = 0;
//                     var responseObj = "";
//                     var message = "User created successfully.";
//                     if (err) {
//                         message = "User creation Failed.";
//                         httpStatusCode = 500;
//                         responseObj = err;
//                         response = { "status": httpStatusCode, "error": responseObj, "message": message };
//                         return res.status(httpStatusCode).send(response);
//                     } else {
//                         if (result.isActive) {
//                             // if ( result.IS_EMAIL_VERIFIED ) {
//                             result.authenticated = true;
//                             const token = jwt.sign(
//                                 { user: result },
//                                 'RANDOM_TOKEN_SECRET',
//                                 { expiresIn: '24h' });
//                             // listUserTokens(result.ID);
//                             // latestUserToken = getLatestUserToken(result.ID);
//                             deleteExpiredTokens(result.id);
//                             insertToUsertToken(result.id, token).then(async (usertoken) => {
//                                 // console.log("insert usertoken",usertoken);
//                                 const userImages = await userImageModel.getAllUserImageByUserId(result.id);
//                                 var responsedata = {
//                                     "id": result.id,
//                                     "firstName": result.firstName,
//                                     "lastName": result.lastName,
//                                     "primaryEmail": result.primaryEmail,
//                                     "secondaryEmail": result.secondaryEmail,
//                                     "mobileNumber": result.mobileNumber,
//                                     "companyName": result.companyName,
//                                     "designation": result.designation,
//                                     "aboutMe": result.aboutMe,
//                                     "whatsapp": result.whatsapp,
//                                     "facebook": result.facebook,
//                                     "instagram": result.instagram,
//                                     "linkedin": result.linkedin,
//                                     "youtube": result.youtube,
//                                     "website": result.website,
//                                     "city": result.city,
//                                     "zipCode": result.zipCode,
//                                     "country": result.country,
//                                     "state": result.state,
//                                     "Address": result.Address,
//                                     "type": result.signupType,
//                                     "images": userImages,
//                                     "randomKey": user.randomKey,
//                                     "role": user.role,
//                                     "companyId": user.companyId
//                                 }
//                                 return res.json({ "status": 200, "token": token, "data": responsedata });
//                             }).catch((err) => {
//                                 console.log("insert error usertoken", err);
//                             });
//                             // } 
//                             // else {
//                             //   res.json({
//                             //     status:false,
//                             //     status:402,
//                             //     message:"Email not verified. Please complete Email Verification process"
//                             //   });
//                             // }
//                         }
//                         else {
//                             return res.json({
//                                 status: false,
//                                 status: 400,
//                                 message: "User is disabled"
//                             })
//                         }
//                     }
//                 })
//             } else {
//                 helperUtil.checkPasswordValid(requestBody.PASSWORD).then((isPasswordValid) => {
//                     if (!isPasswordValid) {
//                         message = "Password Address already exist Or password Empty.";
//                         httpStatusCode = 400;
//                         responseObj = { "errorCode": 400 };
//                         response = { "status": httpStatusCode, "error": responseObj, "message": message };
//                         return res.status(httpStatusCode).send(response);
//                     }
//                     else {
//                         var primemail = requestBody.email;
//                         const token = jwt.sign(
//                             { primemail },
//                             'RANDOM_TOKEN_SECRET',
//                             { expiresIn: '2h' });

//                         var inputObj = {
//                             userName: requestBody.username,
//                             password: requestBody.PASSWORD,
//                             primaryEmail: requestBody.email,
//                             signupType: requestBody.type,
//                             verificationCode: token,
//                             randomKey: requestBody.randomKey,
//                             verificationExpires: Date.now() + 7200000,
//                             role: requestBody.role,
//                             companyId: requestBody.companyId
//                             // isActive: true
//                         }
//                         userModel.create(inputObj, async function (err, result) {
//                             var httpStatusCode = 0;
//                             var responseObj = "";
//                             var message = `User created successfully. verification link send to ${primemail} `;
//                             if (err) {
//                                 message = "User creation Failed.";
//                                 httpStatusCode = 500;
//                                 responseObj = err;
//                                 response = { "status": httpStatusCode, "error": responseObj, "message": message };
//                             } else {
//                                 httpStatusCode = 200;
//                                 responseObj = { ID: result.dataValues.id };
//                                 try {
//                                     const emailsend = await sendVerificationEmail(result.dataValues.id, primemail, token);
//                                     if (!emailsend) return res.status(400).statusMessage('verification email send failed');

//                                     response = { "status": httpStatusCode, "data": responseObj, "message": message };
//                                 } catch (error) {
//                                     response = { "status": 400, "data": error, "message": error.message };
//                                     return res.status(400).send(response);
//                                 }

//                             }
//                             return res.status(httpStatusCode).send(response);
//                         })
//                     }
//                 }).catch((err) => {
//                     message = "Password retrieved Failed.";
//                     httpStatusCode = 500;
//                     responseObj = err;
//                     response = { "status": httpStatusCode, "error": responseObj, "message": message };
//                     return res.status(httpStatusCode).send(response);
//                 })
//             }


//         }
//         else {
//             message = "signup type missing.";
//             httpStatusCode = 400;
//             responseObj = { "errorCode": 400 };
//             response = { "status": httpStatusCode, "error": responseObj, "message": message };
//             return res.status(httpStatusCode).send(response);


//         }
//     }).catch((err) => {
//         message = "Email Addresses retrieved Failed.";
//         httpStatusCode = 500;
//         responseObj = err;
//         response = { "status": httpStatusCode, "error": responseObj, "message": message };
//         return res.status(httpStatusCode).send(response);
//     });
// });

router.get('/user/:id/verify/:token', async function (req, res) {
    try {
        let userActivateTocken = await userModel.getUsertokenById(req.params.id, req.params.token);
        if (!userActivateTocken) return res.status(400).send({ message: 'invalid link/ user already verified' });
        var requestBody = {
            isActive: true,
            verificationCode: 'verified',

        }

        const userUpdate = await userModel.update(userActivateTocken.id, requestBody);
        if (!userUpdate) return res.status(400).send({ message: 'Token upadted but fetching data error' });
        return res.status(200).send({ message: 'Email Verified successfully' });



    } catch (error) {
        return res.status(500).send({ message: 'Email Verified successfully', 'error': error });
    }
});


router.get("/user/:ID", auth, bodyParser, async function (req, res) {
    var UserId = req.params.ID;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!UserId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const UserCollection = await userModel.getUser(UserId);
        if (UserCollection == null) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'No user exist');
        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'user retrived successfully');
    } catch (error) {
        message = "user retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});

router.post("/getUserbyrole", auth, bodyParser, async function (req, res) {
    // const UserId = req.params.UserId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    // if (!UserId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const userCollection = await userModel.getUserByRole(req.body.role);
        if (userCollection.length == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, "no active user in this role");

        responseObj = { "userCollection": userCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `user colected successfully`);
    } catch (error) {
        message = `user collection failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})
router.post("/companybasedUser/:companyId", auth, bodyParser, async function (req, res) {
    const companyId = req.params.companyId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!companyId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const userCollection = await userModel.getCompanybasedUser(companyId, req.body.role);
        if (userCollection.length == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, "no active user in this role");

        responseObj = { "userCollection": userCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `user colected successfully`);
    } catch (error) {
        message = `user collection failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})

router.post('/deleteUser/:UserId', auth, bodyParser, async function (req, res) {
    const UserId = req.params.UserId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!UserId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const userCollection = await userModel.deleteUser(UserId);
        if (!userCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, `user deletion failed`);

        responseObj = { "userCollection": userCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `user deleted successfully`);
    } catch (error) {
        message = `user deletion failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})

module.exports = router;