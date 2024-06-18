const express = require("express");
var router = express.Router();
var bodyParser = require('body-parser').json();
const countryModel = require("../models/mvc_countryAndState");
const helperUtil = require('../util/helper.js');


router.get('/getcountries',bodyParser,async function (req,res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    try {
        const countrycollection = await countryModel.getallContries();
        if (!countrycollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no countries available');
        responseObj = {"countrycollection" : countrycollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'countries retrived successfully');
        
    } catch (error) {
        message = "countries retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});

router.get('/getstates/:countryId',bodyParser,async function (req,res) {
    var message = "";
    var httpStatusCode = 500;
    var responseObj = {};
    var countryId = req.params.countryId;
    if (!countryId) return  await helperUtil.responseSender(res,'error',httpStatusCode,responseObj, 'requested params missing');
    try {
        const statecollection = await countryModel.getStatebyCountry(countryId);
        if (!statecollection) return  await helperUtil.responseSender(res,'error',400,responseObj, 'there is no states available');
        responseObj = {"statecollection" : statecollection};
        return await helperUtil.responseSender(res,'data',200,responseObj, 'states retrived successfully');
        
    } catch (error) {
        message = "states retrieved Failed.";
        responseObj = error;
        return await helperUtil.responseSender(res,'error',httpStatusCode, responseObj, message);
    }
});

module.exports =router;