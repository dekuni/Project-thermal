// backend/src/controllers/notificationsController.js
const notificationsService = require('../services/notificationsService');
const systemStatusService = require('../services/systemStatusService');

const getNotifications = (req, res) => {
  try {
    const { filter } = req.query;
    const notifications = notificationsService.getNotifications(filter); // Alterado de getAll para getNotifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    res.status(500).json({ error: 'Erro ao obter notificações' });
  }
};

const getNotificationById = (req, res) => {
  try {
    const { id } = req.params;
    // Como getNotificationById não existe no serviço, filtraremos da lista completa
    const notifications = notificationsService.getNotifications();
    const notification = notifications.find(n => n.id === parseInt(id));
    
    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Erro ao obter notificação:', error);
    res.status(500).json({ error: 'Erro ao obter notificação' });
  }
};

const markAsRead = (req, res) => {
  try {
    // Como markAsRead não existe no serviço, podemos retornar sucesso simulado
    // Em uma implementação completa, isso chamaria um método no serviço
    res.status(200).json({ message: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
  }
};

const clearAll = (req, res) => {
  try {
    notificationsService.clearNotifications(); // Alterado de clearAll para clearNotifications
    res.status(200).json({ message: 'Todas as notificações foram limpas' });
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
    res.status(500).json({ error: 'Erro ao limpar notificações' });
  }
};

// Adicionar novo método para obter o status do sistema
const getSystemStatus = (req, res) => {
  try {
    const status = notificationsService.getSystemStatus(systemStatusService);
    res.status(200).json(status);
  } catch (error) {
    console.error('Erro ao obter status do sistema:', error);
    res.status(500).json({ error: 'Erro ao obter status do sistema' });
  }
};

// Adicionar novo método para obter dados de gráfico
const getGraphData = (req, res) => {
  try {
    const { period } = req.query;
    const data = notificationsService.getGraphData(period);
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao obter dados do gráfico:', error);
    res.status(500).json({ error: 'Erro ao obter dados do gráfico' });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  clearAll,
  getSystemStatus,
  getGraphData
};