// backend/src/routes/streamRoutes.js
const express = require('express');
const router = express.Router();
const streamController = require('../controllers/streamController');

router.get('/status', streamController.getStreamStatus);
router.get('/start_stream', streamController.startStream);
router.get('/stop_stream', streamController.stopStream);

module.exports = router;