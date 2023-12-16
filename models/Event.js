const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please add an event name"],
      trim: true,
      maxlength: [60, "Event name cannot be more than 60 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [200, "Please summarize the description"],
    },
    leader: {
      type: String,
      required: [true, "Please add head name"],
      trim: true,
      maxlength: [60, "Name can not be more than 60 characters"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    date: {
      type: Date,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", EventSchema);
