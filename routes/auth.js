const express = require('express');
const { createUser } = require('../controller/auth');
const singleUpload = require('../middleware/multer');

const router = express.Router();

router.route('/register').post(singleUpload, createUser);

module.exports = router;