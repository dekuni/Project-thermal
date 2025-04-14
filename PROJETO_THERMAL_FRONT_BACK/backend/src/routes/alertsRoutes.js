// backend/src/routes/alertsRoutes.js
const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alertsController');

router.get('/', alertsController.getAlerts);
router.get('/:id', alertsController.getAlertById);
router.post('/:id/resolve', alertsController.resolveAlert);
router.post('/clear', alertsController.clearAllAlerts);

module.exports = router;