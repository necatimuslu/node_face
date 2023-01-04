const mongoose = require('mongoose');

const emojiSchema = mongoose.Schema({
    emoji:{
        type:String,
        enum:["like","love","haha","sad","angry","wow"],
        required:true
    },
    postRef:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },
    emojiBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});

exports.Emoji = mongoose.model('emoji',emojiSchema);