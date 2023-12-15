const Event = require('../models/Event')
const AsyncHandler = require('../middleware/async.js')


  // @desc      Create Event
  // @route     POST /api/v1/event
  // @access    Private(Admin and Team Member)
exports.createEvent = AsyncHandler(async(req,res,next) => {

    let event = await Event.create({
        name: req.body.name,
        description:req.body.description,
        leader:req.body.leader,
    })

    res.status(200).json({
        success: true,
        event
    })

})

  // @desc      Update Event
  // @route     PUT /api/v1/event/:eventId
  // @access    Private(Admin and Team Member)
exports.updateEvent = AsyncHandler(async(req,res,next) => {
    //Update the event

})

  // @desc      Delete Event
  // @route     DELETE /api/v1/event/:eventId
  // @access    Private(Admin and Team Member)
exports.deleteEvent = AsyncHandler(async(req,res,next) => {
   //Delete any event

})

  // @desc      Get All Event
  // @route     GET /api/v1/event/:eventId
  // @access    Public
exports.getAllEvents = AsyncHandler(async(req,res,next) => {
  try {
    const event = await Event.find();
    res.status(200)
      .json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
})

  // @desc      Get Single Event
  // @route     GET /api/v1/event/:eventId
  // @access    Public
exports.getSingleEvent = AsyncHandler(async(req,res,next) => {
  try {
    const event = await Event.findById(req.params.id);
    res.status(200)
      .json({ success: true, data: event });
  } catch (err) {
       next(err);
  }
})




