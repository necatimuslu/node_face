const router = require('express').Router();

const { updateEmoji, getAllEmojis } = require('../controllers/emojiController');
const { createPost, getAllPosts, newComment } = require('../controllers/postController');
const { authUser } = require('../middleware/auth');
router.post('/createPost',createPost);
router.get('/getAllPosts',getAllPosts);
router.put('/updateEmoji',authUser,updateEmoji);
router.get('/getAllEmojis/:id',authUser,getAllEmojis);
router.put('/newComment',authUser,newComment);
module.exports = router;