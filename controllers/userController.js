const { textValidation, emailValidation, createUsername } = require('../helpers/validation');
const { User } = require('../models/user');
const { Post } = require('../models/post');
const bcrjypt  = require('bcryptjs');
const { createToken } = require('../helpers/token');
const { sendEmail, sendCodeEmail } = require('../helpers/email');
const jwt = require('jsonwebtoken');
const { Code } = require('../models/code');
const generateCode = require('../helpers/generateCode');
exports.registerUser = async(req,res) => {
    try {
        const { first_name,last_name,email,password,username,bYear,bMonth,bDay,gender} = req.body;
        
        const hashPassword = bcrjypt.hashSync(password,12);
        

        if(emailValidation(email)){
            return res.status(400).json({message:"Lütfen geçerli email giriniz."});
        } 
         if(!textValidation(first_name,3,12)){
            return res.status(400).json({message:"Kullanıcı adı en az 3 en fazla 12 karekter olmalıdır."});
        }
        if(!textValidation(last_name,3,12)){
            return res.status(400).json({message:"Kullanıcı soyadı en az 3 en fazla 12 karekter olmalıdır."});
        }

        if(!textValidation(password,6,30)){
            return res.status(400).json({message:"Şifre  en az 6 en fazla 30 karekter olmalıdır."});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Bu email sistemde kayıtlıdır"});
        }
        const tempUsername = first_name + last_name;
        let newUsername = await createUsername(tempUsername);
        
        let userDB = await new User({
            first_name,last_name,email,password:hashPassword,username:newUsername,bYear,bMonth,bDay,gender
        }).save()

        const urlToken = createToken({id:userDB?._id},"30m");
        
        /* const url = `${process.env.BASE_URL}/active/${urlToken}`;

        sendEmail(userDB.email,userDB.first_name,url); */
        const token = createToken({id:userDB?._id},"1d")
        res.send({
            first_name:userDB.first_name,
            last_name:userDB.last_name,
            username:newUsername,
            picture:userDB?.picture,
            bYear:userDB.bYear,
            bMonth:userDB.bMonth,
            bDay:userDB.bDay,
            gender:userDB.gender,
            verified:userDB.verified,
            token,
            id:userDB._id,
            message:'Kullanıcı kayıt işlemi başarılı.'
        })

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.activeEmailAccount = async (req,res) => {
    try {
        const activeUser = req.user.id;
        
        const {token} = req.body;

    const user = jwt.verify(token,process.env.SECRET_KEY);

    const check = await User.findById(user.id);

    if(activeUser !== user.id){
        return res.status(400).json({message:'Hesap onaylama geçersiz.'});
    }
   

    if(check.verified == true){
        return res.status(400).json({message:'Email adresi daha önce kayıt edilmiş'});
    }else {
        await User.findByIdAndUpdate(user.id,{verified:true},{new:true})
        return res.json(200).json({message:'Hesap başarılı aktif edildi.'})
    }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }

}

exports.loginUser = async (req,res) => {
    try {
       const {email,password} = req.body;
       
       const user = await User.findOne({email});

       if(!user){
        return res.status(400).json({message:'Kullanıcı bulunamadı.'})
       }
       if(user && bcrjypt.compareSync(password,user.password)){
        const token = createToken({id:user._id},"30m");

        res.send({
            first_name:user.first_name,
            last_name:user.last_name,
            username:user.username,
            bYear:user.bYear,
            bMonth:user.bMonth,
            bDay:user.bDay,
            gender:user.gender,
            verified:user.verified,
            picture:user?.picture,
            token,
            message:'Giriş başarılı.',
            id:user._id
        })
       }
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
exports.sendActiveEmail = async (req,res)=> {
    try {
        const id = req.user.id;
        const user = await User.findById(id);

        if(user.verified == true){
            return res.status(400).json({message:'Bu hesap onaylı.'})
        }
        const token = createToken({id:user._id},"30m");

        const url = `${process.env.BASE_URL}/active/${token}`;

        sendEmail(user.email,user.first_name,url);
        return res.status(200).json({message:'Hesap onaylama linki email adresinize gönderilmiştir.'})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.findByUserEmail = async (req,res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email}).select('-password');

        if(!user){
            return res.status(400).json({message:'Hesap bulunamadı.'})
        }
        res.status(200).send({
           first_name:user?.first_name,
           last_name:user?.last_name,
            picture:user?.picture,
            email:user?.email,
           
            ok:true,
        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

exports.sendResetPasswordCode = async (req,res) => {
    try {
        const { email } = req.body;
       
        const user = await User.findOne({email}).select('-password');
        
        await Code.findOneAndDelete({user:user._id});
        let code = generateCode(5);
        let newCode = await new Code({code,user:user._id}).save();
        
        sendCodeEmail(user?.email,user?.first_name,code);
        return res.status(200).json({message:'Resetleme kodu email adresinize iletilmiştir.'});
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

exports.resetCodeSuccess = async (req,res) => {
    try {
        const {email,code} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Kullanıcı bulunamadı.'})
        }
        const codeDB = await Code.findOne({user:user._id});
        if(codeDB.code !== code){
            return res.status(400).json({message:'Girilen kod uyumsuzdur.'})
        }
        return res.status(200).json({ok:true})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.resetPassword = async (req,res) => {
    try {
        const {email,password,conf_password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Kullanıcı bulunamadı.'})
        }
        if(password !== conf_password){
            return res.status(400).json({message:'Şifreler eşleşmiyor.'})
        }
        const newPassword = bcrjypt.hashSync(password,10);
        await User.findByIdAndUpdate(user._id,{password:newPassword},{new:true});
        return res.status(200).json({message:'Şifre değişikliği başarılı şekilde gerçekleşti.'})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

exports.getProfile = async (req,res) => {
    try {
        const { username } = req.params;

        const user = await User.findById(req.user.id);
        const profile = await User.findOne({username}).populate('-password');
        const friendship = {
            friends:false,
            following:false,
            requestSent:false,
            requestReceived:false
        }
        if(!profile && profile === null){
            
            return res.json({ok:false});
        }
       if(user.friends.includes(profile._id) && profile.friends.includes(user._id)){
        friendship.friends = true;
       }
       if(user.following.includes(profile._id)){
        friendship.following = true;
       }
       if(user.requests.includes(profile._id)){
        friendship.requestReceived = true;
       }
       if(profile.requests.includes(user._id)){
        friendship.requestSent = true;
       }
        const posts = await Post.find({user:profile._id}).populate('user').sort({createdAt:-1});
        
        res.json({
            ...profile.toObject(),
            posts,
            friendship
        });
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.updateDetail = async(req,res) => {
    try {
        const {intro} = req.body;
        let updateUser = await User.findByIdAndUpdate(req.user.id,{details:intro},{new:true});
      
        res.json(updateUser);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.updateProfilePicture = async (req,res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id,{picture:url},{new:true});
        res.json(url);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
exports.updateCoverPicture = async (req,res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id,{cover:url},{new:true});
        res.json(url);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
exports.sendFriendRequest = async (req,res) => {
    try {
       if(req.user.id !== req.params.id){
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            if(!receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id) ){
                await receiver.updateOne({
                    $push:{requests:sender._id}
                });
                await receiver.updateOne({
                    $push:{followers:sender._id}
                });
                await sender.updateOne({
                    $push:{following:sender._id}
                });
                res.json({message:'Arkadaşlık isteği gönderildi'});
            }else {
                return res.status(400).json({message:'Önceden istek gönderildi'})
            }
       }else {
        return res.status(400).json({message:'hatalı işlem'})
       }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
exports.cancelFriendRequest = async (req,res) => {
    try {
       if(req.user.id !== req.params.id){
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            if(receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id) ){
                await receiver.updateOne({
                    $pull:{requests:sender._id}
                });
                await receiver.updateOne({
                    $pull:{followers:sender._id}
                });
                await sender.updateOne({
                    $pull:{following:sender._id}
                });
                res.json({message:'Arkadaşlık isteği iptal edildi'});
            }else {
                return res.status(400).json({message:'Önceden istek gönderildi'})
            }
       }else {
        return res.status(400).json({message:'hatalı işlem'})
       }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.follow = async (req,res) => {
    try {
        if(req.user.id !== req.params.id){
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            if(!receiver.followers.includes(sender._id)  && !sender.following.includes(receiver._id)){
                await receiver.updateOne({
                    $push:{followers:sender._id}
                })
                await sender.updateOne({
                    $push:{following:receiver._id}
                })
            }else {
                return res.status(400).json({message:'Önceden takip edildi'})
            }
        }else {
            return res.status(400).json({message:'hatalı işlem'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
exports.unfollow = async (req,res) => {
    try {
        if(req.user.id !== req.params.id){
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            if(receiver.followers.includes(sender._id)  && sender.following.includes(receiver._id)){
                await receiver.updateOne({
                    $pull:{followers:sender._id}
                })
                await sender.updateOne({
                    $pull:{following:receiver._id}
                })
            }else {
                return res.status(400).json({message:'Önceden takip bırakıldı'})
            }
        }else {
            return res.status(400).json({message:'hatalı işlem'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.acceptRequest = async (req,res) => {
    try {
        if(req.user.id !== req.params.id){
            const receiver = await User.findById(req.user.id);
            const sender = await User.findById(req.params.id);

            if(!receiver.requests.includes(sender._id)){
                await receiver.update({
                    $push:{friends:sender._id, following:sender._id}
                });
                await sender.update({
                    $push:{friends:receiver._id, followers:receiver._id}
                })
                await receiver.updateOne({
                    $pull:{requests:sender._id}
                })
            }else {
                return res.status(400).json({message:'hatalı işlem'})
            }
        }else {
            return res.status(400).json({message:'hatalı işlem'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.unfriend = async (req,res) => {
    try {
        if(req.user.id !== req.params.id){
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            if(receiver.friends.includes(sender._id) && sender.friends.includes(receiver._id)){
                await receiver.update({
                    $pull:{friends:sender._id, following:sender._id,followers:sender._id}
                });
               
                await sender.updateOne({
                    $pull:{friends:receiver._id,following:receiver._id,followers:receiver._id}
                })
            }else {
                return res.status(400).json({message:'hatalı işlem'})
            }
        }else {
            return res.status(400).json({message:'hatalı işlem'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

exports.deleteRequest = async(req,res) => {
    try {
        if(req.user.id !== req.params.id){
            const receiver = await User.findById(req.user.id);
            const sender = await User.findById(req.params.id);

            if(receiver.requests.includes(sender._id) ){
                await receiver.update({
                    $pull:{requests:sender._id, followers:sender._id}
                });
               
                await sender.updateOne({
                    $pull:{following:receiver._id}
                })
            }else {
                return res.status(400).json({message:'hatalı işlem'})
            }
        }else {
            return res.status(400).json({message:'hatalı işlem'})
        }
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}