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


router.get('/user/getAllCard/:userId',auth,bodyParser,async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const cardCollection = await cardModel.getALLCardbyUserId(userId);
        if (cardCollection.length == 0) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no cards in active state for this User');
        const images = await cardImageModel.getAllCardImageByCardId(cardCollection[0]?.id); //todo

        cardCollection[0].dataValues.images= images;
        responseObj = {"cardCollection" : cardCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'Card collected successfully');
    } catch (error) {
        message = "card retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
    

});


router.get('/user/getOneCard/:userrandomkey/:cardrandomkey',bodyParser,async function (req, res) {
    const cardKey = req.params.cardrandomkey;
    const userKey = req.params.userrandomkey;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardKey || !userKey) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const cardCollection = await cardModel.getACardbyCardId(userKey , cardKey);
        // if (cardCollection == null)  return res.status(httpStatusCode).send( { "status": httpStatusCode, "error": responseObj, "message": message });
        if (cardCollection == null) return await helperUtil.responseSender(res,'error',400,responseObj, 'The cards not in active state');
        const images = await cardImageModel.getAllCardImageByCardId(cardCollection.id);
        cardCollection.dataValues.images= images;
        responseObj = {"cardCollection" : cardCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'Card collected successfully');
    }catch(error){
        message = "card retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});


router.post('/user/createCard/:userId',auth,bodyParser,async function (req, res) {
    const userId = req.params.userId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!userId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        //---------------------subscription plan---------------

        // get company id for the user  
        const userDetail =await userModel.getUser(userId);
        if(!userDetail) return  await helperUtil.responseSender(res,'error',400,responseObj, 'userDetail not found');

        var getCompanyId = userDetail.dataValues.companyId;

        // get all the user by companyid
        var userquery = {
            where:{
                userId : userId
            }
        }
        var userSubscriptionquery = {
            where:{
                userId : userId,
                isActive:true
            }
        }
        if(userDetail.role == 'COMPANY_USER') {
            userquery.where = {companyId : getCompanyId};
            userSubscriptionquery.where = {
                companyId : getCompanyId,
                isActive:true
            }
        }
        const usersDetail = await userModel.getALLUserbyQuery(userquery);
        var exsitingCardCount = usersDetail.length;

        //get subscription ids from userSubscription
        const userSubscription = await userSubscriptionModel.getAllUserSubscriptionByQuery(userSubscriptionquery);

        var userSubscriptionIds = userSubscription.map((item)=>item.subscriptionId);

        console.log('userSubscriptionIds',userSubscriptionIds);

        //get Active subscription from subscription id //forloop
        const getSubscription =  await subscriptionModel.getAllSubscriptionByquery({where:{isActive:true , id:userSubscriptionIds }});

        var subscriptionCardCount = 0;

        for (let index = 0; index < getSubscription.length; index++) {
            const getplans = await productModel.getOneProductById(getSubscription[index].productId);
            subscriptionCardCount += getplans.dataValues.cardCount;
            // getSubscription[index].dataValues.plan = [getplans];
        }
        if(subscriptionCardCount <= exsitingCardCount && exsitingCardCount > 0)  return  await helperUtil.responseSender(res,'error',400,responseObj, `Card creation limit reached. you already have $
        {subscriptionCardCount} cards please contact Admin`);
        //count the card creation count and restric the flow
        // const userDetail = 


        var inputparam = {
            userId:userId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            primaryEmail: req.body.primaryEmail,
            // secondaryEmail: req.body.secondaryEmail,
            isActive: req.body.isActive,
            verificationCode: req.body.verificationCode,
            isEmailVerified: req.body.isEmailVerified,
            mobileNumber: req.body.mobileNumber,
            companyName: req.body.companyName,
            designation: req.body.designation,
            whatsapp: req.body.whatsapp,
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            linkedin: req.body.linkedin,
            website: req.body.website,
            city: req.body.city,
            zipCode: req.body.zipCode,
            country: req.body.country,
            state: req.body.state,
            Address: req.body.address,
            aboutMe: req.body.aboutMe,
            youtube: req.body.youtube,
            department: req.body.department,
            vCardDetails: req.body.vCardDetails,
            randomKey:req.body.randomKey,
          };

        const cardCollection = await cardModel.createcreateCard(inputparam);
        if (!cardCollection)  return await helperUtil.responseSender(res,'error',400,responseObj, 'there is no error on database but not created please contact BC service');
        responseObj = {"cardCollection" : cardCollection};
        const images =[];
        const getUserImage = await userImageModel.getAllUserImageByUserId(userId);
        if(getUserImage.length > 0){
            for (let index = 0; index < getUserImage.length; index++) {
                getUserImage[index].path =  getUserImage[index].filepath;
              const Images =await cardImageModel.createByCardId( getUserImage[index], getUserImage[index].type,cardCollection.id);
          images.push(Images);
                
            }
        
        };
        responseObj.cardCollection.dataValues.images = images;
        return await helperUtil.responseSender(res,'data',200,responseObj, 'Card Created successfully');
    }
    catch(error){
        message = "card creation Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});



router.get('/user/card/activate/:cardId',auth,bodyParser,async function (req, res) {
    const cardId = req.params.cardId;
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    if (!cardId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        var inputparam = {
            isActive: req.body.isActive,
        }
        const cardCollection = await cardModel.updateCard(inputparam,cardId);
        if (!cardCollection)  return await helperUtil.responseSender(res,'error',400,responseObj, 'card updated. but waiting for response please contact BC');
        responseObj = {"cardCollection" : cardCollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'card Acivated/disactivated successfully');

    }catch(error){
        message = "card Acivated/disactivated Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});

module.exports = router;