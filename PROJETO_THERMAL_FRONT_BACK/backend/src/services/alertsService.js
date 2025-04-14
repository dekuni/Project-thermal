// backend/src/services/alertsService.js
const notificationsService = require('./notificationsService');

// Estado inicial dos alertas
let alerts = {
  critical: [
    { id: 1, time: '2023-06-15 14:32', message: 'Temperatura atingiu nível crítico (38°C)', device: 'Sensor 1', status: 'open' },
    { id: 2, time: '2023-06-15 10:45', message: 'Falha na calibração do sensor térmico', device: 'Sensor 3', status: 'open' }
  ],
  warning: [
    { id: 3, time: '2023-06-15 09:22', message: 'Temperatura em elevação (32°C)', device: 'Sensor 2', status: 'open' },
    { id: 4, time: '2023-06-14 23:10', message: 'Variação rápida detectada (27°C → 31°C)', device: 'Sensor 1', status: 'open' },
    { id: 5, time: '2023-06-14 17:45', message: 'Sensor com leituras intermitentes', device: 'Sensor 4', status: 'open' }
  ],
  info: [
    { id: 8, time: '2023-06-14 11:05', message: 'Manutenção programada para amanhã', device: 'Sistema', status: 'open' },
    { id: 9, time: '2023-06-14 10:20', message: 'Atualização de firmware disponível', device: 'Sensor 1', status: 'open' }
  ],
  resolved: [
    { id: 16, time: '2023-06-12 16:40', message: 'Temperatura normalizada (26°C)', device: 'Sensor 1', status: 'resolved', resolvedAt: '2023-06-12 17:20' },
    { id: 17, time: '2023-06-12 14:15', message: 'Sensor reconectado após falha', device: 'Sensor 3', status: 'resolved', resolvedAt: '2023-06-12 14:45' }
  ]
};

let nextId = 18; // Próximo ID para novos alertas

// Iniciar monitoramento de temperatura
let monitoringInterval = null;
const startMonitoring = () => {
  if (monitoringInterval) return;
  
  monitoringInterval = setInterval(() => {
    const temperature = Math.random() * 15 + 25; // Temperatura entre 25 e 40
    
    // Criar alertas com base na temperatura
    if (temperature > 38) {
      createAlert('critical', `Temperatura atingiu nível crítico (${temperature.toFixed(1)}°C)`, 'Sensor 1');
    } else if (temperature > 32) {
      createAlert('warning', `Temperatura em elevação (${temperature.toFixed(1)}°C)`, 'Sensor 2');
    } else if (Math.random() > 0.95) {
      // Ocasionalmente criar alertas de informação
      createAlert('info', 'Manutenção preventiva recomendada', 'Sistema');
    }
  }, 60000); // Verificar a cada minuto
};

// Parar monitoramento
const stopMonitoring = () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
};

// Obter todos os alertas ou filtrados por tipo e status
const getAlerts = (type, status) => {
  if (!type && !status) {
    // Retornar todos os alertas
    return {
      critical: alerts.critical,
      warning: alerts.warning,
      info: alerts.info,
      resolved: alerts.resolved
    };
  }
  
  let result = {};
  
  if (type) {
    result[type] = alerts[type] || [];
  } else {
    // Se apenas status foi fornecido, filtrar por status em todos os tipos
    result = {
      critical: alerts.critical.filter(a => a.status === status),
      warning: alerts.warning.filter(a => a.status === status),
      info: alerts.info.filter(a => a.status === status)
    };
    
    if (status === 'resolved') {
      result.resolved = alerts.resolved;
    }
  }
  
  return result;
};

// Obter alerta por ID
const getAlertById = (id) => {
  for (const type in alerts) {
    const alert = alerts[type].find(a => a.id === id);
    if (alert) return alert;
  }
  return null;
};

// Criar um novo alerta
const createAlert = (type, message, device) => {
  const now = new Date();
  const timeString = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const newAlert = {
    id: nextId++,
    time: timeString,
    message,
    device,
    status: 'open'
  };
  
  alerts[type].push(newAlert);
  
  // Criar notificação para o alerta
  const level = type === 'critical' ? 'error' : (type === 'warning' ? 'warning' : 'info');
  notificationsService.addNotification(level, message);
  
  return newAlert;
};

// Resolver um alerta
const resolveAlert = (id) => {
  for (const type of ['critical', 'warning', 'info']) {
    const index = alerts[type].findIndex(a => a.id === id);
    if (index !== -1) {
      const alert = alerts[type][index];
      const now = new Date();
      const resolvedAt = now.toISOString().replace('T', ' ').substring(0, 19);
      
      // Remover do tipo original
      alerts[type].splice(index, 1);
      
      // Adicionar à lista de resolvidos
      const resolvedAlert = {
        ...alert,
        status: 'resolved',
        resolvedAt
      };
      
      alerts.resolved.push(resolvedAlert);
      
      // Criar notificação para o alerta resolvido
      notificationsService.addNotification('info', `Alerta resolvido: ${alert.message}`);
      
      return resolvedAlert;
    }
  }
  
  return null;
};

// Limpar todos os alertas
const clearAllAlerts = () => {
  alerts = {
    critical: [],
    warning: [],
    info: [],
    resolved: []
  };
  return true;
};

// Obter contagem de alertas por tipo
const getAlertCounts = () => {
  return {
    critical: alerts.critical.length,
    warning: alerts.warning.length,
    info: alerts.info.length,
    resolved: alerts.resolved.length,
    total: alerts.critical.length + alerts.warning.length + alerts.info.length
  };
};

// Iniciar monitoramento ao carregar o serviço
startMonitoring();

module.exports = {
  getAlerts,
  getAlertById,
  createAlert,
  resolveAlert,
  clearAllAlerts,
  getAlertCounts,
  startMonitoring,
  stopMonitoring
};