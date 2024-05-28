const express=require("express");
const cors=require("cors");
const dotenv = require("dotenv").config();
const config = require('./config/dbConfig');
const port = process.env.PORT || 8080;

var corsoption ={
    origin : 'http://localhost:8081'
}
const app=express();

//midleware

app.use(cors(corsoption));
app.use(express.json());
app.use(express.urlencoded({extended :true }));

//testing

app.get('/contact',(req,res)=>{
    res.send("get all contact");
})

app.listen(port,()=>{
console.log(`post running with ${port}`);
})