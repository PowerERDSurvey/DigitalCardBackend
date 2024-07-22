const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const cardModel = require("../models/mvc_Businesscard");
const cardImageModel = require("../models/mvc_businessCardImage.js");
// const companyModel = require("../models/mvc_company.js");
const userImageModel = require("../models/mvc_UserImage.js");
const helperUtil = require('../util/helper.js');
const upload = require('../middleware/upload.js');
const userModel = require("../models/mvc_User.js");
const userSubscriptionModel = require("../models/mvc_userSubscription.js");
const subscriptionModel = require("../models/mvc_subscription.js");
const { where } = require("sequelize");
const productModel = require("../models/mvc_product.js");


router.get('/user/getAllCard/:userId', auth, bodyParser, async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const cardCollection = await cardModel.getALLCardbyUserId(userId);
        if (cardCollection.length == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no cards in active state for this User');

        for (let index = 0; index < cardCollection.length; index++) {
            // const element = array[index];

            const images = await cardImageModel.getAllCardImageByCardId(cardCollection[index]?.id); //todo

            cardCollection[index].dataValues.images = images;
        }
        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card collected successfully');
    } catch (error) {
        message = "card retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }


});


router.get('/user/getOneCard/:userrandomkey/:cardrandomkey', bodyParser, async function (req, res) {
    const cardKey = req.params.cardrandomkey;
    const userKey = req.params.userrandomkey;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardKey || !userKey) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const cardCollection = await cardModel.getACardbyCardId(userKey, cardKey);
        // if (cardCollection == null)  return res.status(httpStatusCode).send( { "status": httpStatusCode, "error": responseObj, "message": message });
        if (cardCollection == null) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'The cards not in active state');
        const images = await cardImageModel.getAllCardImageByCardId(cardCollection.id);
        cardCollection.dataValues.images = images;
        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card collected successfully');
    } catch (error) {
        message = "card retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});


router.post('/user/createCard/:userId', auth, bodyParser, async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        //---------------------subscription plan---------------

        // get company id for the user  
        const userDetail = await userModel.getUser(userId);
        if (!userDetail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'userDetail not found');

        var getCompanyId = userDetail.dataValues.companyId;

        // get all the user by companyid
        // var userquery = {
        //     where: {
        //         id: userId
        //     }
        // }
        var userSubscriptionquery = {
            where: {
                userId: userId,
                isActive: true
            }
        }
        if (userDetail.role == 'COMPANY_USER') {
            // userquery.where = { companyId: getCompanyId };
            userSubscriptionquery.where = {
                companyId: getCompanyId,
                isActive: true
            }
        }
        // const usersDetail = await userModel.getALLUserbyQuery(userquery);
        const cardDetails = await cardModel.getALLCardbyUserId(userId);
        var exsitingCardCount = cardDetails.length;

        //get subscription ids from userSubscription
        const userSubscription = await userSubscriptionModel.getAllUserSubscriptionByQuery(userSubscriptionquery);

        var userSubscriptionIds = userSubscription.map((item) => item.subscriptionId);

        console.log('userSubscriptionIds', userSubscriptionIds);

        //get Active subscription from subscription id //forloop
        var getSubscription = [];
        for (let index = 0; index < userSubscriptionIds.length; index++) {
            // const element = array[index];

            var subs = await subscriptionModel.getAllSubscriptionByquery({ where: { isActive: true, id: userSubscriptionIds[index] } });
            getSubscription.push(subs[0]);

        }

        var subscriptionCardCount = 0;

        for (let index = 0; index < getSubscription.length; index++) {
            var sub = getSubscription[index];
            const getplans = await productModel.getOneProductById(sub.dataValues.productId);
            subscriptionCardCount += getplans.cardCount;
            // getSubscription[index].dataValues.plan = [getplans];
        }
        if (subscriptionCardCount <= exsitingCardCount && exsitingCardCount > 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Card creation limit reached. you already have ${subscriptionCardCount} cards please contact Admin`);
        //count the card creation count and restric the flow
        // const userDetail = 


        var inputparam = {
            userId: userId ? userId : null,
            firstName: req.body.firstName ? req.body.firstName : null,
            lastName: req.body.lastName ? req.body.lastName : null,
            primaryEmail: req.body.secondaryEmail ? req.body.secondaryEmail : null,
            // primaryEmail: req.body.primaryEmail ? req.body.primaryEmail : null,
            isActive: req.body.isActive ? req.body.isActive : null,
            verificationCode: req.body.verificationCode ? req.body.verificationCode : null,
            isEmailVerified: req.body.isEmailVerified ? req.body.isEmailVerified : null,
            mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : null,
            companyName: req.body.companyName ? req.body.companyName : null,
            designation: req.body.designation ? req.body.designation : null,
            whatsapp: req.body.whatsapp ? req.body.whatsapp : null,
            facebook: req.body.facebook ? req.body.facebook : null,
            instagram: req.body.instagram ? req.body.instagram : null,
            linkedin: req.body.linkedin ? req.body.linkedin : null,
            website: req.body.website ? req.body.website : null,
            city: req.body.city ? req.body.city : null,
            zipCode: req.body.zipCode ? req.body.zipCode : null,
            country: req.body.country ? req.body.country : null,
            state: req.body.state ? req.body.state : null,
            Address: req.body.address ? req.body.address : null,
            aboutMe: req.body.aboutMe ? req.body.aboutMe : null,
            youtube: req.body.youtube ? req.body.youtube : null,
            department: req.body.department ? req.body.department : null,
            vCardDetails: req.body.vCardDetails ? req.body.vCardDetails : null,
            randomKey: req.body.randomKey ? req.body.randomKey : null,
        };

        const cardCollection = await cardModel.createcreateCard(inputparam);
        if (!cardCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no error on database but not created please contact BC service');
        responseObj = { "cardCollection": cardCollection };
        const images = [];
        const getUserImage = await userImageModel.getAllUserImageByUserId(userId);
        if (getUserImage.length > 0) {
            for (let index = 0; index < getUserImage.length; index++) {
                getUserImage[index].path = getUserImage[index].filepath;
                const Images = await cardImageModel.createByCardId(getUserImage[index], getUserImage[index].type, cardCollection.id);
                images.push(Images);

            }

        };
        responseObj.cardCollection.dataValues.images = images;
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card Created successfully');
    }
    catch (error) {
        message = "card creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});



router.get('/user/card/activate/:cardId', auth, bodyParser, async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        var inputparam = {
            isActive: req.body.isActive,
        }
        const cardCollection = await cardModel.updateCard(inputparam, cardId);
        if (!cardCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'card updated. but waiting for response please contact BC');
        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'card Acivated/disactivated successfully');

    } catch (error) {
        message = "card Acivated/disactivated Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});
router.get('/deleteCard/:cardId', auth, bodyParser, async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        var inputparam = {
            isActive: false,
        }
        const cardCollection = await cardModel.updateCard(inputparam, cardId);
        if (!cardCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'card updated. but waiting for response please contact BC');
        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'card deleted successfully');

    } catch (error) {
        message = "card deletion Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});

module.exports = router;