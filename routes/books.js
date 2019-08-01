const express=require('express');
const router=express.Router();
const path=require('path');
const Book=require('../models/books');
const Author=require('../models/authors');
const fs=require('fs');



//Upload file images
//const uploadpath=path.join('public',Book.coverImageBasePath);
const imageMimeTypes=['image/jpeg','image/png','image/gif','images/jpg']   //Loai Anh
/*const multer=require('multer');             //Upload file
var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadpath);
    },
    
})
var upload=multer({
    storage:storage
});
*/


router.route('/').get( async (req,res)=>{
    //Search option
    let querys=await Book.find({});
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

// Use upload with multer above to upload file
// Create a new book
router.post('/new',async(req,res)=>{
    //const filename=req.file!=null?req.file.originalname:null;
    try{
        const book=new Book({
            title:req.body.title,
            author:req.body.author,
            publishDate:new Date(req.body.publishDate),
            pageCount:req.body.pageCount,
            description:req.body.description
        });
        saveCover(book,req.body.cover)
        book.save((err)=>{
            if(err)console.log(err);
            else res.redirect('/books');
        })
    }catch{
        console.log('Wrong');
        renderNewPage(res,book,true);
    }
});

async function renderNewPage(res,book,hasError = false){
    renderFormPage(res,book,'new',hasError);
}

//Detail book
router.route('/:id').get( async(req,res)=>{
    try{
        const book=await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show',{
            books:book,
        })
    }
    catch{
        res.send('Không Có');
    }
});
//Edit Book
router.route('/edit/:id').get(async (req,res)=>{
    try{
        const book=await Book.findById(req.params.id);
        renderEditPage(res,book);
    }catch{
        res.redirect('/');
    }
});
async function renderEditPage(res,book,hasError = false){
    renderFormPage(res,book,'edit',hasError);
}
async function renderFormPage(res,book,form,hasError = false){
    try{
        const author=await Author.find({});
        const params={
            authors:author,
            book:book,
        };
        if(hasError) params.errorMessage='Error When Edit Book';
        res.render(`books/${form}`,params);
    }catch{
        res.redirect('/books');
    }
}

//Update book
router.put('/:id',async(req,res)=>{
    //const filename=req.file!=null?req.file.originalname:null;
    let book;
    try{
        book=await Book.findById(req.params.id);
        book.title=req.body.title;
        book.author=req.body.author;
        book.publishDate=new Date(req.body.publishDate);
        book.pageCount=req.body.pageCount;
        book.title=req.body.title;
        book.description=req.body.description;
        if(req.body.cover!=null &&req.body.cover!='')
            saveCover(book,req.body.cover)
        await book.save();
        res.redirect(`/books/${book.id}`)
    }catch{
        if(book!=null){
            renderEditPage(res,book);
        }
        else{
            res.redirect('/');
        }
    }
});
//Delete book
router.route('/:id').delete( async(req,res)=>{
    let book;
    try{
        book=await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books')
    }catch{
        if(book==null){
            res.redirect('/');
        }
        else{
            res.redirect(`/books/${book.id}`);
        }
    }
});
//Check data of Image
function saveCover(book,coverEncoded){
    if(coverEncoded==null)return
    const cover=JSON.parse(coverEncoded);
    if(cover!=null&&imageMimeTypes.includes(cover.type)){
        book.coverImage=new Buffer.from(cover.data,'base64');
        book.coverImageType=cover.type;
    }
}
module.exports=router;