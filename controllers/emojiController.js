const { Emoji } = require("../models/emoji");
const mongoose = require('mongoose');
exports.updateEmoji = async (req,res) => {
    try {
        const { postId,emoji} = req.body;
        const check = await Emoji.findOne({
            postRef:postId,
            emojiBy:req.user.id 
        });
        if(check === null){
             await new Emoji({
                postRef:postId,
                emoji,
                emojiBy:req.user.id
            }).save();
        }else {
           if(check.emoji === emoji){
            await Emoji.findByIdAndRemove(check._id)
           }else {
            await Emoji.findByIdAndUpdate(check._id,{emoji})
           }
        }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.getAllEmojis = async (req,res) => {
    try {
        const emojiArray = await Emoji.find({
            postRef:req.params.id
        });
       /*  const check1 = emojiArray.find((x)=> x.emojiBy.toString() === req.user.id)?.emoji */
        const check = await Emoji.findOne({
            postRef:req.params.id,
            emojiBy:req.user.id
        });
        const newEmoji = emojiArray.reduce((group,emoji)=> {
           let key = emoji["emoji"];
           group[key] = group[key] || [];
            group[key].push(emoji);
            return group;

        },{});

        const reacts = [
            {emoji:"like",count:newEmoji?.like?.length ? newEmoji.like.length : 0},
            {emoji:"haha",count:newEmoji?.haha?.length ? newEmoji.haha.length : 0},
            {emoji:"wow",count:newEmoji?.wow?.length ? newEmoji.wow.length : 0},
            {emoji:"sad",count:newEmoji?.sad?.length ? newEmoji.sad.length : 0},
            {emoji:"angry",count:newEmoji?.angry?.length ? newEmoji.angry.length : 0},
            {emoji:"love",count:newEmoji?.love?.length ? newEmoji.love.length : 0},
        ]
        
        res.json({
            reacts,
            check:check?.emoji
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}