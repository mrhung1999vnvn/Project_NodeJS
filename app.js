//Set up for .env
if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}


const express=require('express');
const app=express();
const morgan=require('morgan');
const chalk=require('chalk');
const debug=require('debug')('app');
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const bodyParser=require('body-parser');

app.use(morgan('tiny'));
app.use(expressLayout);         //Static layout
//Set Engine
app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.set('layout','layouts/layout');            //Static for layout file

//Set static files
app.use(express.static(path.join(__dirname,'/public')));    //Set static cac file trong public
app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));     //Cac file trong css bootstrap
app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));       //Cac file js trong boostrap
app.use('/js',express.static(path.join(__dirname,'node_modules/jquery/dist')));             //Cac file cua js trong jquery
app.use(bodyParser.urlencoded({limit:'10mb', extended:false}));
app.use(bodyParser.json());

//Mogoose
const mongoose=require('mongoose');
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true
});
const db=mongoose.connection;
db.on('error',error=> console.error(error));
db.once('open',()=> console.log('Connected to MongoDB'));


//Route
const indexRoute=require('./routes/index');
const authors=require('./routes/authors');
const book=require('./routes/books');
app.use('/',indexRoute);
app.use('/authors',authors);
app.use('/books',book);


var port=process.env.PORT||3000;
app.listen(port,()=>{
    debug(`Connect with port ${chalk(port)}`);
});
