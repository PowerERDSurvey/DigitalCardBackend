const express = require("express");

const jwt = require('jsonwebtoken');
var router = express.Router();
const userModel = require("../models/mvc_User");
const userImageModel = require('../models/mvc_UserImage.js')
const companyModel = require('../models/mvc_company.js')
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
    var Randpassword = await helperUtil.generateRandomPassword();
    let encryptedPassword = cryptr.encrypt(requestBody.password ? requestBody.password : Randpassword);
    requestBody.PASSWORD = encryptedPassword;
    console.log(requestBody);

    try {
        await handleUserCreation(req, res, requestBody);
    } catch (error) {
        return await sendErrorResponse(res, 500, error, 'User creation failed.');
    }
});

async function handleUserCreation(req, res, requestBody) {
    const isEmailValid = await helperUtil.checkEmailValid(requestBody.email);

    if (!isEmailValid && requestBody.type !== 'GOOGLE_SSO') {
        return await sendErrorResponse(res, 400, {}, 'Email Address already exists.');
    }
    if (requestBody.companyId) {
        const companyDetail = await companyModel.getActiveCompanyById(requestBody.companyId);
        if (!companyDetail) return await sendErrorResponse(res, 400, {}, 'No company details found.');
        const companyAdmins = await userModel.getCompanybasedUser(requestBody.companyId, requestBody.role);
        if (requestBody.role == 'COMPANY_ADMIN') {

            // if (companyDetail.noOfAdmin <= companyAdmins.length) return await sendErrorResponse(res, 400, {}, `company admin limit reached. your company can create only ${companyDetail.noOfAdmin} Admins`);

        }
        if (requestBody.role == 'COMPANY_USER') {
            if (companyDetail.noOfUsers <= companyAdmins.length) return await sendErrorResponse(res, 400, {}, `company User limit reached. your company can create only ${companyDetail.noOfUsers} Users`);
        }


    }

    if (requestBody.type === 'GOOGLE_SSO') {
        if (!isEmailValid) {
            const email = await userModel.getALLUserbyQuery({ where: { primaryEmail: requestBody.email } });
            if (email[0].signupType != 'GOOGLE_SSO') return await sendErrorResponse(res, 400, {}, 'Email already been used');
            const token = generateToken({ email: email[0].primaryEmail });
            await insertToUsertToken(email[0].id, token);
            const userImages = await userImageModel.getAllUserImageByUserId(email[0].id);
            const responseData = createResponseData(email[0], userImages, token);
            return res.json({ status: 200, token: token, data: responseData });
        }
        return await handleGoogleSSOUser(req, res, requestBody);
    } else {
        return await handleStandardUser(req, res, requestBody, isEmailValid);
    }
}

async function handleGoogleSSOUser(req, res, requestBody) {

    // if (!result.isActive) {
    //     return await sendErrorResponse(res, 400, {}, 'User is disabled');
    // }

    const token = generateToken({ email: requestBody.email });
    const inputObj = createUserInputObject(requestBody, token);

    const result = await userModel.create(inputObj);
    await deleteExpiredTokenz(result.id);
    await insertTokenAndRespond(res, result.id, token, result);
}

