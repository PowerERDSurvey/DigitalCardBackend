const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const layoutModel = require("../models/mvc_layout.js");
const userModel = require("../models/mvc_User.js");
const helperUtil = require('../util/helper.js');


router.get('/getAllLayout', auth, bodyParser , async function(req, res){
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {

        const layoutCollection = await layoutModel.getAllLayout();
        if (layoutCollection.length == 0) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no layout In Active state');
       
        responseObj = {"layoutCollection" : layoutCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'layout collected successfully');
    } catch (error) {
        message = "layout retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})
router.get('/getoneLayout/:layoutId', auth, bodyParser , async function(req, res){
    const layoutId = req.params.layoutId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!layoutId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {

        const layoutCollection = await layoutModel.getLayout(layoutId);
        if (!layoutCollection ) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no layout In Active state');
       
        responseObj = {"layoutCollection" : layoutCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'layout collected successfully');
    } catch (error) {
        message = "layout retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})
router.post('/createLayout', auth, bodyParser , async function(req, res){
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!req.body) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        var inputparam = {
            "name": req.body.name,
            "content": req.body.content,
            "isActive": req.body.isActive,
            "script": req.body.script
        };

        const layoutCollection = await layoutModel.createLayout(inputparam);
        if (!layoutCollection ) return  await helperUtil.responseSender(res,'error',400,responseObj, 'layout created but no data to view');
       
        responseObj = {"layoutCollection" : layoutCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'layout created successfully');
    } catch (error) {
        message = "layout creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})
router.put('/updateLayout/:superAdmin', auth, bodyParser , async function(req, res){
    const userId = req.params.superAdmin;
    const layoutId = req.body.id;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!layoutId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');
        var inputparam = {
            "name": req.body.name,
            "content": req.body.content,
            // "isActive": req.body.isActive,
            "script": req.body.script
        };

        const layoutCollection = await layoutModel.updateLayout(inputparam,layoutId);
        if (!layoutCollection ) return  await helperUtil.responseSender(res,'error',400,responseObj, 'layout created but no data to view');
       
        responseObj = {"layoutCollection" : layoutCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'layout created successfully');
    } catch (error) {
        message = "layout creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})

// router.post('/layout/activateOrDeactivate/:layoutId', auth, bodyParser , async function(req, res){
//     const layoutId = req.params.layoutId;
//     var flag = req.body.isActive == 'true' ? 'Activation' :'deActivation';
//     var message = "";
//     var httpStatusCode = 500;
//     var responseObj = {};
//     if (!layoutId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
//     try {
       

//         const layoutCollection = await layoutModel.activateOrDeactivate(layoutId, req.body.isActive);
//         if (!layoutCollection ) return  await helperUtil.responseSender(res,'error',400,responseObj, `layout ${flag} failed`);
       
//         responseObj = {"layoutCollection" : layoutCollection};
//         return await helperUtil.responseSender(res,'data',200,responseObj, `layout ${flag} successfully`);
//     } catch (error) {
//         message = `layout ${flag} failed`;
//         responseObj = error;
//         return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
//     }
// })



module.exports = router;