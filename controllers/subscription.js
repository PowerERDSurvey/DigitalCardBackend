const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const SubscriptionModel = require("../models/mvc_subscription.js");
const userModel = require("../models/mvc_User.js");
const productModel = require("../models/mvc_product.js");
const UserSubscriptionModel = require("../models/mvc_userSubscription.js");
// const userImageModel = require("../models/mvc_UserImage.js");
const helperUtil = require('../util/helper.js');
const userSubscriptionModel = require("../models/mvc_userSubscription.js");


router.get('/getallsubscription/:superAdmin', auth, bodyParser, async function (req, res) {
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        var subscriptionCollection = [];
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) subscriptionCollection = await SubscriptionModel.getAllSubscriptionByquery({ where: { isActive: true } })
        // if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        if (getSuperAdmin) subscriptionCollection = await SubscriptionModel.getAllSubscription();
        if (!subscriptionCollection || subscriptionCollection.length == 0) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'there is no subscription In Active state');

        // var plans = [];
        if (Array.isArray(subscriptionCollection)) {
            for (let index = 0; index < subscriptionCollection.length; index++) {
                const getplans = await productModel.getOneProductById(subscriptionCollection[index].productId);

                subscriptionCollection[index].dataValues.plan = [getplans];
            }
        } else {
            const getplans = await productModel.getOneProductById(subscriptionCollection.productId);

            subscriptionCollection.dataValues.plan = [getplans];
        }
        responseObj = { "subscriptionCollection": subscriptionCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'subscription collected successfully');
    } catch (error) {
        message = "subscription retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})


router.post('/createSubscription/:superAdmin', auth, bodyParser, async function (req, res) {
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'company only can get by the SuperAdmin');

        var inputparam = {
            "planName": req.body.planName,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "Description": req.body.Description,
            "cost": req.body.cost,
            "isActive": true,
            "createdBy": userId,
            "updatedBy": userId,
            "productId": req.body.productId,
            "isDelete": false
        }

        const subscriptionCollection = await SubscriptionModel.createSubscription(inputparam);
        if (!subscriptionCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'subscription created but no values to show');

        responseObj = { "subscriptionCollection": subscriptionCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'subscription created successfully');
    } catch (error) {
        message = "subscription creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})



router.put('/updateSubscription/:superAdmin', auth, bodyParser, async function (req, res) {
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'company only can get by the SuperAdmin');

        var inputparam = {
            "planName": req.body.planName,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "Description": req.body.Description,
            "cost": req.body.cost,
            "isActive": req.body.isActive,
            "updatedBy": userId,
            // "productId":req.body.productId
        }
        var message = 'subscription updated successfully';
        const usersubscriprion = await userSubscriptionModel.getAllUserSubscriptionByQuery({ where: { isActive: true, subscriptionId: req.body.id } });
        if (usersubscriprion.length > 0) {
            inputparam = {
                "planName": req.body.planName,
                "Description": req.body.Description,
                "updatedBy": userId,
            }
            message = `Subscription already in use so `;
            if (req.body.planName) message += 'planName ';
            if (req.body.Description) message += 'Description ';
            message += 'updated successfully '
        }
        const subscriptionCollection = await SubscriptionModel.updateSubscription(inputparam, req.body.id);
        if (!subscriptionCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'subscription updated but no values to show');

        responseObj = { "subscriptionCollection": subscriptionCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, message);
    } catch (error) {
        message = "subscription updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})



router.post('/deleteSubscription/:superAdmin', auth, bodyParser, async function (req, res) {
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'company only can get by the SuperAdmin');

        const subscriptionCollection = await SubscriptionModel.deleteSubscription(userId, req.body.id);
        if (!subscriptionCollection) return await helperUtil.responseSender(res, 'error', 400, responseObj, 'deleted but facing issue please contact BC');

        responseObj = { "subscriptionCollection": subscriptionCollection };
        return await helperUtil.responseSender(res, 'data', 200, responseObj, 'subscription deleted successfully');
    } catch (error) {
        message = "subscription deleted Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res, 'error', httpStatusCode, responseObj, message);
    }
})
module.exports = router;