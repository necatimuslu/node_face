const mongoose = require('mongoose');

const codeSchema = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});

exports.Code = mongoose.model('code',codeSchema);