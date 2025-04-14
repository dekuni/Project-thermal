// backend/src/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const streamRoutes = require('./routes/streamRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const systemStatusRoutes = require('./routes/systemStatusRoutes');
const alertsRoutes = require('./routes/alertsRoutes');
const thermalRoutes = require('./routes/thermalRoutes');

// Criar a aplicação Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/stream', streamRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/system', systemStatusRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/thermal', thermalRoutes);

const PORT = process.env.PORT || 5000;

// Criar o servidor HTTP
const server = http.createServer(app);

// Configurar WebSocket Server
const wss = new WebSocket.Server({ server });

// Eventos do WebSocket
wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida');
    
    ws.on('close', () => {
        console.log('Conexão WebSocket fechada');
    });

    ws.on('error', (error) => {
        console.error('Erro na conexão WebSocket:', error);
    });
});

// Middleware para disponibilizar o wss
app.use((req, res, next) => {
    req.wss = wss;
    next();
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 'error', 
        message: 'Erro interno do servidor' 
    });
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`API disponível em http://localhost:${PORT}`);
    console.log('Servidor WebSocket iniciado na mesma porta');
});