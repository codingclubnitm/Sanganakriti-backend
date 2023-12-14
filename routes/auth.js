const express = require('express');
const { createUser, loginUser } = require('../controller/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();

router.route('/register').post(singleUpload, createUser);
router.route('/login').post(loginUser)

module.exports = router;