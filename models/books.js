const mongoose=require('mongoose');
const path=require('path');
const coverImageBasePath='uploads/bookCovers';

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    publishDate:{
        type:Date,
        required:true
    },
    pageCount:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    coverImageName:{
        type:String,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Author'
    },
    description:{
        type:String,
        required:true
    }
})
bookSchema.virtual('coverImagePath').get(function(){                    //Dung tao mot property moi là coverImagePath
    if(this.coverImageName!=null){
        return path.join('/',coverImageBasePath,this.coverImageName);
    }
})

module.exports=mongoose.model('book',bookSchema,'books');
module.exports.coverImageBasePath=coverImageBasePath;