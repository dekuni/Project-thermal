// backend/src/app.js
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const thermalRoutes = require('./routes/thermalRoutes');
const streamRoutes = require('./routes/streamRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const systemStatusRoutes = require('./routes/systemStatusRoutes');
const alertsRoutes = require('./routes/alertsRoutes');

const app = express();

// Configurar WebSocket
const wss = new WebSocket.Server({ port: 8080 });
console.log('Servidor WebSocket iniciado na porta 8080');

wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida');
    ws.on('close', () => console.log('Conexão WebSocket fechada'));
});

app.set('wss', wss);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'ThermalGuard API está funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/stream', streamRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/system', systemStatusRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/thermal', thermalRoutes);

app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Rota não encontrada: ${req.originalUrl}`
    }
  });
});

module.exports = app;