const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const cardModel = require("../models/mvc_BusinessCard");
const cardImageModel = require("../models/mvc_businessCardImage.js");
const userImageModel = require("../models/mvc_UserImage.js");
const helperUtil = require('../util/helper.js');
const upload = require('../middleware/upload.js');
const userModel = require("../models/mvc_User.js");
const userSubscriptionModel = require("../models/mvc_userSubscription.js");
const subscriptionModel = require("../models/mvc_subscription.js");
const { where } = require("sequelize");
const productModel = require("../models/mvc_product.js");
const companyModel = require("../models/mvc_company.js");


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
router.get('/getCardCount/:userId', bodyParser, async function (req, res) {
    // const companyId = req.body.companyId;
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
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
        var company_Detail;
        const userIds = [];
        if (userDetail.role == 'COMPANY_USER') {

            userSubscriptionquery.where = {
                companyId: getCompanyId,
                isActive: true
            }
            company_Detail = await companyModel.getActiveCompanyById(getCompanyId);
            var userquery = { where: { companyId: getCompanyId } }; const company_usersDetail = await userModel.getALLUserbyQuery(userquery);
            userIds.push(...company_usersDetail.map((item) => item.id));
        }

        const cardDetails = userDetail.role == 'COMPANY_USER' ? await cardModel.getALLCardbyUserId(userIds) : await cardModel.getALLCardbyUserId(userId);
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


        if (userDetail.role == 'COMPANY_USER') {
            // if (subscriptionCardCount != 0) subscriptionCardCount += company_Detail.noOfUsers
            subscriptionCardCount += company_Detail.noOfUsers
            // if (subscriptionCardCount <= exsitingCardCount && exsitingCardCount >= company_Detail.noOfUsers) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Card creation limit reached. you already have ${subscriptionCardCount} cards please contact Admin`);

        } else {
            subscriptionCardCount++
            // if (subscriptionCardCount != 0) subscriptionCardCount++
            // if (subscriptionCardCount <= exsitingCardCount && exsitingCardCount > 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Card creation limit reached. you already have ${subscriptionCardCount} cards please contact Admin`);

        }
        responseObj = { "exsitingCardCount": exsitingCardCount, 'subscriptionCardCount': subscriptionCardCount };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card count collected successfully');

    } catch (error) {
        message = "card count retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});


router.get('/getCardCount/:userId', bodyParser, async function (req, res) {
    // const companyId = req.body.companyId;
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const userDetail = await userModel.getUser(userId);
        if (!userDetail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'userDetail not found');

        const existing_card_cout = await cardModel.getALLCardbyUserId(userId);

        var exsitingCardCount = 0;
        var subscriptionCardCount = 0;

        if (userDetail.cardAllocationCount > 0) {
            exsitingCardCount = userDetail.createdcardcount;
            subscriptionCardCount = userDetail.cardAllocationCount;
        }
        else if (existing_card_cout.length > 0) {
            exsitingCardCount = 1;
            subscriptionCardCount = 1;
        } else {
            subscriptionCardCount = 1;
        }

        responseObj = { "exsitingCardCount": exsitingCardCount, 'subscriptionCardCount': subscriptionCardCount };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card count collected successfully');

    } catch (error) {
        message = "card count retrieved Failed.";
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
        const getCardDetail = await cardModel.getACard(cardId);
        if (!getCardDetail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Card Collection Failed');
        const getUseDatail = await userModel.getUser(getCardDetail.userId);
        if (!getUseDatail) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'User Collection Failed');
        var inputparam = {
            isDelete: true,
        }
        const cardCollection = await cardModel.updateCard(inputparam, cardId);
        if (getUseDatail.createdcardcount > 0) {
            var updateParam = {
                createdcardcount: getUseDatail.createdcardcount - 1,
                cardAllocationCount: getUseDatail.cardAllocationCount + 1
            }
            const userUpdate = await userModel.update(getUseDatail.Id, updateParam)
        }
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