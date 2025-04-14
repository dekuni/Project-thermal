// backend/src/data/mockData.js
const notifications = [
  { timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Sistema iniciado' },
  { timestamp: new Date().toLocaleTimeString(), level: 'warning', message: 'Temperatura acima do esperado: 35.8°C' },
  { timestamp: new Date().toLocaleTimeString(), level: 'error', message: 'Falha na conexão com o servidor' },
  { timestamp: new Date().toLocaleTimeString(), level: 'temperature', message: 'Temperatura atual: 42.1°C' },
];

// Função para gerar datas
const generateDates = (startDate, numPoints, intervalHours) => {
  const dates = [];
  let currentDate = new Date(startDate);
  for (let i = 0; i < numPoints; i++) {
    dates.push(new Date(currentDate));
    currentDate.setHours(currentDate.getHours() + intervalHours);
  }
  return dates;
};

// Geração de dados históricos (48 horas passadas)
const now = new Date();
const startDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 horas atrás
const historicalDates = generateDates(startDate, 48, 1); // 1 hora de intervalo

// Gera temperaturas históricas com padrão diurno
const historicalTemperatures = historicalDates.map(date => {
  const hour = date.getHours();
  const baseTemp = 25 + 5 * Math.sin(Math.PI * hour / 12); // Padrão diurno
  return baseTemp + (Math.random() - 0.5) * 3; // Variação aleatória (±1.5°C)
});

// Adiciona picos aleatórios
const indicesPico = Array.from({ length: 3 }, () => Math.floor(Math.random() * 48));
indicesPico.forEach(idx => {
  historicalTemperatures[idx] += Math.random() * (10 - 6) + 6; // Pico entre 6 e 10°C
});

// Geração de dados de previsão (24 horas futuras)
const forecastDates = generateDates(now, 24, 1); // 24 horas a partir de agora
const forecastTemperatures = [];
let lastTemp = historicalTemperatures[historicalTemperatures.length - 1];

forecastDates.forEach((date, i) => {
  const hour = date.getHours();
  const basePrev = 25 + 5 * Math.sin(Math.PI * hour / 12); // Padrão diurno
  let forecast;
  if (i === 0) {
    forecast = 0.7 * lastTemp + 0.3 * basePrev + (Math.random() - 0.5) * 1.6; // ±0.8°C
  } else {
    forecast = 0.8 * forecastTemperatures[i - 1] + 0.2 * basePrev + (Math.random() - 0.5) * 1; // ±0.5°C
  }
  forecastTemperatures.push(forecast);
});

// Intervalo de confiança
const confidenceIntervalUpper = forecastTemperatures.map((temp, i) => temp + 1 + 0.1 * i);
const confidenceIntervalLower = forecastTemperatures.map((temp, i) => temp - 1 - 0.1 * i);

// Dados para as estatísticas
const stats = {
  currentTemperature: historicalTemperatures[historicalTemperatures.length - 1].toFixed(1),
  maxTemperature: Math.max(...historicalTemperatures).toFixed(1),
  minTemperature: Math.min(...historicalTemperatures).toFixed(1),
  forecastNextHour: forecastTemperatures[0].toFixed(1),
  forecast6Hours: forecastTemperatures[5].toFixed(1),
  forecast12Hours: forecastTemperatures[11].toFixed(1),
  forecast24Hours: forecastTemperatures[23].toFixed(1),
};

// Dados para o histograma
const histogramData = historicalTemperatures;

// Dados completos para o gráfico
const graphData = {
  historical: {
    x: historicalDates,
    y: historicalTemperatures,
    type: 'scatter',
    mode: 'lines',
    name: 'Temperatura Real',
    line: { color: '#00C4FF', width: 2 },
  },
  forecast: {
    x: forecastDates,
    y: forecastTemperatures,
    type: 'scatter',
    mode: 'lines',
    name: 'Temperatura Prevista',
    line: { color: '#B980F0', width: 2, dash: 'dash' },
  },
  confidenceInterval: {
    x: [...forecastDates, ...forecastDates.slice().reverse()],
    y: [...confidenceIntervalUpper, ...confidenceIntervalLower.slice().reverse()],
    type: 'scatter',
    fill: 'toself',
    fillcolor: 'rgba(185, 128, 240, 0.2)',
    line: { color: 'rgba(255, 255, 255, 0)', width: 0 },
    name: 'Intervalo de Confiança',
  },
  criticalLimit: {
    type: 'line',
    x: [historicalDates[0], forecastDates[forecastDates.length - 1]],
    y: [35, 35],
    mode: 'lines',
    name: 'Limite Crítico',
    line: { color: 'red', dash: 'dash' },
  },
  alertLimit: {
    type: 'line',
    x: [historicalDates[0], forecastDates[forecastDates.length - 1]],
    y: [30, 30],
    mode: 'lines',
    name: 'Limite Alerta',
    line: { color: 'orange', dash: 'dash' },
  },
  nowLine: {
    type: 'line',
    x: [now, now],
    y: [15, 45],
    mode: 'lines',
    name: 'Agora',
    line: { color: 'white', dash: 'dash' },
  },
  histogram: {
    x: histogramData,
    type: 'histogram',
    name: 'Distribuição',
    nbinsx: 20,
    opacity: 0.7,
  },
  stats: stats,
};

module.exports = { notifications, graphData };