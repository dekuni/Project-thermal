// backend/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  rtspUrl: process.env.RTSP_URL || 'rtsp://admin:Lotus@407@192.168.2.174/Streaming/channels/201',
};