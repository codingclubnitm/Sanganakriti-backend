const Event = require("../models/Event");
const AsyncHandler = require("../middleware/async.js");
const ErrorResponse = require("../utils/errorResponse.js");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");

// @desc      Create Event
// @route     POST /api/v1/event
// @access    Private(Admin and Team Member)
exports.createEvent = AsyncHandler(async (req, res, next) => {
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

  let event = await Event.create(req.body);

  res.status(200).json({
    success: true,
    event,
  });
});

// @desc      Update Event
// @route     PUT /api/v1/event/:eventId
// @access    Private(Admin and Team Member)
exports.updateEvent = AsyncHandler(async (req, res, next) => {
  //Update the event
  const eventId = req.params.eventId;
  let event = await Event.findById(eventId);
  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${eventId}`, 404)
    );
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    event: updatedEvent,
  });
});

// @desc      Delete Event
// @route     DELETE /api/v1/event/:eventId
// @access    Private(Admin and Team Member)
exports.deleteEvent = AsyncHandler(async (req, res, next) => {
  // Delete any event
  const eventId = req.params.eventId;
  let event = await Event.findById(eventId);
  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${eventId}`, 404)
    );
  }

  const deletedEvent = await Event.findOneAndDelete(eventId);

  res.status(200).json({
    success: true,
    event: {},
  });
});

// @desc      Get All Event
// @route     GET /api/v1/event/:eventId
// @access    Public
exports.getAllEvents = AsyncHandler(async (req, res, next) => {
  const event = await Event.find();
  res.status(200).json({ success: true, events: event });
});

// @desc      Get Single Event
// @route     GET /api/v1/event/:eventId
// @access    Public
exports.getSingleEvent = AsyncHandler(async (req, res, next) => {
  const eventId = req.params.eventId;
  let event = await Event.findById(eventId);
  if (!event) {
    return next(
      new ErrorResponse(`No event found with the id of ${eventId}`, 404)
    );
  }
  res.status(200).json({ success: true, event: event });
});
