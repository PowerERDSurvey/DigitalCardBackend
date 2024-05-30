const express = require("express");
var router = express.Router();
const userModel = require("../models/mvc_User");
var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');
const helperUtil = require('../util/helper.js');
const auth = require('../middleware/auth');
// var bodyParser = require('body-parser').json();


// create new user API 
router.post("/user",function(req,res){
		
	const user = req.user;
    console.log("user"+req.FIRST_NAME);

	var name = req.FIRST_NAME + " " + req.LAST_NAME;
	// var name = user.FIRST_NAME + " " + user.LAST_NAME;
    console.log("name"+name);
	var moment = require('moment');
	var currentTime = moment().utc().valueOf();
	var requestBody = req.body;
    var encryptedString = cryptr.encrypt(requestBody.password);
	requestBody.PASSWORD = encryptedString;
    console.log(requestBody);
	var response;
    var responseObj;
    helperUtil.checkEmailValid(requestBody.email).then((isEmailValid)=>{//will return email id is valid or invalid

		if (!isEmailValid) {
			message = "Email Address already exist.";
			httpStatusCode = 400;
			responseObj = {"errorCode": 400};
			response = {"status": httpStatusCode, "error" : responseObj, "message":message};
			res.status(httpStatusCode).send(response);
		}else{
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
                    responseObj = result.dataValues;
                    response = {"status": httpStatusCode, "data" : responseObj, "message":message};
                }
                res.status(httpStatusCode).send(response);
            })
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
router.put("/user",function(req,res){
		
	const user = req.user;
    console.log("user"+req.FIRST_NAME);
	var requestBody = req.body;
    console.log(req.body);
	var response;
    userModel.update(requestBody, function(err, result){
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

module.exports = router;