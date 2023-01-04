const router = require('express').Router();

const { registerUser, activeEmailAccount, loginUser, sendActiveEmail,findByUserEmail,sendResetPasswordCode,resetCodeSuccess , resetPassword, getProfile,updateDetail,updateProfilePicture,updateCoverPicture, sendFriendRequest, cancelFriendRequest, follow, unfollow, acceptRequest, unfriend, deleteRequest} = require('../controllers/userController');
const { authUser } = require('../middleware/auth');


router.post('/register',registerUser);
router.post('/activate',authUser, activeEmailAccount);
router.post('/login',loginUser);
router.post('/sendVerification',authUser,sendActiveEmail);
router.post('/findByUserEmail',findByUserEmail);
router.post('/sendResetPasswordCode',sendResetPasswordCode);
router.post('/resetCodeSuccess',resetCodeSuccess);
router.post('/resetPassword',resetPassword);
router.get('/getProfile/:username',authUser, getProfile);
router.put('/updateDetail',authUser,updateDetail);
router.put('/updateProfilePicture',authUser,updateProfilePicture);
router.put('/updateCoverPicture',authUser,updateCoverPicture);
router.put('/sendFriendRequest/:id',authUser,sendFriendRequest);
router.put('/cancelFriendRequest/:id',authUser,cancelFriendRequest);
router.put('/follow/:id',authUser,follow);
router.put('/unfollow/:id',authUser,unfollow);
router.put('/acceptRequest/:id',authUser,acceptRequest);
router.put('/unfriend/:id',authUser,unfriend);
router.put('/deleteRequest/:id',authUser,deleteRequest);
module.exports = router;