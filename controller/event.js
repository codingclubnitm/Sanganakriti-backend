const Event = require("../models/Event");
const AsyncHandler = require("../middleware/async.js");
const ErrorResponse = require("../utils/errorResponse.js");

// @desc      Create Event
// @route     POST /api/v1/event
// @access    Private(Admin and Team Member)
exports.createEvent = AsyncHandler(async (req, res, next) => {
  let event = await Event.create({
    name: req.body.name,
    description: req.body.description,
    leader: req.body.leader,
  });

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
