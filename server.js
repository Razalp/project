const express =require('express');
const path=require('path');
const app=express();
const session=require('express-session');//section create
const { v4: uuidv4} = require('uuid');//uniform id
const port =process.env.PORT||3003;//port create 
const userRouter = require('./routes/userRouter');//import userRouter
const adminRouter = require('./routes/adminRouter');//import adminRouter

const nocache = require('nocache');//cache cleare


app.use(express.json())//from ile sathanm parcse cheyan 

app.use(express.urlencoded({extended:true}))//form ile 

app.use(nocache())

app.set('view engine','ejs');
//load static assets
app.use('/static',express.static('public'))
// app.set('views',path.join(__dirname,'views'))
app.use('/assets',express.static('public/assets'))
const mongoose=require('mongoose');
    mongoose.connect("mongodb://127.0.0.1:27017/sign").then(()=>{
    console.log("mongodb connected")
})
module.exports=mongoose.connection
app.use(session({
    secret:uuidv4(),//secrt nte ullil aavul section id and detiales
    reSave:false,
    saveUninitialized:true,
}))
app.use('/',userRouter)
app.use('/admin',adminRouter)
//home route    

app.listen(port,()=>{
    console.log(`server on http://localhost:${port}`);
})
//http://domain/login/