async function cardAllocation(requestBody, req, res) {
    if (requestBody.role == "SUPER_ADMIN" || requestBody.role == 'INDIVIDUAL_USER') return;
    if (requestBody.role == 'COMPANY_ADMIN') {
        requestBody.userAllocatedCount = requestBody.userAllocatedCount - 1;
        requestBody.usercreatedCount = requestBody.usercreatedCount + 1;
        return;
    } else {
        if (!requestBody.assignedBy) return;
        const superior_datum = await userModel.getUser(requestBody.assignedBy);

        // if (superior_datum.userAllocatedCount < requestBody.userAllocatedCount) return await sendErrorResponse(res, 400, {}, `you can give maximum user as ${superior_datum.userAllocatedCount}`); //todo//initially it will zero
        // if (superior_datum.cardAllocationCount < requestBody.cardAllocationCount) return await sendErrorResponse(res, 400, {}, `you can give maximum user as ${superior_datum.cardAllocationCount}`); //todo//initially it will zero
        var count_to_be_reduce = 0;
        requestBody.userAllocatedCount != 0 ? count_to_be_reduce = requestBody.userAllocatedCount + 1 : count_to_be_reduce = 1;
        var superior_datum_param = {};
        if (requestBody.userAllocatedCount != 0) {
            if (requestBody.userAllocatedCount == superior_datum.userAllocatedCount) {
                requestBody.userAllocatedCount = requestBody.userAllocatedCount - 1;
                superior_datum_param = {
                    ...superior_datum_param,
                    userAllocatedCount: 0,
                    usercreatedCount: superior_datum.userAllocatedCount + superior_datum.usercreatedCount
                }
            } else {

                superior_datum_param = {
                    ...superior_datum_param,
                    userAllocatedCount: superior_datum.userAllocatedCount - count_to_be_reduce,
                    usercreatedCount: superior_datum.usercreatedCount + count_to_be_reduce
                }
            }
        } else {
            superior_datum_param = {
                ...superior_datum_param,
                userAllocatedCount: superior_datum.userAllocatedCount - 1,
                usercreatedCount: superior_datum.usercreatedCount + 1
            }
        }
        if (requestBody.cardAllocationCount != 0) {
            superior_datum_param = {
                ...superior_datum_param,
                // createdcardcount: superior_datum.usercreatedCount + requestBody.cardCreatedCount,
                cardAllocationCount: superior_datum.cardAllocationCount - requestBody.cardAllocationCount
            }
            requestBody.cardAllocationCount = requestBody.cardAllocationCount + 1;

        }
        else {
            requestBody.cardAllocationCount = 1;
        }
        const update_superior = await userModel.update(superior_datum.id, superior_datum_param);
        // if (requestBody.role == 'COMPANY_USER') {
        //     const super_superior_datum = await userModel.getUser(superior_datum.assignedBy);
        //     var update_sup_superior_param = {
        //         userAllocatedCount: super_superior_datum.userAllocatedCount - 1,
        //         usercreatedCount: super_superior_datum.usercreatedCount + 1
        //     }
        //     const update_sup_superior = await userModel.update(super_superior_datum.id, update_sup_superior_param);
        // }
        return;
    }



}

async function handleStandardUser(req, res, requestBody, isEmailValid) {
    if (!isEmailValid) {
        return await handleExistingEmail(req, res, requestBody);
    }

    const isPasswordValid = await helperUtil.checkPasswordValid(requestBody.PASSWORD);
    if (!isPasswordValid) {
        return await sendErrorResponse(res, 400, {}, 'Password is invalid or empty.');
    }

    const token = generateToken({ email: requestBody.email });
    const inputObj = createUserInputObject(requestBody, token);
    await cardAllocation(inputObj, req, res);
    const result = await userModel.create(inputObj);

    if (!result) {
        return await sendErrorResponse(res, 400, {}, 'User created but no values to show.');
    }

    const responseObj = { ID: result.dataValues.id };
    const emailSent = await sendVerificationEmail.sendInitialVerificationEmail(result.dataValues.id, requestBody.email, token, { password: cryptr.decrypt(requestBody.PASSWORD), userName: result.dataValues.userName });

    if (!emailSent) {
        return await sendErrorResponse(res, 400, responseObj, 'Verification email sending failed.');
    }

    return await sendSuccessResponse(res, responseObj, 'User created successfully');
}

async function handleExistingEmail(req, res, requestBody) {
    const result = await userModel.getActiveEmails();
    if (result.length === 0) {
        return await sendErrorResponse(res, 400, {}, 'No active emails found.');
    }

    for (const email of result) {
        if (email.primaryEmail === requestBody.email) {
            if (email.isActive) {
                const token = generateToken({ email: email });
                await deleteExpiredTokenz(email.id);
                return await insertTokenAndRespond(res, email.id, token, email);
            } else {
                return res.json({ status: false, status: 400, message: 'User is disabled' });
            }
        }
    }
}

