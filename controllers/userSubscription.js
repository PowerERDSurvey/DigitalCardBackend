const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth.js');
var bodyParser = require('body-parser').json();
const userSubscriptionModel = require("../models/mvc_userSubscription.js");
const helperUtil = require('../util/helper.js');

router.get('/getUserSubscription/:userSubscriptionId',auth,bodyParser,async function (req, res) {
    const userSubscriptionId = req.params.userSubscriptionId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userSubscriptionId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const userSubscriptionCollection = await userSubscriptionModel.getuserSubscriptionById(userSubscriptionId);
        if (!userSubscriptionCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no userSubscription to get');
        
        responseObj = {"userSubscriptionCollection" : userSubscriptionCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'UserSubscription collected successfully');
    } catch (error) {
        message = "UserSubscription retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});
router.get('/getUserSubscriptionbycompanyId/:companyId',auth,bodyParser,async function (req, res) {
    const companyId = req.params.companyId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!companyId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const userSubscriptionCollection = await userSubscriptionModel.getAllUserSubscriptionByQuery({where:{companyId:companyId}});
        if (!userSubscriptionCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no userSubscription to get');
        
        responseObj = {"userSubscriptionCollection" : userSubscriptionCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'UserSubscription collected successfully');
    } catch (error) {
        message = "UserSubscription retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});
router.get('/getUserSubscriptionbyUserId/:userId',auth,bodyParser,async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const userSubscriptionCollection = await userSubscriptionModel.getAllUserSubscriptionByQuery({where:{userId:userId}});
        if (!userSubscriptionCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no userSubscription to get');
        
        responseObj = {"userSubscriptionCollection" : userSubscriptionCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'UserSubscription collected successfully');
    } catch (error) {
        message = "UserSubscription retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});

router.post('/createUserSubscription',auth,bodyParser,async function (req, res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        var inputparam = {
            "subscriptionName": req.body.subscriptionName,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "userId": req.body.userId,
            "subscriptionId": req.body.subscriptionId,
            "isActive": true,
            "companyId": req.body.companyId
        }
        const userSubscriptionCollection = await userSubscriptionModel.createuserSubscription(inputparam);
        if (!userSubscriptionCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'UserSubscription created but no data to view');
        
        responseObj = {"userSubscriptionCollection" : userSubscriptionCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'UserSubscription created successfully');
    } catch (error) {
        message = "UserSubscription creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});

router.put('/updateUserSubscription/:userSubscriptionId',auth,bodyParser,async function (req, res) {
    const userSubscriptionId  = req.params.userSubscriptionId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        if (!userSubscriptionId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
        var inputparam ={
            "subscriptionName": req.body.subscriptionName,
            "startDate": req.body.startDate,
            "endDate": req.body.endDate,
            "userId": req.body.userId,
            "subscriptionId": req.body.subscriptionId,
            "isActive": req.body.isActive,
            "companyId": req.body.companyId
        }
        const userSubscriptionCollection = await userSubscriptionModel.updateuserSubscription(inputparam,userSubscriptionId);
        if (!userSubscriptionCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'UserSubscription created but no data to view');
        
        responseObj = {"userSubscriptionCollection" : userSubscriptionCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'UserSubscription updated successfully');
    } catch (error) {
        message = "UserSubscription updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});

module.exports = router;