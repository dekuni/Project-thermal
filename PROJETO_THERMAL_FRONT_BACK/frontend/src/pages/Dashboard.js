// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStreamStatus, startStream, stopStream, getNotifications, getSystemStatus, getThermalStatus, getThermalHistory } from '../services/api';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Plot from 'react-plotly.js';

const Dashboard = () => {
  const [streamStatus, setStreamStatus] = useState('stopped');
  const [notifications, setNotifications] = useState([]);
  const [systemStats, setSystemStats] = useState({
    currentTemperature: 26.5,
    maxTemperature: 32.8,
    minTemperature: 21.2,
    avgTemperature: 25.7,
    currentHumidity: 48,
    alertsCount: 3,
    forecastNextHour: 27.2,
    systemUptime: "5d 12h 32m",
    lastMaintenance: "2023-06-01",
    sensorsOnline: 5,
    sensorsTotal: 5,
  });
  const [loading, setLoading] = useState(true);
  const [thermalData, setThermalData] = useState(null);
  const [thermalHistory, setThermalHistory] = useState([]);

  useEffect(() => {
    // Função para buscar todos os dados
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carregar status do stream
        const streamResponse = await getStreamStatus();
        setStreamStatus(streamResponse.data.status);
        
        // Carregar notificações
        const notificationsResponse = await getNotifications();
        // Garantir que notifications seja um array
        const notificationsData = Array.isArray(notificationsResponse.data) 
          ? notificationsResponse.data 
          : [];
        setNotifications(notificationsData);
        
        // Buscar dados térmicos reais
        const thermalResponse = await getThermalStatus();
        setThermalData(thermalResponse.data);
        
        // Buscar histórico térmico
        const historyResponse = await getThermalHistory(48); // últimas 48 leituras
        setThermalHistory(historyResponse.data);
        
        // Carregar status do sistema (simulado)
        // const systemResponse = await getSystemStatus();
        // setSystemStats(systemResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Gerar dados para o gráfico de temperatura com dados reais
  const getTemperatureGraphData = () => {
    if (thermalHistory && thermalHistory.length > 0) {
      return {
        x: thermalHistory.map(item => item.timestamp),
        y: thermalHistory.map(item => item.maxTemperature),
        type: 'scatter',
        mode: 'lines',
        name: 'Temperatura',
        line: { color: '#00e2c8', width: 2 }
      };
    }
    
    // Dados de fallback se não houver histórico
    return {
      x: Array(24).fill().map((_, i) => new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString()),
      y: Array(24).fill().map(() => Math.random() * 5 + 22),
      type: 'scatter',
      mode: 'lines',
      name: 'Temperatura',
      line: { color: '#00e2c8', width: 2 }
    };
  };

  const handleStartStream = async () => {
    try {
      await startStream();
      setStreamStatus('running');
    } catch (error) {
      console.error('Erro ao iniciar o stream:', error);
    }
  };

  const handleStopStream = async () => {
    try {
      await stopStream();
      setStreamStatus('stopped');
    } catch (error) {
      console.error('Erro ao parar o stream:', error);
    }
  };

  // Calcular tendência de temperatura
  const getTemperatureTrend = () => {
    const currentTemp = systemStats.currentTemperature;
    const nextHourTemp = systemStats.forecastNextHour;
    const diff = nextHourTemp - currentTemp;
    
    if (diff > 1) return { icon: 'fas fa-arrow-up', color: '#ff5252', text: `${diff.toFixed(1)}°C`, status: 'negative' };
    if (diff > 0.3) return { icon: 'fas fa-arrow-up', color: '#ffbb33', text: `${diff.toFixed(1)}°C`, status: 'negative' };
    if (diff < -1) return { icon: 'fas fa-arrow-down', color: '#00C851', text: `${Math.abs(diff).toFixed(1)}°C`, status: 'positive' };
    if (diff < -0.3) return { icon: 'fas fa-arrow-down', color: '#33b5e5', text: `${Math.abs(diff).toFixed(1)}°C`, status: 'positive' };
    return { icon: 'fas fa-equals', color: '#B0B0B0', text: 'Estável', status: 'neutral' };
  };

  const getTempColorClass = (temp) => {
    if (temp >= 35) return 'text-danger';
    if (temp >= 30) return 'text-warning';
    if (temp <= 20) return 'text-info';
    return 'text-light';
  };

  // Renderizar temperatura atual com dados reais
  const renderTemperatureDisplay = () => {
    const temp = thermalData?.currentTemperature || systemStats?.temperature?.current || '25.0';
    const maxTemp = thermalData?.maxTemperature || systemStats?.temperature?.max || '28.0';
    const minTemp = thermalData?.minTemperature || systemStats?.temperature?.min || '22.0';
    
    // Calcular a posição do preenchimento na barra (20°C - 40°C)
    const fillPosition = Math.min(100, Math.max(0, (temp - 20) * 5)); // Temperatura - 20 multiplicada por 5 para escala 0-100%
    
    return (
      <div className="temperature-display">
        <div className="temperature-current">{temp}°C</div>
        
        <div className="temperature-scale">
          <span>20°C</span>
          <span>30°C</span>
          <span>40°C</span>
        </div>
        
        <div className="temperature-bar">
          <div className="temperature-fill" style={{ width: `${100 - fillPosition}%` }}></div>
        </div>
        
        <div className="temperature-stats">
          <div className="temperature-stat">
            <span className="stat-label">Máx:</span>
            <span className="stat-value">{maxTemp}°C</span>
          </div>
          <div className="temperature-stat">
            <span className="stat-label">Mín:</span>
            <span className="stat-value">{minTemp}°C</span>
          </div>
          <div className="temperature-stat">
            <span className="stat-label">Última atualização:</span>
            <span className="stat-value">{thermalData?.lastUpdate || 'N/A'}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#00C4FF" size={50} />
      </div>
    );
  }

  const trend = getTemperatureTrend();

  return (
    <div className="main-content">
      <div className="dashboard-container">
        <div className="page-header">
          <h1 className="title-divider">Dashboard</h1>
          <div className="header-actions">
            <button className="button">
              <i className="fas fa-sync-alt"></i> Atualizar
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Câmera de Monitoramento - Lado esquerdo */}
          <div className="stream-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-video"></i>
              </div>
              <div className="card-title">Câmera de Monitoramento</div>
            </div>
            <div className="stream-container">
              {streamStatus === 'running' ? (
                <div className="stream-frame">
                  <img src="/stream" alt="Stream de vídeo" className="stream-video" />
                </div>
              ) : (
                <button className="stream-button" onClick={handleStartStream}>
                  <i className="fas fa-play-circle"></i> Iniciar Stream
                </button>
              )}
            </div>
          </div>

          {/* Notificações - Lado direito */}
          <div className="notifications-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-bell"></i>
              </div>
              <div className="card-title">Notificações Recentes</div>
            </div>
            <div className="notifications-container">
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <div className="no-notifications">
                  <i className="fas fa-bell-slash"></i>
                  <p>Nenhuma notificação disponível</p>
                </div>
              ) : (
                <div className="notification-list">
                  {Array.isArray(notifications) && notifications.slice(0, 5).map((notification, index) => (
                    <div
                      key={index}
                      className={`notification-item ${notification.type}`}
                    >
                      <div className="notification-icon">
                        {notification.type === 'warning' ? (
                          <i className="fas fa-exclamation-triangle"></i>
                        ) : notification.type === 'critical' ? (
                          <i className="fas fa-exclamation-circle"></i>
                        ) : (
                          <i className="fas fa-info-circle"></i>
                        )}
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="notifications-footer">
                <Link to="/alerts" className="notifications-link">
                  Ver todas as notificações <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Temperatura Atual */}
          <div className="temperature-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-temperature-high"></i>
              </div>
              <div className="card-title">Temperatura Atual</div>
            </div>
            <div className="temperature-display">
              <div className="temperature-scale">
                <span>15°C</span>
                <span>30°C</span>
                <span>45°C</span>
              </div>
              <div className="temperature-bar">
                <div 
                  className="temperature-fill"
                  style={{ 
                    width: `${Math.min(100, (systemStats.currentTemperature - 15) / 30 * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="temperature-current">{systemStats.currentTemperature}°C</div>
              <div className="temperature-trend">
                <i className={trend.icon}></i> {trend.text} nas próximas horas
              </div>
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="status-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="card-title">Status do Sistema</div>
            </div>
            <div className="system-status">
              <div className="status-indicator-container">
                <div className="status-indicator"></div>
                <div className="status-text">Sistema Online</div>
              </div>
              <div className="status-details">
                <div className="status-item">
                  <div className="status-label">Uptime:</div>
                  <div className="status-value">{systemStats.systemUptime}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Sensores:</div>
                  <div className="status-value">{systemStats.sensorsOnline}/{systemStats.sensorsTotal} ativos</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Alertas:</div>
                  <div className="status-value">{systemStats.alertsCount} ativos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="system-info-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="card-title">Informações do Sistema</div>
            </div>
            <div className="system-info-grid">
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-thermometer-half"></i> Temperatura Máxima
                </div>
                <div className="info-value">{systemStats.maxTemperature}°C</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-thermometer-empty"></i> Temperatura Mínima
                </div>
                <div className="info-value">{systemStats.minTemperature}°C</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-thermometer-quarter"></i> Temperatura Média
                </div>
                <div className="info-value">{systemStats.avgTemperature}°C</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-microchip"></i> Sensores Ativos
                </div>
                <div className="info-value">{systemStats.sensorsOnline}/{systemStats.sensorsTotal}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-clock"></i> Tempo de Atividade
                </div>
                <div className="info-value">{systemStats.systemUptime}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <i className="fas fa-wrench"></i> Última Manutenção
                </div>
                <div className="info-value">{systemStats.lastMaintenance}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;