function createUserInputObject(requestBody, token = null) {
    return {
        firstName: requestBody.type == 'GOOGLE_SSO' ? requestBody.username : requestBody.firstName,
        lastName: requestBody.lastName,
        // userName: requestBody.type == 'GOOGLE_SSO' ? null : requestBody.username.toLowerCase(),
        userName: requestBody.type == 'GOOGLE_SSO' ? null : requestBody.username.toLowerCase().replace(/ /g, "_"),
        randomInitialPassword: requestBody.PASSWORD,
        // password: 'WAITING FOR PASSWORD RESET',
        primaryEmail: requestBody.email,
        mobileNumber: requestBody.mobileNumber,
        signupType: requestBody.type,
        isActive: requestBody.type == 'GOOGLE_SSO' ? true : false,
        role: requestBody.role,
        companyId: requestBody.companyId,
        verificationCode: token,
        randomKey: requestBody.randomKey,//todo
        verificationExpires: Date.now() + 7200000,
        isDelete: false,//todo createdby upxdateby
        createdBy: requestBody.createdBy,
        usercreatedCount: requestBody.usercreatedCount == null || requestBody.usercreatedCount == "undefined" || requestBody.usercreatedCount == undefined ? 0 : requestBody.usercreatedCount,
        userAllocatedCount: requestBody.userAllocatedCount == null || requestBody.userAllocatedCount == "undefined" || requestBody.userAllocatedCount == undefined ? 0 : requestBody.userAllocatedCount,
        createdcardcount: requestBody.createdcardcount == null || requestBody.createdcardcount == "undefined" || requestBody.createdcardcount == undefined ? 0 : requestBody.createdcardcount,
        cardAllocationCount: requestBody.cardAllocationCount == null || requestBody.cardAllocationCount == "undefined" || requestBody.cardAllocationCount == undefined ? 1 : requestBody.cardAllocationCount,
        assignedBy: requestBody.assignedBy,
        isUserCardAllocated: requestBody.isUserCardAllocated,
    };
}

