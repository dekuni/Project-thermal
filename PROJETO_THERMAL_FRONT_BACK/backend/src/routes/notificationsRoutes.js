// backend/src/routes/notificationsRoutes.js
const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.get('/', notificationsController.getNotifications);
router.get('/notifications', notificationsController.getNotifications);
router.get('/system_status', notificationsController.getSystemStatus); // Nova rota
router.get('/graph_data', notificationsController.getGraphData); // Nova rota
router.get('/:id', notificationsController.getNotificationById);
router.post('/:id/read', notificationsController.markAsRead);
router.post('/clear', notificationsController.clearAll);
router.post('/clear_notifications', notificationsController.clearAll); // Alias para compatibilidade com API

module.exports = router;