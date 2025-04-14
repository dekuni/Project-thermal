const thermalService = require('../services/thermalService');

const thermalController = {
    getThermalStatus: async (req, res) => {
        try {
            const status = await thermalService.getThermalStatus();
            res.json({
                status: 'success',
                data: status
            });
        } catch (error) {
            console.error('Erro no controlador:', error);
            res.status(500).json({ 
                status: 'error',
                message: error.message 
            });
        }
    },

    getThermalHistory: async (req, res) => {
        try {
            const seconds = req.params.seconds ? parseInt(req.params.seconds) : 86400; // 24 horas por padrão
            const history = await thermalService.getThermalHistory(seconds);
            res.json({
                status: 'success',
                data: history
            });
        } catch (error) {
            console.error('Erro no controlador:', error);
            res.status(500).json({ 
                status: 'error',
                message: error.message 
            });
        }
    }
};

module.exports = thermalController;