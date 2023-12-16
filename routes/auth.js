const express = require('express');
const { createUser, loginUser, logoutUser, getMe } = require('../controller/auth');
const { protect } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();

router.route('/register').post(singleUpload, createUser);
router.route('/login').post(loginUser)
router.route('/logout').get(protect, logoutUser);
router.route('/me').get(protect, getMe);

module.exports = router;