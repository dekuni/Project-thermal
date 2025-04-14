// frontend/src/pages/Alerts.js
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Plot from 'react-plotly.js';

const Alerts = () => {
  const [loading, setLoading] = useState(true);
  const [alertsData, setAlertsData] = useState({
    critical: [],
    warning: [],
    info: [],
    resolved: []
  });
  const [activeTab, setActiveTab] = useState('all');
  const [statsSummary, setStatsSummary] = useState({
    critical: 2,
    warning: 5,
    info: 8,
    resolved: 12
  });

  useEffect(() => {
    // Simular carregamento de dados
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        // Aqui seria a chamada real para a API
        // const response = await getAlerts();
        // setAlertsData(response.data);
        
        // Simulando dados para demonstração
        setTimeout(() => {
          setAlertsData({
            critical: [
              { id: 1, time: '2023-06-15 14:32', message: 'Temperatura atingiu nível crítico (38°C)', device: 'Sensor 1', status: 'open' },
              { id: 2, time: '2023-06-15 10:45', message: 'Falha na calibração do sensor térmico', device: 'Sensor 3', status: 'open' }
            ],
            warning: [
              { id: 3, time: '2023-06-15 09:22', message: 'Temperatura em elevação (32°C)', device: 'Sensor 2', status: 'open' },
              { id: 4, time: '2023-06-14 23:10', message: 'Variação rápida detectada (27°C → 31°C)', device: 'Sensor 1', status: 'open' },
              { id: 5, time: '2023-06-14 17:45', message: 'Sensor com leituras intermitentes', device: 'Sensor 4', status: 'open' },
              { id: 6, time: '2023-06-14 15:30', message: 'Temperatura próxima ao limite (29°C)', device: 'Sensor 2', status: 'open' },
              { id: 7, time: '2023-06-14 13:15', message: 'Baixa precisão nas leituras detectada', device: 'Sensor 5', status: 'open' }
            ],
            info: [
              { id: 8, time: '2023-06-14 11:05', message: 'Manutenção programada para amanhã', device: 'Sistema', status: 'open' },
              { id: 9, time: '2023-06-14 10:20', message: 'Atualização de firmware disponível', device: 'Sensor 1', status: 'open' },
              { id: 10, time: '2023-06-14 09:30', message: 'Calibração automática realizada', device: 'Sensor 2', status: 'open' },
              { id: 11, time: '2023-06-13 16:45', message: 'Novo sensor adicionado ao sistema', device: 'Sensor 5', status: 'open' },
              { id: 12, time: '2023-06-13 14:20', message: 'Backup realizado com sucesso', device: 'Sistema', status: 'open' },
              { id: 13, time: '2023-06-13 11:15', message: 'Teste de comunicação bem-sucedido', device: 'Todos sensores', status: 'open' },
              { id: 14, time: '2023-06-13 10:05', message: 'Sistema reiniciado após manutenção', device: 'Sistema', status: 'open' },
              { id: 15, time: '2023-06-13 09:30', message: 'Novo usuário adicionado', device: 'Sistema', status: 'open' }
            ],
            resolved: [
              { id: 16, time: '2023-06-12 16:40', message: 'Temperatura normalizada (26°C)', device: 'Sensor 1', status: 'resolved', resolvedAt: '2023-06-12 17:20' },
              { id: 17, time: '2023-06-12 14:15', message: 'Sensor reconectado após falha', device: 'Sensor 3', status: 'resolved', resolvedAt: '2023-06-12 14:45' },
              { id: 18, time: '2023-06-12 11:30', message: 'Falha de comunicação resolvida', device: 'Sensor 4', status: 'resolved', resolvedAt: '2023-06-12 12:10' },
              { id: 19, time: '2023-06-12 10:20', message: 'Alarme de temperatura alta (30°C)', device: 'Sensor 2', status: 'resolved', resolvedAt: '2023-06-12 10:50' },
              { id: 20, time: '2023-06-12 09:15', message: 'Erro de leitura de temperatura', device: 'Sensor 5', status: 'resolved', resolvedAt: '2023-06-12 09:45' },
              { id: 21, time: '2023-06-11 15:40', message: 'Sensor com bateria baixa', device: 'Sensor 3', status: 'resolved', resolvedAt: '2023-06-11 16:20' },
              { id: 22, time: '2023-06-11 14:10', message: 'Conexão de rede instável', device: 'Sistema', status: 'resolved', resolvedAt: '2023-06-11 14:35' },
              { id: 23, time: '2023-06-11 11:55', message: 'Alerta de umidade alta', device: 'Sensor 1', status: 'resolved', resolvedAt: '2023-06-11 12:30' },
              { id: 24, time: '2023-06-11 10:40', message: 'Falha na autenticação do usuário', device: 'Sistema', status: 'resolved', resolvedAt: '2023-06-11 11:05' },
              { id: 25, time: '2023-06-11 09:25', message: 'Erro ao carregar configurações', device: 'Sistema', status: 'resolved', resolvedAt: '2023-06-11 09:50' },
              { id: 26, time: '2023-06-10 16:15', message: 'Sistema lento durante processamento', device: 'Sistema', status: 'resolved', resolvedAt: '2023-06-10 16:45' },
              { id: 27, time: '2023-06-10 14:30', message: 'Temperatura acima do ideal (28°C)', device: 'Sensor 2', status: 'resolved', resolvedAt: '2023-06-10 15:10' }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Filtrar alertas com base na guia ativa
  const getFilteredAlerts = () => {
    if (activeTab === 'all') {
      return [
        ...alertsData.critical,
        ...alertsData.warning,
        ...alertsData.info,
      ].sort((a, b) => new Date(b.time) - new Date(a.time));
    } else if (activeTab === 'critical') {
      return alertsData.critical;
    } else if (activeTab === 'warning') {
      return alertsData.warning;
    } else if (activeTab === 'info') {
      return alertsData.info;
    } else if (activeTab === 'resolved') {
      return alertsData.resolved;
    }
    return [];
  };

  // Dados para gráfico de pizza
  const getPieChartData = () => {
    return {
      data: [
        {
          values: [
            alertsData.critical.length,
            alertsData.warning.length,
            alertsData.info.length,
            alertsData.resolved.length
          ],
          labels: ['Crítico', 'Aviso', 'Informação', 'Resolvido'],
          type: 'pie',
          marker: {
            colors: ['#ff5252', '#ffbb33', '#33b5e5', '#00C851']
          },
          textinfo: 'percent',
          textposition: 'inside',
          hoverinfo: 'label+value+percent',
          hole: 0.5,
        }
      ],
      layout: {
        autosize: true,
        height: 250,
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.1 },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: { color: '#B0B0B0' },
        annotations: [
          {
            font: { color: 'white', size: 14 },
            showarrow: false,
            text: 'Alertas',
            x: 0.5,
            y: 0.5
          }
        ]
      }
    };
  };

  // Dados para gráfico de barras - Alertas por dia
  const getBarChartData = () => {
    return {
      data: [
        {
          x: ['12/06', '13/06', '14/06', '15/06'],
          y: [7, 5, 5, 3],
          type: 'bar',
          name: 'Total',
          marker: {
            color: '#4682B4'
          }
        },
        {
          x: ['12/06', '13/06', '14/06', '15/06'],
          y: [1, 0, 0, 2],
          type: 'bar',
          name: 'Crítico',
          marker: {
            color: '#ff5252'
          }
        },
        {
          x: ['12/06', '13/06', '14/06', '15/06'],
          y: [2, 0, 5, 0],
          type: 'bar',
          name: 'Aviso',
          marker: {
            color: '#ffbb33'
          }
        },
        {
          x: ['12/06', '13/06', '14/06', '15/06'],
          y: [4, 5, 0, 1],
          type: 'bar',
          name: 'Info',
          marker: {
            color: '#33b5e5'
          }
        }
      ],
      layout: {
        autosize: true,
        height: 250,
        margin: { t: 20, b: 40, l: 40, r: 20 },
        title: 'Tendência de Alertas',
        barmode: 'stack',
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: { color: '#B0B0B0' },
        xaxis: {
          gridcolor: '#333',
          tickfont: { color: '#B0B0B0' }
        },
        yaxis: {
          gridcolor: '#333',
          tickfont: { color: '#B0B0B0' }
        },
        showlegend: true,
        legend: { orientation: 'h', y: 1.1 }
      }
    };
  };

  // Função para renderizar ícone de acordo com o tipo de alerta
  const getAlertIcon = (alert) => {
    if (alertsData.critical.some(a => a.id === alert.id)) {
      return <i className="fas fa-exclamation-circle alert-icon critical"></i>;
    } else if (alertsData.warning.some(a => a.id === alert.id)) {
      return <i className="fas fa-exclamation-triangle alert-icon warning"></i>;
    } else if (alertsData.info.some(a => a.id === alert.id)) {
      return <i className="fas fa-info-circle alert-icon info"></i>;
    } else if (alertsData.resolved.some(a => a.id === alert.id)) {
      return <i className="fas fa-check-circle alert-icon resolved"></i>;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#00C4FF" size={50} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="alerts-container">
        <div className="page-header">
          <h1 className="title-divider">Alertas</h1>
          <div className="header-actions">
            <button className="button">
              <i className="fas fa-filter"></i> Filtrar
            </button>
            <button className="button">
              <i className="fas fa-cog"></i> Configurar
            </button>
            <button className="button primary">
              <i className="fas fa-bell-slash"></i> Limpar Todos
            </button>
          </div>
        </div>

        <div className="alerts-dashboard">
          <div className="alerts-stats">
            <div className="stats-card critical" onClick={() => setActiveTab('critical')}>
              <div className="stats-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{alertsData.critical.length}</div>
                <div className="stats-label">Críticos</div>
              </div>
            </div>
            <div className="stats-card warning" onClick={() => setActiveTab('warning')}>
              <div className="stats-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{alertsData.warning.length}</div>
                <div className="stats-label">Avisos</div>
              </div>
            </div>
            <div className="stats-card info" onClick={() => setActiveTab('info')}>
              <div className="stats-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{alertsData.info.length}</div>
                <div className="stats-label">Informações</div>
              </div>
            </div>
            <div className="stats-card resolved" onClick={() => setActiveTab('resolved')}>
              <div className="stats-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stats-content">
                <div className="stats-value">{alertsData.resolved.length}</div>
                <div className="stats-label">Resolvidos</div>
              </div>
            </div>
          </div>

          <div className="alerts-charts-container">
            <div className="chart-card">
              <Plot
                data={getPieChartData().data}
                layout={getPieChartData().layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="chart-card">
              <Plot
                data={getBarChartData().data}
                layout={getBarChartData().layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <div className="alerts-table-container">
            <div className="tabs">
              <button
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Todos ({alertsData.critical.length + alertsData.warning.length + alertsData.info.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'critical' ? 'active' : ''}`}
                onClick={() => setActiveTab('critical')}
              >
                Críticos ({alertsData.critical.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'warning' ? 'active' : ''}`}
                onClick={() => setActiveTab('warning')}
              >
                Avisos ({alertsData.warning.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Informações ({alertsData.info.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'resolved' ? 'active' : ''}`}
                onClick={() => setActiveTab('resolved')}
              >
                Resolvidos ({alertsData.resolved.length})
              </button>
            </div>

            <div className="alerts-list">
              {getFilteredAlerts().length === 0 ? (
                <div className="no-alerts">
                  <i className="fas fa-bell-slash"></i>
                  <p>Nenhum alerta encontrado</p>
                </div>
              ) : (
                getFilteredAlerts().map((alert) => (
                  <div 
                    key={alert.id}
                    className={`alert-item ${
                      alertsData.critical.some(a => a.id === alert.id) 
                        ? 'critical' 
                        : alertsData.warning.some(a => a.id === alert.id)
                          ? 'warning'
                          : alertsData.info.some(a => a.id === alert.id)
                            ? 'info'
                            : 'resolved'
                    }`}
                  >
                    <div className="alert-icon-container">
                      {getAlertIcon(alert)}
                    </div>
                    <div className="alert-content">
                      <div className="alert-header">
                        <div className="alert-time">{alert.time}</div>
                        <div className="alert-device">{alert.device}</div>
                      </div>
                      <div className="alert-message">{alert.message}</div>
                      {alert.status === 'resolved' && (
                        <div className="alert-resolved">
                          Resolvido em: {alert.resolvedAt}
                        </div>
                      )}
                    </div>
                    <div className="alert-actions">
                      {alert.status !== 'resolved' && (
                        <>
                          <button className="alert-action-btn">
                            <i className="fas fa-check"></i>
                          </button>
                          <button className="alert-action-btn">
                            <i className="fas fa-bell-slash"></i>
                          </button>
                        </>
                      )}
                      <button className="alert-action-btn">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;