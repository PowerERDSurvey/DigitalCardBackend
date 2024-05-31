const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
// const config = require('./config/dbConfig');
const config = require('./config/config.js');
const port = process.env.PORT || 8080;

var corsoption ={
    origin : 'http://localhost:3000'
}
const app=express();


app.use(express.static(__dirname + "/public"));
console.log(__dirname,'DIR')
app.use(function(req, res, next) {
    if (req.get('x-amz-sns-message-type')) {
        req.headers['content-type'] = 'application/json';
    }
    next();
});

//midleware

app.use(cors(corsoption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//testing

// app.get('/contact',(req,res)=>{
//     res.send("get all contact");
// })

var User = require("./controllers/user.js");
console.log(User);
app.use("/",User);

var authenticateController=require('./controllers/authenticate');

app.post('/api/authenticate',authenticateController.authenticate);



app.listen(port,()=>{
console.log(`post running with ${port}`);
})


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