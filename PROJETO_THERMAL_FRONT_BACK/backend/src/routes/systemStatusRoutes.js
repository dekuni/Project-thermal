// backend/src/routes/systemStatusRoutes.js
const express = require('express');
const router = express.Router();
const systemStatusController = require('../controllers/systemStatusController');

router.get('/', systemStatusController.getSystemStatus);
router.get('/temperature', systemStatusController.getTemperatureData);
router.get('/temperature/current', systemStatusController.getCurrentTemperature);

module.exports = router;