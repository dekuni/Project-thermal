// backend/src/controllers/streamController.js
const streamService = require('../services/streamService');

const streamController = {
    getStreamStatus: async (req, res) => {
        try {
            const status = await streamService.getStatus();
            res.json(status);
        } catch (error) {
            console.error('Erro ao obter status do stream:', error);
            res.status(500).json({ 
                status: 'error', 
                message: 'Erro ao obter status do stream' 
            });
        }
    },

    startStream: async (req, res) => {
        try {
            // Usar o wss do middleware
            const wss = req.wss;
            const result = await streamService.startStream(wss);
            res.json(result);
        } catch (error) {
            console.error('Erro ao iniciar stream:', error);
            res.status(500).json({ 
                status: 'error', 
                message: 'Erro ao iniciar stream' 
            });
        }
    },

    stopStream: async (req, res) => {
        try {
            const result = await streamService.stopStream();
            res.json(result);
        } catch (error) {
            console.error('Erro ao parar stream:', error);
            res.status(500).json({ 
                status: 'error', 
                message: 'Erro ao parar stream' 
            });
        }
    }
};

module.exports = streamController;