function generateToken(payload) {
    return jwt.sign(payload, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
}

async function deleteExpiredTokenz(userId) {
    await deleteExpiredTokens(userId);

}

async function insertTokenAndRespond(res, userId, token, email) {
    try {
        await insertToUsertToken(userId, token);
        const userImages = await userImageModel.getAllUserImageByUserId(userId);
        const responseData = createResponseData(email, userImages, token);
        return res.json({ status: 200, token: token, data: responseData });
    } catch (err) {
        console.log('Insert error user token', err);
    }
}

function createResponseData(email, userImages, token) {
    return {
        id: email.id,
        firstName: email.firstName,
        userName: email.userName,
        lastName: email.lastName,
        primaryEmail: email.primaryEmail,
        usercreatedCount: email.usercreatedCount,
        userAllocatedCount: email.userAllocatedCount,
        createdcardcount: email.createdcardcount,
        cardAllocationCount: email.cardAllocationCount,
        // secondaryEmail: email.secondaryEmail,
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
        randomKey: email.randomKey,
        role: email.role,
        companyId: email.companyId,
        isUserCardAllocated: email.isUserCardAllocated,
        authenticated: true,
    };
}

async function sendErrorResponse(res, statusCode, responseObj, message) {
    return await helperUtil.responseSender(res, 'error', statusCode, responseObj, message);
}

async function sendSuccessResponse(res, responseObj, message) {
    return await helperUtil.responseSender(res, 'data', 200, responseObj, message);
}


router.get('/user/:id/verify/:token', async function (req, res) {
    try {
        let userActivateTocken = await userModel.getUsertokenById(req.params.id, req.params.token);
        if (!userActivateTocken) return res.status(400).send({ message: 'invalid link/ user already verified' });
        var requestBody = {
            isActive: true,
            verificationCode: 'verified',
            isEmailVerified: true,
            updatedBy: req.params.id
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
        responseObj = { "UserCollection": UserCollection };
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
router.post("/getuserbasedcompanyuser/:UserId", auth, bodyParser, async function (req, res) {
    const UserId = req.params.UserId;
    const companyId = req.body.companyId;
    const role = req.body.role;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!UserId && !role && !companyId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const userCollection = await userModel.getALLUserbyQuery({ where: { createdBy: UserId, companyId: companyId, role: role, isDelete: false } });
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

router.post('/resetpassword', bodyParser, async function (req, res) {

    const emailId = req.body.emailId;
    var message = "";
    var responseObj = {};
    var httpStatusCode = 500;
    try {
        if (!emailId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'EmailId  missing');
        const userCollection = await userModel.getALLUserbyQuery({ where: { isActive: true, isDelete: false, isEmailVerified: true, primaryEmail: emailId, } });
        if (userCollection == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'user not found/not in active stage');

        if (userCollection[0].dataValues.signupType == 'GOOGLE_SSO') return res.redirect('/login');
        // if (userCollection[0].dataValues.passwordVerificationCode != 'verified') return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Already Link send your email');
        const tokenz = generateToken({ email: emailId });
        await deleteExpiredTokenz(userCollection[0].id);
        await insertToUsertToken(userCollection[0].id, tokenz);


        var reqbody = {
            // password: await helperUtil.generateRandomPassword()
            passwordVerificationCode: tokenz,
            updatedBy: userCollection[0].dataValues.id
        }
        const userupdate = await userModel.update(userCollection[0].dataValues.id, reqbody);
        if (!userupdate) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'password updated. Error on collecting data');
        const token = await getLatestUserToken(userCollection[0].dataValues.id);

        const emailsend = await sendVerificationEmail.sendForgetPassEmail(userCollection[0].dataValues.id, emailId, token.token);

        if (!emailsend) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Email send failed');

        return await helperUtil.responseSender(res, 'data', 200, responseObj, `Verification email sent to ${emailId}`);


    } catch (error) {
        message = `Reset password failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})


router.put('/initialPasswordResetuser/:UserId/tocken/:Token', async function (req, res) {

    const UserId = req.params.UserId;
    // const InitialPassword = req.params.InitialPassword;
    const verificationCode = req.params.Token;
    var message = "";
    var responseObj = {};
    var httpStatusCode = 400;
    try {
        if (!UserId) return await helperUtil.responseSender(res, 'error', 500, responseObj, 'req params  missing');
        const userCollection = await userModel.getUsertokenById(UserId, verificationCode);

        if (!userCollection) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'link expired');
        var decrptPass = cryptr.decrypt(userCollection.randomInitialPassword);
        if (decrptPass != req.body.oldPassword) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, `old password doesn't match`);

        // if (userCollection.dataValues.verificationCode == 'verified') return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'link expired');
        const newToken = generateToken({ email: userCollection.primaryEmail });

        const emailsent = await sendVerificationEmail.sendVerificationEmail(UserId, userCollection.primaryEmail, newToken, { password: req.body.password, userName: userCollection.userName })


        var inputParams = {
            password: cryptr.encrypt(req.body.password),
            verificationCode: newToken
        }
        const updateUser = await userModel.update(UserId, inputParams);

        if (!updateUser) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'Password reset but no data to retrive');


        if (!emailsent) return await helperUtil.responseSender(res, 'data', 200, responseObj, `Email sent failed`);

        responseObj = { 'url': emailsent }
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `Password reset successfully`);

    } catch (error) {
        message = `Reset password failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', 500, responseObj, message);
    }
})



router.post('/deleteUser/:UserId', auth, bodyParser, async function (req, res) {
    const { UserId } = req.params;
    const { id } = req.body;
    let responseObj = {};
    const httpStatusCode = 500;

    if (!UserId) {
        return helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'Requested params missing');
    }

    try {
        const get_user = await userModel.getUser(id);
        if (!get_user) {
            return helperUtil.responseSender(res, 'error', 400, responseObj, 'User deletion failed');
        }

        const exist_user = await userModel.getALLUserbyQuery({ where: { isDelete: false, assignedBy: id } });
        if (exist_user.length > 0) {
            return helperUtil.responseSender(res, 'error', 400, responseObj, `Account has ${exist_user.length} users. Please delete them before updating.`);
        }

        const superior_datum = await userModel.getUser(get_user.assignedBy);
        if (!superior_datum) {
            return helperUtil.responseSender(res, 'error', 400, responseObj, 'Superior user not found.');
        }

        if (get_user.role !== 'COMPANY_ADMIN' && get_user.role !== 'INDIVIDIAL_USER') {
            if (get_user.usercreatedCount > 0) {
                await userModel.update(id, {
                    usercreatedCount: get_user.usercreatedCount - 1,
                    userAllocatedCount: get_user.userAllocatedCount + 1
                });
            }
            if ((get_user.cardAllocationCount + get_user.createdcardcount) > 0) {
                await userModel.update(superior_datum.id, {
                    cardAllocationCount: (superior_datum.cardAllocationCount + (get_user.cardAllocationCount + get_user.createdcardcount)) - 1
                });
            }

            if (superior_datum.role !== 'SUPER_ADMIN') {
                const userCountsToAdjust = (get_user.usercreatedCount + get_user.userAllocatedCount) + 1;

                if (superior_datum.usercreatedCount > 0) {
                    await userModel.update(superior_datum.id, {
                        usercreatedCount: superior_datum.usercreatedCount - userCountsToAdjust,
                        userAllocatedCount: superior_datum.userAllocatedCount + userCountsToAdjust
                    });
                }


            }
        }

        const userCollection = await userModel.deleteUser(UserId, id);
        if (!userCollection) {
            return helperUtil.responseSender(res, 'error', 400, responseObj, 'User deletion failed');
        }

        responseObj = { userCollection };
        return helperUtil.responseSender(res, 'data', 200, responseObj, 'User deleted successfully');
    } catch (error) {
        return helperUtil.responseSender(res, 'error', httpStatusCode, error, 'User deletion failed.');
    }
});


module.exports = router;