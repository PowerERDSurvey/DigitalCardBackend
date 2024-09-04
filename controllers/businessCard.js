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

        const existing_card_cout = await cardModel.getALLCardbyUserId(userId);

        var exsitingCardCount = userDetail.createdcardcount;
        var subscriptionCardCount = userDetail.cardAllocationCount;

        // if (userDetail.cardAllocationCount > 0 || userDetail.createdcardcount > 0) {
        //     if (existing_card_cout.length == 1) {
        //         // exsitingCardCount = userDetail.createdcardcount + 1;
        //         exsitingCardCount = userDetail.createdcardcount;

        //     } else if (existing_card_cout.length > 0) {
        //         exsitingCardCount = userDetail.createdcardcount;
        //     }
        //     // exsitingCardCount = userDetail.createdcardcount;
        //     subscriptionCardCount = userDetail.cardAllocationCount;
        // }
        // else if (existing_card_cout.length > 0) {
        //     exsitingCardCount = 1;
        //     // subscriptionCardCount = 1;
        // } else {
        //     subscriptionCardCount = 1;
        // }

        responseObj = { "exsitingCardCount": exsitingCardCount, 'subscriptionCardCount': subscriptionCardCount };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'Card count collected successfully');

    } catch (error) {
        message = "card count retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});






router.put('/user/card/activate/:cardId', auth, bodyParser, async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    var key_word = req.body.isActive == true ? 'Acivated' : 'Deactivated';
    try {

        const cardDetail = await cardModel.getACard(cardId);
        const user_detail = await userModel.getUser(cardDetail.userId);
        const active_cards = await cardModel.getALLActiveCardbyUserId(cardDetail.userId);

        var user_update_param = {};

        if (key_word == 'Acivated') {
            if (user_detail.cardAllocationCount == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Your account already have ${active_cards.length} Active cards`);
            // if ((user_detail.cardAllocationCount + user_detail.createdcardcount) + 1 <= active_cards.length) return await helperUtil.responseSender(res, 'error', 400, responseObj, `Your account already have ${active_cards.length} Active cards`);

            if (user_detail.cardAllocationCount > 0) {
                user_update_param = {
                    createdcardcount: user_detail.createdcardcount + 1,
                    cardAllocationCount: user_detail.cardAllocationCount - 1
                }
            }

        }
        if (key_word == 'Deactivated') {
            // if (active_cards.length == 1) return await helperUtil.responseSender(res, 'error', 400, responseObj, `You account must have  ${active_cards.length} Active card`);

            if (user_detail.createdcardcount > 0) {
                user_update_param = {
                    createdcardcount: user_detail.createdcardcount - 1,
                    cardAllocationCount: user_detail.cardAllocationCount + 1
                }

            }

        }

        var inputparam = {
            isActive: req.body.isActive,
        }
        const cardCollection = await cardModel.updateCard(inputparam, cardId);
        if (!cardCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'card updated. but waiting for response please contact BC');

        const user_update = await userModel.update(user_detail.id, user_update_param);
        if (!user_update) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'Creation faild');


        responseObj = { "cardCollection": cardCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `card ${key_word} successfully`);

    } catch (error) {
        message = `card ${key_word} successfully`;
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
});
router.get('/getallocationdetail/:userId', auth, bodyParser, async function (req, res) {

    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const active_cards = await cardModel.getALLActiveCardbyUserId(userId);
        const usr_detail = await userModel.getUser(userId);

        var allocation_count;
        var created_count = 0;
        var used_freeCard = 0;

        if (usr_detail.createdcardcount > 0) {
            // if (usr_detail.cardAllocationCount > 0) {

            // }
            allocation_count = usr_detail.cardAllocationCount + (usr_detail.createdcardcount - 1);
            created_count = usr_detail.createdcardcount - 1;
            used_freeCard = 1;

        } else {
            allocation_count = usr_detail.cardAllocationCount - 1;

        }


        responseObj = { "allocationDetail": { 'allocation_count': allocation_count, 'created_count': created_count, 'used_freeCard': used_freeCard } };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, `card Allocation fetched successfully`);
    } catch (error) {
        message = "card allocation fetch faild";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})

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
            const userUpdate = await userModel.update(getUseDatail.id, updateParam)
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