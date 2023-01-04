const { uploadImages, listImages } = require('../controllers/uploadController');
const { authUser } = require('../middleware/auth');
const imageUpload = require('../middleware/imageUpload');
const router = require('express').Router();

router.post('/imageUpload',authUser ,imageUpload, uploadImages)
router.post('/listImages',listImages)
module.exports = router