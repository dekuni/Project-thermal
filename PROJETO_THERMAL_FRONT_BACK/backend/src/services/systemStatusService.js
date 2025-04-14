// backend/src/services/systemStatusService.js
const { graphData } = require('../data/mockData');
const alertsService = require('./alertsService');

// Estado inicial
let currentTemperature = parseFloat(graphData.stats.currentTemperature);
let systemStartTime = new Date();
let humidity = Math.round(Math.random() * 20 + 40); // Entre 40-60%
let stats = { ...graphData.stats };

// Simular mudanças aleatórias na temperatura
let simulationInterval = null;
const startSimulation = () => {
  if (simulationInterval) return;
  
  simulationInterval = setInterval(() => {
    // Atualizar temperatura com pequena variação
    const variation = (Math.random() - 0.5) * 2; // Variação de -1 a +1
    currentTemperature = parseFloat((currentTemperature + variation).toFixed(1));
    
    // Atualizar umidade
    humidity = Math.max(30, Math.min(70, humidity + (Math.random() - 0.5) * 5));
    
    // Atualizar estatísticas
    updateStats();
    
  }, 30000); // Atualizar a cada 30 segundos
};

// Parar simulação
const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
};

// Atualizar estatísticas
const updateStats = () => {
  stats = {
    ...stats,
    currentTemperature: currentTemperature.toFixed(1),
    maxTemperature: Math.max(parseFloat(stats.maxTemperature), currentTemperature).toFixed(1),
    minTemperature: Math.min(parseFloat(stats.minTemperature), currentTemperature).toFixed(1),
  };
};

// Calcular tempo de atividade do sistema
const getSystemUptime = () => {
  const uptime = Math.floor((new Date() - systemStartTime) / 1000); // Em segundos
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Gerar dados históricos de temperatura
const getHistoricalTemperatureData = (hours = 24) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
  const dataPoints = hours; // Um ponto por hora
  
  const dates = [];
  const temperatures = [];
  
  for (let i = 0; i < dataPoints; i++) {
    const pointDate = new Date(startDate.getTime() + i * 60 * 60 * 1000);
    dates.push(pointDate);
    
    // Base + padrão diurno + variação aleatória
    const hour = pointDate.getHours();
    const baseTemp = 25 + 5 * Math.sin(Math.PI * hour / 12);
    const temp = baseTemp + (Math.random() - 0.5) * 3;
    
    temperatures.push(parseFloat(temp.toFixed(1)));
  }
  
  return { dates, temperatures };
};

// Obter temperatura atual
const getCurrentTemperature = () => {
  return currentTemperature;
};

// Obter alertas
const getAlertCounts = () => {
  return alertsService.getAlertCounts();
};

// Obter status completo do sistema
const getCompleteStatus = () => {
  return {
    temperature: {
      current: currentTemperature,
      max: stats.maxTemperature,
      min: stats.minTemperature,
    },
    humidity,
    uptime: getSystemUptime(),
    alerts: getAlertCounts(),
    lastUpdate: new Date().toISOString()
  };
};

// Iniciar simulação ao carregar o serviço
startSimulation();

module.exports = {
  getCurrentTemperature,
  getHistoricalTemperatureData,
  getSystemUptime,
  getCompleteStatus,
  getAlertCounts,
  startSimulation,
  stopSimulation
};