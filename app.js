//Set up for .env
if(process.env.NODE_ENV !=='production'){
    require('dotenv').load();
}


const express=require('express');
const app=express();
const morgan=require('morgan');
const chalk=require('chalk');
const debug=require('debug')('app');
const path=require('path');
const expressLayout=require('express-ejs-layouts');

app.use(morgan('tiny'));
app.use(expressLayout);         //Static layout
//Set Engine
app.set('view engine','ejs');
app.set('views',__dirname + '\\views');
app.set('layout','layouts\\layout');            //Static for layout file

//Set static files
app.use(express.static(path.join(__dirname,'/public')));    //Set static cac file trong public
app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));     //Cac file trong css bootstrap
app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));       //Cac file js trong boostrap
app.use('/js',express.static(path.join(__dirname,'node_modules/jquery/dist')));             //Cac file cua js trong jquery


//Route
const indexRoute=require('./routes/index');
app.use('/',indexRoute);

//Mogoose
const mongoose=require('mongoose');
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
});
const {connection}=mongoose;
connection.on('error',err=> console.log(err));
connection.once('open',()=> console.log('Connected to MongoDB'));


var port=process.env.PORT||3000;
app.listen(port,()=>{
    debug(`Connect with port ${chalk(port)}`);
});
