const express = require('express');

const router = express.Router();

const EventController = require('../controller/event')

router.route('/').post(EventController.createEvent).get(EventController.getAllEvents);
router.route('/:eventId').put(EventController.updateEvent).delete(EventController.deleteEvent).get(EventController.getSingleEvent)

module.exports = router;