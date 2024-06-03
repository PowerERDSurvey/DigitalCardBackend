const express = require("express");
var router = express.Router();
const userModel = require("../models/mvc_User");
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
const helperUtil = require('../util/helper.js');
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();


function userCreation(requestBody,response,res){
    userModel.create(requestBody, function(err, result){
        var httpStatusCode = 0;
        var responseObj = "";
        var message = "User created successfully.";
        if (err) {
            message = "User creation Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = {"status": httpStatusCode, "error" : responseObj, "message":message};
        } else {
            httpStatusCode = 200;
            responseObj = {ID:result.dataValues.id};
            
            response = {"status": httpStatusCode, "data" : responseObj, "message":message};
        }
        res.status(httpStatusCode).send(response);
    })
}

// create new user API 
router.post("/user",async function(req,res){
		
	const user = req.user;
    console.log("user"+req.FIRST_NAME);

	var moment = require('moment');
	var currentTime = moment().utc().valueOf();
	var requestBody = req.body;
    var encryptedString = null;
    if (requestBody.password) {
        encryptedString =cryptr.encrypt(requestBody.password);
    }
    
	requestBody.PASSWORD = encryptedString;
    console.log(requestBody);
	var response;
    var responseObj;
    await helperUtil.checkEmailValid(requestBody.email).then((isEmailValid)=>{//will return email id is valid or invalid

		if (!isEmailValid) {
            message = "Email Address already exist .";
			httpStatusCode = 400;
			responseObj = {"errorCode": 400};
            if (requestBody.type == 'GOOGLE_SSO') {
                message = "";
                httpStatusCode = 200; 
                response = {"status": httpStatusCode, "message":message};
			    res.status(httpStatusCode).send(response);
            }
			
			response = {"status": httpStatusCode, "error" : responseObj, "message":message};
			res.status(httpStatusCode).send(response);
		}else if (requestBody.type) {
            if (requestBody.type == 'GOOGLE_SSO') {
                requestBody.PASSWORD = null;
                userCreation(requestBody,response,res);
            }else{
                helperUtil.checkPasswordValid(requestBody.PASSWORD).then((isPasswordValid)=>{
                    if (!isPasswordValid) {
                        message = "Password Address already exist Or password Empty.";
                        httpStatusCode = 400;
                        responseObj = {"errorCode": 400};
                        response = {"status": httpStatusCode, "error" : responseObj, "message":message};
                        res.status(httpStatusCode).send(response);
                    }
                    else{
                        userCreation(requestBody,response,res);
                    }
                }).catch((err)=>{
                    message = "Password retrieved Failed.";
                    httpStatusCode = 500;
                    responseObj = err;
                    response = {"status": httpStatusCode, "error" : responseObj, "message":message};
                    res.status(httpStatusCode).send(response);
                })
            }
           
            
        }
        else{
            message = "signup type missing.";
			httpStatusCode = 400;
			responseObj = {"errorCode": 400};
			response = {"status": httpStatusCode, "error" : responseObj, "message":message};
			res.status(httpStatusCode).send(response);

            
        }
        }).catch((err)=>{
            message = "Email Addresses retrieved Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = {"status": httpStatusCode, "error" : responseObj, "message":message};
            res.status(httpStatusCode).send(response);
        });
});

// update user detail
router.put("/user/:ID",auth,bodyParser,function(req,res){
		
	var UserId = req.params.ID;
	var requestBody = req.body;
    console.log(req.body);
	var response;
    userModel.update(UserId,requestBody, function(err, result){
        var httpStatusCode = 0;
        var responseObj = "";
        var message = "User updates successfully.";
        if (err) {
            message = "User updation Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = {"status": httpStatusCode, "error" : responseObj, "message":message};
        } else {
            httpStatusCode = 200;
            responseObj = result.dataValues;
            response = {"status": httpStatusCode, "data" : responseObj, "message":message};
        }
        res.status(httpStatusCode).send(response);
    });
});

router.post("/user/:ID",auth,bodyParser,function(req,res){
    var UserId = req.params.ID;
	var response;
    userModel.getOneUser(UserId,function(err, result){
        var httpStatusCode = 0;
        var responseObj = "";
        var message = "User get successfully.";
        if (err) {
            message = "User get Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = {"status": httpStatusCode, "error" : responseObj, "message":message};
        } else {
            httpStatusCode = 200;
            responseObj = {"id":result.id,
            "firstName":result.firstName,
            "lastName":result.lastName,
            "email":result.email,
            "mobileNumber":result.mobileNumber,
            "companyName":result.companyName,
            "designation":result.designation,
            "whatsapp":result.whatsapp,
            "facebook":result.facebook,
            "instagram":result.instagram,
            "linkedin":result.linkedin,
            "website":result.website,
            "city":result.city,
            "zipCode":result.zipCode,
            "country":result.country,
            "state":result.state,
          };
            response = {"status": httpStatusCode, "data" : responseObj, "message":message};
        }
        res.status(httpStatusCode).send(response);
    });
    getOneUser
});

module.exports = router;