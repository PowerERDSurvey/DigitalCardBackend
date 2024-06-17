const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
var path = require('path');
global.__basedir = __dirname ;
var multer = require('multer');
var uploadFile = multer({dest:'./uploads/'});
const config = require('./config/config.js');
const port = process.env.PORT || 8080;

const auth = require('./middleware/auth.js');
const userModel = require("./models/mvc_User");
const helperUtil = require('./util/helper.js');

const upload = require('./middleware/upload.js');
// var bodyParser = require('body-parser').json();

var corsoption ={
    origin : 'http://localhost:3000'
}
const app=express();


// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(__dirname + "/public"));
console.log(__dirname,'DIR')
// app.use(function(req, res, next) {
//     if (req.get('x-amz-sns-message-type')) {
//         req.headers['content-type'] = 'application/json';
//     }
//     next();
// });

//midleware

app.use(cors(corsoption));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

//app.use(uploadOne.array()); 
// app.use(uploadFile.any()); 
//testing

// app.get('/contact',(req,res)=>{
//     res.send("get all contact");
// })

var User = require("./controllers/user.js");
console.log(User);
app.use("/",User);

// app.use();

app.put("/user/:ID",auth,upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), function (req, res) {

   

    var UserId = req.params.ID;
    // var requestBody =  req.body;
    var requestBody =  {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        primaryEmail: req.body.primaryEmail,
        SecondryEmail: req.body.SecondryEmail,
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
        department: req.body.department
      };
    console.log(req.body);
    var response;
    
    userModel.update(UserId, requestBody, async function (err, result) {
        var httpStatusCode = 0;
        var responseObj = "";
        var message = "User updates successfully.";
        if (err) {
            message = "User updation Failed.";
            httpStatusCode = 500;
            responseObj = err;
            response = { "status": httpStatusCode, "error": responseObj, "message": message };
        } else {
           
            if (req.files) {
                // const imageUpload = helperUtil.
                try {
                    const images = await helperUtil.uplaodUserImage(UserId, req.files);
                    if (images) {
                        httpStatusCode = 200;
                        responseObj = result.dataValues;
                        responseObj.images = images;
                        response = { "status": httpStatusCode, "data": responseObj, "message": message };
                    } else {
                        httpStatusCode = 400;
                        response = { "status": httpStatusCode, "message": "Image upload failed" };
                    }
                    return res.status(httpStatusCode).json(response);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            } else {
                httpStatusCode = 200;
                responseObj = result.dataValues;
                response = { "status": httpStatusCode, "data": responseObj, "message": message };
            }
            
            
        }
        return res.status(httpStatusCode).send(response);
    });
});


var authenticateController=require('./controllers/authenticate');

app.post('/api/authenticate',authenticateController.authenticate);

let server;

if (require.main === module) {
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = {
    app,
    start: () => {
        return new Promise((resolve, reject) => {
            server = app.listen(port, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Server running on port ${port}`);
                    resolve(server);
                }
            });
        });
    },
    stop: () => {
        return new Promise((resolve, reject) => {
            if (server) {
                server.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
};

// const express = require("express");
// const meth = require("method-override");
// const bodyParser = require("body-parser");
// const app = express();
// const upload = require('./middleware/upload');
// const exphbs = require("express-handlebars");
// var cors = require('cors')
// require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');
// app.use(cors());
// var multer = require('multer');
// var uploadFile = multer({dest:'./uploads/'});
// // require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// var morgan = require('morgan')
// var fs = require('fs')
// var morgan = require('morgan')
// var path = require('path')

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access'+ (new Date()).toISOString().slice(0,10)+'.log'), { flags: 'a' })

// // setup the logger
// app.use(morgan('combined', { immediate: false, stream: accessLogStream }));

// // environment variables
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// //process.env.NODE_ENV = 'testing';
// // process.env.NODE_ENV = 'staging';
// // process.env.NODE_ENV = 'staging';
// // process.env.NODE_ENV = 'production';
// // process.env.NODE_ENV = process.env.NODE_ENV || 'staging';

// // config variables
// const config = require('./config/config.js');

// const PORT = global.gConfig.node_port;

// app.use(express.static(__dirname + "/public"));
// console.log(__dirname,'DIR')
// app.use(function(req, res, next) {
//     // if (req.get('x-amz-sns-message-type')) {
//         req.headers['content-type'] = 'application/json';
//     // }
//     next();
// });

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// //app.use(uploadOne.array()); 
// app.use(uploadFile.any()); 


// //app.use(express.static('public'));
// //app.use(bodyParser.json());
// //app.get('/', function(req, res){
// //	res.render('form');
//  //});
 
//  //app.set('view engine', 'pug');
//  //app.set('views', './views');
 

// //  var productController = require("./controllers/product.js");
// // const productModel = require('./models/product.js');

// //app.post("/products/documents",uploadOne, function(req, res){
// const auth = require('./middleware/auth');
// var User = require("./controllers/user.js");
// console.log(User);
// app.use("/",User);



// app.listen(PORT,()=>{
// console.log(`post running with ${PORT}`);
// })