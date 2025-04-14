// backend/src/utils/videoStream.js
const ffmpeg = require('fluent-ffmpeg');
const WebSocket = require('ws');
const { rtspUrl } = require('../../config/config');

let ffmpegProcess = null;
let clients = [];

const startStream = (wss) => {
  if (ffmpegProcess) return;

  ffmpegProcess = ffmpeg(rtspUrl)
    .inputOptions(['-rtsp_transport', 'tcp'])
    .outputOptions(['-f mjpeg', '-q:v 2'])
    .noAudio()
    .on('start', () => {
      console.log('Streaming iniciado');
    })
    .on('error', (err) => {
      console.error('Erro no streaming:', err.message);
      stopStream();
    });

  const stream = ffmpegProcess.pipe();

  stream.on('data', (chunk) => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chunk);
      }
    });
  });

  ffmpegProcess.on('end', () => {
    stopStream();
  });
};

const stopStream = () => {
  if (ffmpegProcess) {
    ffmpegProcess.kill('SIGKILL');
    ffmpegProcess = null;
    console.log('Streaming parado');
  }
};

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
    });
  });

  return wss;
};

module.exports = { startStream, stopStream, setupWebSocket };