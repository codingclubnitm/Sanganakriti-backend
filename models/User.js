const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    minLength: [4, "Name must be at least 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: process.env.USER,
    enum: [process.env.ADMIN, process.env.USER, process.env.TEAM_MEMBER],
  },
  designation: {
    type: String,
    default: "Student",
    enum: {
      values: [
        "Student",
        "Head",
        "Coordinator",
        "Convenor",
        "Co-Convenor",
        "Volunteer",
        "Faculty In-charge",
      ],
      message: "Enter valid designation name",
    },
  },
  department: {
    type: String,
    enum: {
      values: ["Web Development", "CP", "AI/ML", "Cyber Security", "GDSC"],
      message: "Enter valid department name",
    },
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
