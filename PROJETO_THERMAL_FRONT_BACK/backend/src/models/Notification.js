// backend/src/models/Notification.js
const { notifications } = require('../data/mockData');

class Notification {
  static getAll() {
    return notifications;
  }

  static add(notification) {
    notifications.push(notification);
  }

  static clear() {
    notifications.length = 0;
  }
}

module.exports = Notification;