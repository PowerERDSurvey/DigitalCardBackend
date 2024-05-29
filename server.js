const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
// const config = require('./config/dbConfig');
const port = process.env.PORT || 8080;

var corsoption ={
    origin : 'http://localhost:8081'
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



app.listen(port,()=>{
console.log(`post running with ${port}`);
})