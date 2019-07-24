const express=require('express');
const router=express.Router();
const Author=require('../models/authors');      //Schema 


router.route('/').get(async (req,res)=>{
    let searchOption={};
    if(req.query.name!=null&&req.query.name!=''){
        searchOption.name=new RegExp(req.query.name,'i');
    }
    try{
        const authorss=await Author.find(searchOption);                 //Tim kiem trog database
        //console.log(authorss);
        res.render('authors/index',{authors:authorss,searchOption:req.query});
    }
    catch{
        res.redirect('/');
    }      
});
router.route('/new').get((req,res)=>{
    res.render('authors/new',{author:new Author});    //Schema khi new author
})

//Create new authors
router.route('/').post( async (req,res)=>{
    const author=new Author({
        name:req.body.Name
    });
    try{
        const newAuthor= author.save((err)=>{                      //Insert data
            if(err) console.error(err);
            else res.send("Create");
        });
        
    }
    catch{
        res.render('authors/new',{
            author:author,
            errorMessage:'Error Creating Author'
        })
    }
});

module.exports=router;