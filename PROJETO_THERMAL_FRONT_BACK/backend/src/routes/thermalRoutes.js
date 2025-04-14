const express = require('express');
const router = express.Router();
const thermalController = require('../controllers/thermalController');

router.get('/status', thermalController.getThermalStatus);
router.get('/history/:seconds?', thermalController.getThermalHistory);

module.exports = router;