// backend/src/controllers/alertsController.js
const alertsService = require('../services/alertsService');

const getAlerts = (req, res) => {
  try {
    const { type, status } = req.query;
    const alerts = alertsService.getAlerts(type, status);
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Erro ao obter alertas:', error);
    res.status(500).json({ error: 'Erro ao obter alertas' });
  }
};

const getAlertById = (req, res) => {
  try {
    const { id } = req.params;
    const alert = alertsService.getAlertById(parseInt(id));
    
    if (!alert) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }
    
    res.status(200).json(alert);
  } catch (error) {
    console.error('Erro ao obter alerta:', error);
    res.status(500).json({ error: 'Erro ao obter alerta' });
  }
};

const resolveAlert = (req, res) => {
  try {
    const { id } = req.params;
    alertsService.resolveAlert(parseInt(id));
    res.status(200).json({ message: 'Alerta resolvido com sucesso' });
  } catch (error) {
    console.error('Erro ao resolver alerta:', error);
    res.status(500).json({ error: 'Erro ao resolver alerta' });
  }
};

const clearAllAlerts = (req, res) => {
  try {
    alertsService.clearAllAlerts();
    res.status(200).json({ message: 'Todos os alertas foram limpos' });
  } catch (error) {
    console.error('Erro ao limpar alertas:', error);
    res.status(500).json({ error: 'Erro ao limpar alertas' });
  }
};

module.exports = {
  getAlerts,
  getAlertById,
  resolveAlert,
  clearAllAlerts
};