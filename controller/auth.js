const User = require("../models/User");
const AsyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");

// @desc      Create user
// @route     POST /api/v1/auth/register
// @access    Private (Admin and Team Member)
exports.createUser = AsyncHandler(async (req, res, next) => {
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

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "SanganaKriti_User",
  });

  req.body.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
});

// @desc      Login a user
// @route     POST /api/v1/auth/login
// @access    Public
exports.loginUser = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logoutUser = AsyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    user: {},
  });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = AsyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
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

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
