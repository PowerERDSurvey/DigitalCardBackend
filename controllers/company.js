const express = require("express");
var router = express.Router();
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();
const companyModel = require("../models/mvc_company");
const userModel = require("../models/mvc_User.js");
// const UserModel = require("../models/mvc_businessCardImage.js");
// const userImageModel = require("../models/mvc_UserImage.js");
const helperUtil = require('../util/helper.js');
// const upload = require('../middleware/upload.js');



router.get('/getAllCompanies/:superAdmin',auth,bodyParser,async function(req,res){
    const userId = req.params.superAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can get by the SuperAdmin');

        const companyCollection = await companyModel.get_All_ActiveCompanyById();
        if (companyCollection.length == 0) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no company In Active state');
       
        responseObj = {"companyCollection" : companyCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'company collected successfully');
    } catch (error) {
        message = "company retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})


router.post('/createCompany/:SuperAdmin',auth, bodyParser, async function (req, res) {
    const userId = req.params.SuperAdmin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can create by the SuperAdmin');
        var inputparam = {
            "companyName":req.body.companyName,
            "address":req.body.address,
            "mobileNumber":req.body.mobileNumber,
            "emailAddress":req.body.emailAddress,
            "country":req.body.country,
            "state":req.body.state,
            "city":req.body.city,
            "zipcode": req.body.zipcode,
            "isDelete":false,
            "noOfUsers":req.body.noOfUsers,
            "noOfAdmin":req.body.noOfAdmin,
            "randomKey":req.body.randomKey,
            "isActive":req.body.isActive,
            "createdBy":userId,
            "updatedBy":userId
        };
        const companyCollection = await companyModel.createCompany(inputparam);
        if (!companyCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company created but retriving data failed');
       
        responseObj = {"companyCollection" : companyCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'company created successfully');
    } catch (error) {
        message = "company creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})


router.put('/updateCompany/:Admin', auth , bodyParser , async function(req,res){
    const userId = req.params.Admin;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can update by the SuperAdmin');
        var inputparam = {
            "companyName":req.body.companyName,
            "address":req.body.address,
            "mobileNumber":req.body.mobileNumber,
            "emailAddress":req.body.emailAddress,
            "country":req.body.country,
            "state":req.body.state,
            "city":req.body.city,
            "zipcode": req.body.zipcode,
            "noOfUsers":req.body.noOfUsers,
            "noOfAdmin":req.body.noOfAdmin,
            "isActive":req.body.isActive,
            "updatedBy":userId
        };
        const companyCollection = await companyModel.updateCompany(inputparam, req.body.companyId);
        if (!companyCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company updated but retriving data failed');
       
        responseObj = {"companyCollection" : companyCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'company updated successfully');
    } catch (error) {
        message = "company updated Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    } 
})

router.post('/ActivateorDeactivate/:SuperAdmin/:companyRandomkey',auth, bodyParser, async function (req, res) {
    const userId = req.params.SuperAdmin;
    const companyKey = req.params.companyRandomkey;
    var flag = req.body.isActive == 'true' ? 'Activation' :'deActivation';
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId || !companyKey) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const getSuperAdmin = await userModel.getSuperAdmin(userId);
        if (!getSuperAdmin) return  await helperUtil.responseSender(res,'error',400,responseObj, 'company only can create by the SuperAdmin');
        const companyCollection = await companyModel.activateOrDeactivate(companyKey,req.body.isActive,userId);
        if (!companyCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, `company ${flag} failed`);
       
        responseObj = {"companyCollection" : companyCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, `company ${flag} successfully`);
    } catch (error) {
        message = `company ${flag} Failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})
router.post('/deleteCompany/:companyId',auth, bodyParser, async function (req, res) {
    const companyId = req.params.companyId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!companyId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const companyCollection = await companyModel.deleteCompany(companyId);
        if (!companyCollection) return  await helperUtil.responseSender(res,'error',400,responseObj, `company deletion failed`);

        const deleteUser = userModel.getUserByRole(companyId);

       
        responseObj = {"companyCollection" : companyCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, `company deleted successfully`);
    } catch (error) {
        message = `company deletion failed.`;
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
})



module.exports = router;