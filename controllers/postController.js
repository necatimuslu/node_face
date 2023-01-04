const { Post } = require("../models/post");


exports.createPost = async (req,res) => {
    try {
        let post = await new Post(req.body).save();

        res.json(post);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.getAllPosts = async (req,res) => {
    try {
        const posts = await Post.find().populate('user').sort({createdAt:-1});
        res.json(posts);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.newComment = async (req,res) => {
    try {
        const {comment,image,postId} = req.body;
       
        let newComments = await Post.findByIdAndUpdate(postId,{
            $push:{
                comments:{
                    comment,
                    image,
                    commentBy:req.user.id
                }
            }
        }, {
            new:true
        }).populate('comments.commentBy','picture first_name last_name username');
       
        res.json(newComments.comments)
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}