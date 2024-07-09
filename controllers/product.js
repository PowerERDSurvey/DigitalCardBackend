const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const productModel = require("../models/mvc_product.js");
const userModel = require("../models/mvc_User.js");
// const UserModel = require("../models/mvc_businessCardImage.js");
// const userImageModel = require("../models/mvc_UserImage.js");
const helperUtil = require('../util/helper.js');


router.get('/getallPlan/:superAdmin',auth,bodyParser,async function(req,res){
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        const planCollection = await productModel.getAllProduct();
        if (!planCollection || planCollection.length == 0) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no plan In Active state');
       
        responseObj = {"planCollection" : planCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'plan collected successfully');
    } catch (error) {
        message = "plan retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})

router.post('/createPlan/:superAdmin',auth,bodyParser,async function(req,res){
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        var inputparam = {
            "name": req.body.name,
            "cardCount": req.body.cardCount,
            "layoutCount": req.body.layoutCount,
            "layoutId": req.body.layoutId,
            "createdBy": userId,
            "updatedBy": userId,
            "isDelete": false,
            "isActive":true
        }

        const planCollection = await productModel.createProduct(inputparam);
        if (!planCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'plan created but no values to show');
       
        responseObj = {"planCollection" : planCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'plan created successfully');
    } catch (error) {
        message = "plan creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})

router.put('/updatePlan/:superAdmin',auth,bodyParser,async function(req,res){
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        var inputparam = {
            "name": req.body.name,
            "cardCount": req.body.cardCount,
            "layoutCount": req.body.layoutCount,
            "layoutId": req.body.layoutId,
            "isActive": req.body.isActive, 
            "updatedBy": userId,
            
        }

        const planCollection = await productModel.updateProduct(inputparam, req.body.id );
        if (!planCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'plan updated but no values to show');
       
        responseObj = {"planCollection" : planCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'plan updated successfully');
    } catch (error) {
        message = "plan updation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})


router.post('/deletePlan/:superAdmin',auth,bodyParser,async function(req,res){
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        const planCollection = await productModel.deleteProduct(userId,req.body.id);
        if (!planCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'deleted but facing issue please contact BC');
       
        responseObj = {"planCollection" : planCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'plan deleted successfully');
    } catch (error) {
        message = "plan deleted Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})

module.exports = router;