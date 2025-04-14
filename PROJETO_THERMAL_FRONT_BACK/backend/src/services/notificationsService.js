// backend/src/services/notificationsService.js
const { notifications } = require('../data/mockData');
const { Notification } = require('../models/Notification');

// Estado das notificações
let allNotifications = [...notifications]; // Inicializar com os dados mock
let nextId = allNotifications.length + 1;

// Adicionar uma nova notificação
const addNotification = (level, message) => {
  const now = new Date();
  const notification = {
    id: nextId++,
    timestamp: now.toLocaleTimeString(),
    level,
    message
  };
  
  allNotifications.unshift(notification); // Adiciona no início (mais recente primeiro)
  
  // Manter um limite de notificações (opcional)
  if (allNotifications.length > 100) {
    allNotifications = allNotifications.slice(0, 100);
  }
  
  return notification;
};

// Obter todas as notificações ou filtradas por nível
const getNotifications = (filter) => {
  if (filter && filter !== 'all') {
    return allNotifications.filter(n => n.level === filter);
  }
  return allNotifications;
};

// Limpar todas as notificações
const clearNotifications = () => {
  allNotifications = [];
  return { success: true };
};

// Obter estatísticas de sistema
const getSystemStatus = (systemStatusService) => {
  const counts = systemStatusService.getAlertCounts();
  const temperature = systemStatusService.getCurrentTemperature();
  
  return {
    currentTemperature: temperature,
    alerts: counts.total,
    criticalAlerts: counts.critical,
    systemUptime: systemStatusService.getSystemUptime(),
    lastUpdate: new Date().toLocaleTimeString(),
    status: temperature > 38 ? 'critical' : (temperature > 32 ? 'warning' : 'normal')
  };
};

// Obter dados de gráfico para o dashboard
const getGraphData = (period = '24h') => {
  // Pegar dados de mockData.js
  const { graphData } = require('../data/mockData');
  
  // Filtrar com base no período
  // Para simplificar, vamos apenas retornar os dados completos
  return graphData;
};

module.exports = {
  addNotification,
  getNotifications,
  clearNotifications,
  getSystemStatus,
  getGraphData
};