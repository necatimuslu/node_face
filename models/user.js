const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name:{
        type:String,
        required:[true,'Ad girilmesi zorunludur.'],
        trim:true,
        text:true
    },
    last_name:{
        type:String,
        required:[true,'Soyad girilmesi zorunludur.'],
        trim:true,
        text:true
    },
    username:{
        type:String,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,'Şifre girilmesi zorunludur.'], 
    },
    email:{
        type:String,
        required:[true,'Email girilmesi zorunludur.']
    },
    bYear:{
        type:Number,
        required:[true,'Yıl girilmesi zorunludur.']
    },
    bMonth:{
        type:Number,
        required:[true,'Ay girilmesi zorunludur.']
    },
    bDay:{
        type:Number,
        required:[true,'Gün girilmesi zorunludur.']
    },
    gender:{
        type:String,
        required:[true,'Cinsiyet girilmesi zorunludur.'],
        trim:true
    },
    picture:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
    },
    cover:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    requests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    search:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    details:{
        bio:{
            type:String,
            default:''
        },
        otherName:{
            type:String,
            default:''
        },
        job:{
            type:String,
            default:''
        },
        workplace:{
            type:String,
            default:''
        },
        highSchool:{
            type:String,
            default:''
        },
        collage:{
            type:String,
            default:''
        },
        currentCity:{
            type:String,
            default:''
        },
        hometown:{
            type:String,
            default:''
        },
        releationship:{
            type:String,
            enum:['Evli','Bekar','Nişanlı'],
            default:'Bekar'
        },
        instagram:{
            type:String,
            default:''
        }

    },
    savedPosts:[
        {
            post:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'post'
            },
            savedAt:{
                type:Date,
                default:new Date()
            }
        }
    ]
}, {timestamps:true});

exports.User = mongoose.model('user',userSchema);