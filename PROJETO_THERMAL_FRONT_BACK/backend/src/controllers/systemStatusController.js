// backend/src/controllers/systemStatusController.js
const systemStatusService = require('../services/systemStatusService');

const getSystemStatus = (req, res) => {
  try {
    const status = systemStatusService.getCompleteStatus(); // Alterado de getStatus para getCompleteStatus
    res.status(200).json(status);
  } catch (error) {
    console.error('Erro ao obter status do sistema:', error);
    res.status(500).json({ error: 'Erro ao obter status do sistema' });
  }
};

const getTemperatureData = (req, res) => {
  try {
    const { period } = req.query; // 'day', 'week', 'month'
    const hours = period === 'week' ? 168 : (period === 'month' ? 720 : 24); // Converter período em horas
    const temperatureData = systemStatusService.getHistoricalTemperatureData(hours); // Alterado para getHistoricalTemperatureData
    res.status(200).json(temperatureData);
  } catch (error) {
    console.error('Erro ao obter dados de temperatura:', error);
    res.status(500).json({ error: 'Erro ao obter dados de temperatura' });
  }
};

const getCurrentTemperature = (req, res) => {
  try {
    const temperature = systemStatusService.getCurrentTemperature();
    res.status(200).json({ temperature });
  } catch (error) {
    console.error('Erro ao obter temperatura atual:', error);
    res.status(500).json({ error: 'Erro ao obter temperatura atual' });
  }
};

module.exports = {
  getSystemStatus,
  getTemperatureData,
  getCurrentTemperature
};