const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    type:{
        type:String,
        enum:['profilePicture','cover',null],
        default:null
    },
    text:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    images:{
        type:Array
    },
    background:{
        type:String
    },
    comments:[
        {
            comment:{
                type:String
            },
            image:{
                type:String
            },
            commentBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            commentAt:{
                type:Date,
                default: new Date()
            }
        }
    ]
},{timestamps:true});

exports.Post = mongoose.model('post',postSchema);