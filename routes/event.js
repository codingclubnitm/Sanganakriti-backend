const express = require('express');

const router = express.Router();

const EventController = require('../controller/event');
const { protect, authorize } = require('../middleware/auth');
const singleUpload = require('../middleware/multer');

router.route('/').post(protect, authorize('ADMIN', 'TEAM_MEMBER'), singleUpload, EventController.createEvent).get(EventController.getAllEvents);
router.route('/:eventId').put(protect, authorize('ADMIN', 'TEAM_MEMBER'), EventController.updateEvent).delete(protect, authorize('ADMIN', 'TEAM_MEMBER'), EventController.deleteEvent).get(EventController.getSingleEvent)

module.exports = router;