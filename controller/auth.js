const User = require("../models/User");
const AsyncHandler = require("../middleware/async");
const ErrorHandler = require("../middleware/error");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");

// @desc      Create user
// @route     POST /api/v1/auth/register
// @access    Private (Admin and Team Member)
exports.createUser = AsyncHandler(async (req, res, next) => {
  const { name, email, password, role, avatar, designation, department } =
    req.body;

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exist",
    });
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a avatar`, 400));
  }

  const file = req.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image  file`, 400));
  }

  const fileUri = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  req.body.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  user = await User.create(req.body); 

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user
      });
  };