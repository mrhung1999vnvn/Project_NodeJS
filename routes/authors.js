const express=require('express');
const router=express.Router();
const Author=require('../models/authors');      //Schema 
const Book=require('../models/books');

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
        res.redirect(`authors/${newAuthor.id}`);
    }
    catch{
        res.render('authors/new',{
            author:author,
            errorMessage:'Error Creating Author'
        })
    }
});

router.route('/:id').get( async(req,res)=>{
    let author,books;
    try{
        author=await Author.findById(req.params.id);
        books= await Book.find({author:author.id}).limit(6).exec();
        res.render('authors/show',{
            booksByAuthor:books,
            author:author
        });
    }
    catch(err){
        console.log(err);
        res.redirect('/');
    }
});

//Edit author
router.put('/:id',async (req,res)=>{
    let author;
    try{
        author=await Author.findById(req.params.id);
        author.name=req.body.Name;
        await author.save();
        res.redirect(`/authors`);
    }catch{
        if(author==null){
            res.redirect('/');
        }else{
            res.render('authors/edit',{
                author:author,
                errorMessage:'Error updating Author'
            });
        }
    }
});

//Delete User
router.delete('/:id', async (req,res)=>{
    let author;
    try{
        author=await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    }
    catch{
        if(author==null){
            res.redirect('/');
        }
        else{
            res.redirect(`/authors/${author.id}`);
        }
    }
});

//Render to page edit
router.route('/edit/:id').get( async(req,res)=>{
    let author;
    try{
        author=await Author.findById(req.params.id);
        res.render('authors/edit',{
            author: author
        })
    }catch{
        res.redirect('/');
    }
});

module.exports=router;