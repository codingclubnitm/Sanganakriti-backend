const mongoose = require("mongoose");
const validator = require("validator");

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
    default: 'Student',
    enum: ['Student', 'Head', 'Coordinator', 'Convenor', 'Co-Convenor', 'Volunteer', 'Faculty Incharge']
  },
  department: {
    type: String,
    enum: ['Web Development', 'CP', 'AI/ML', 'Cyber Security', 'GDSC']
  }
});

module.exports = mongoose.model('User', UserSchema);