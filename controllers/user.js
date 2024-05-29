const express = require("express");
var router = express.Router();
const userModel = require("../models/user.js");
const auth = require('../middleware/auth');
var bodyParser = require('body-parser').json();


// create new user API 
router.post("/user",auth, bodyParser,function(req,res){
		
	const user = req.user;
	var name = user.FIRST_NAME + " " + user.LAST_NAME;
	var moment = require('moment');
	var currentTime = moment().utc().valueOf();
	var requestBody = req.body;
	var response;
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
            responseObj = result.insertId;
            response = {"status": httpStatusCode, "data" : responseObj, "message":message};
        }
        res.status(httpStatusCode).send(response);
    });
});

module.exports = router;