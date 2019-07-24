const express=require('express');
const router=express.Router();
const path=require('path');
const Book=require('../models/books');
const Author=require('../models/authors');
const fs=require('fs');



//Upload file images
const uploadpath=path.join('public',Book.coverImageBasePath);
const imageMimeTypes=['images/jpeg','image/png','images/gif','images/jpg']   //Loai duoi
const multer=require('multer');             //Upload file
var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadpath);
    }
})
var upload=multer({
    storage:storage
});

router.route('/').get( async (req,res)=>{
    //Search option
    let querys=Book.find();
    if(req.query.title!=null&&req.query.title!=''){
        querys=querys.regex('title',new RegExp(req.query.title,'i'));
    }
    
    //Lay Dieu Kien Date
    if(req.query.publishBefore!=null&&req.query.publishBefore!=''){
        querys=querys.lte('publishDate',req.query.publishBefore);
    }
    if(req.query.publishAfter!=null&&req.query.publishAfter!=''){
        querys=querys.lte('publishDate',req.query.publishAfter);
    }

    try{
        const books=await querys.exec();
        res.render('books/index',{
            books:books,
            searchOption:req.query
        })
    }catch{
        res.redirect('/');
    }
    
});

router.route('/new').get( async (req,res)=>{
    try{
        const authors=await Author.find({});
        const book=new Book();
        res.render('books/new',{
            authors:authors,
            book:book
        });
    }
    catch{
        res.send('Wrong');
    }
});


router.post('/new',upload.single('cover'),async(req,res)=>{
    const filename=req.file!=null?req.file.originalname:null;
    try{
        const book=new Book({
            title:req.body.title,
            author:req.body.author,
            publishDate:new Date(req.body.publishDate),
            pageCount:req.body.pageCount,
            coverImageName:filename,
            description:req.body.description
        });
        //var checkFile=path.join(,book.coverImageName)
        book.save((err)=>{
            if(err)console.log(err);
            else console.log('save');
        })
    }catch{
        if(book.coverImageName!=null){
            removeBookCover(filename);
        }
        console.log('Wrong');
        renderNewPage(res,book,true);
    }
});


function removeBookCover(filename){
    //console.log(fs.exists(path.join(uploadpath,filename)));
    try{
        if(fs.existsSync(path.join(uploadpath,filename))){
            fs.unlink(path.join(uploadpath,filename),err=>{
                if(err)console.error(err);
            })
        }
    }catch{
        console.log('wrong');
    }
}

async function renderNewPage(res,book,hasError = false){
    try{
        const author=await Author.find({});
        const params={
            authors:author,
            book:book,
        };
        if(hasError) params.errorMessage='Error Creating Book';
        res.render('books/new',params);
    }catch{
        res.redirect('/books');
    }
}
module.exports=router;