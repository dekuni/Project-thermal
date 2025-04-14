// frontend/src/pages/Reports.js
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Plot from 'react-plotly.js';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportType, setReportType] = useState('temperature');
  const [reportPeriod, setReportPeriod] = useState('week');
  const [generatingReport, setGeneratingReport] = useState(false);

  // Dados simulados para os relatórios
  const temperatureData = {
    day: {
      x: Array.from({ length: 24 }).map((_, i) => `${i}:00`),
      y: [23, 22.8, 22.5, 22.3, 22, 21.8, 22, 22.5, 23.2, 24, 24.8, 25.5, 26.3, 27, 27.5, 27.8, 27.5, 27, 26.5, 25.8, 25, 24.5, 24, 23.5],
    },
    week: {
      x: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      y: [
        [22, 24, 26, 25, 24, 23, 22], // Mínimas
        [25, 27, 29, 28, 26, 25, 24], // Médias
        [27, 29, 32, 30, 28, 27, 26]  // Máximas
      ],
    },
    month: {
      x: Array.from({ length: 30 }).map((_, i) => `${i + 1}/6`),
      y: Array.from({ length: 30 }).map(() => 22 + Math.random() * 8),
    }
  };

  const alertsData = {
    day: {
      x: Array.from({ length: 24 }).map((_, i) => `${i}:00`),
      y: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0],
    },
    week: {
      x: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      y: [2, 1, 5, 3, 4, 0, 2],
    },
    month: {
      x: Array.from({ length: 30 }).map((_, i) => `${i + 1}/6`),
      y: Array.from({ length: 30 }).map(() => Math.floor(Math.random() * 5)),
    }
  };

  useEffect(() => {
    // Simular carregamento de dados
    const fetchReports = async () => {
      setLoading(true);
      try {
        // Simulação de chamada de API
        setTimeout(() => {
          setReports([
            { id: 1, name: 'Relatório Semanal Temperatura', date: '2023-06-12', type: 'temperature', period: 'week', format: 'pdf' },
            { id: 2, name: 'Relatório Mensal Completo', date: '2023-06-01', type: 'all', period: 'month', format: 'excel' },
            { id: 3, name: 'Histórico de Alertas', date: '2023-05-31', type: 'alerts', period: 'month', format: 'pdf' },
            { id: 4, name: 'Tendências Diárias', date: '2023-05-30', type: 'temperature', period: 'day', format: 'pdf' },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const generateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
      // Simulação de relatório gerado
      setReports([
        { 
          id: Math.floor(Math.random() * 1000), 
          name: `Relatório ${reportPeriod === 'day' ? 'Diário' : reportPeriod === 'week' ? 'Semanal' : 'Mensal'} ${
            reportType === 'temperature' ? 'Temperatura' : 
            reportType === 'alerts' ? 'Alertas' : 'Completo'
          }`, 
          date: new Date().toISOString().slice(0, 10), 
          type: reportType, 
          period: reportPeriod, 
          format: 'pdf' 
        },
        ...reports
      ]);
    }, 2000);
  };

  const getChartData = () => {
    let data = [], layout = { yaxis: {} };
    
    if (reportType === 'temperature') {
      const selectedData = temperatureData[reportPeriod];
      
      if (reportPeriod === 'week') {
        data = [
          {
            x: selectedData.x,
            y: selectedData.y[0],
            type: 'scatter',
            mode: 'lines',
            name: 'Mínima',
            line: { color: '#33b5e5' }
          },
          {
            x: selectedData.x,
            y: selectedData.y[1],
            type: 'scatter',
            mode: 'lines',
            name: 'Média',
            line: { color: '#4682B4' }
          },
          {
            x: selectedData.x,
            y: selectedData.y[2],
            type: 'scatter',
            mode: 'lines',
            name: 'Máxima',
            line: { color: '#ff5252' }
          }
        ];
      } else {
        data = [
          {
            x: selectedData.x,
            y: selectedData.y,
            type: 'scatter',
            mode: 'lines',
            name: 'Temperatura',
            line: { color: '#4682B4' }
          },
          {
            x: [selectedData.x[0], selectedData.x[selectedData.x.length - 1]],
            y: [30, 30],
            type: 'scatter',
            mode: 'lines',
            name: 'Limite de Alerta',
            line: { 
              color: '#ffbb33',
              dash: 'dot'
            }
          },
          {
            x: [selectedData.x[0], selectedData.x[selectedData.x.length - 1]],
            y: [35, 35],
            type: 'scatter',
            mode: 'lines',
            name: 'Limite Crítico',
            line: { 
              color: '#ff5252',
              dash: 'dot'
            }
          }
        ];
      }
      
      layout = {
        title: 'Temperatura',
        yaxis: { title: 'Temperatura (°C)' }
      };
    } else if (reportType === 'alerts') {
      const selectedData = alertsData[reportPeriod];
      
      data = [{
        x: selectedData.x,
        y: selectedData.y,
        type: 'bar',
        name: 'Alertas',
        marker: { color: '#ff5252' }
      }];
      
      layout = {
        title: 'Alertas',
        yaxis: { title: 'Número de Alertas' }
      };
    } else if (reportType === 'all') {
      // Tratar tipo "all" (relatório completo)
      const tempData = temperatureData[reportPeriod];
      const alertData = alertsData[reportPeriod];
      
      // Combinar dados de temperatura e alertas
      data = [
        {
          x: tempData.x,
          y: reportPeriod === 'week' ? tempData.y[1] : tempData.y, // Usar médias para semana
          type: 'scatter',
          mode: 'lines',
          name: 'Temperatura',
          line: { color: '#4682B4' },
          yaxis: 'y'
        },
        {
          x: alertData.x,
          y: alertData.y,
          type: 'bar',
          name: 'Alertas',
          marker: { color: '#ff5252' },
          yaxis: 'y2'
        }
      ];
      
      layout = {
        title: 'Relatório Completo',
        yaxis: { 
          title: 'Temperatura (°C)',
          titlefont: { color: '#4682B4' },
          tickfont: { color: '#4682B4' }
        },
        yaxis2: {
          title: 'Número de Alertas',
          titlefont: { color: '#ff5252' },
          tickfont: { color: '#ff5252' },
          overlaying: 'y',
          side: 'right'
        }
      };
    }
    
    return {
      data,
      layout: {
        ...layout,
        autosize: true,
        height: 400,
        margin: { l: 50, r: 50, t: 30, b: 50 },
        plot_bgcolor: '#1a1a1a',
        paper_bgcolor: '#1a1a1a',
        font: { color: '#B0B0B0' },
        xaxis: {
          gridcolor: '#333',
          tickfont: { color: '#B0B0B0' }
        },
        yaxis: {
          ...layout.yaxis,
          gridcolor: '#333',
          tickfont: { color: '#B0B0B0' }
        },
        legend: {
          orientation: 'h',
          y: 1.1
        }
      }
    };
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
      <div className="reports-container">
        <div className="page-header">
          <h1 className="title-divider">Relatórios</h1>
          <div className="header-actions">
            <button className="button primary" onClick={generateReport} disabled={generatingReport}>
              {generatingReport ? (
                <>
                  <ClipLoader color="#FFFFFF" size={14} css={css`margin-right: 8px;`} />
                  Gerando...
                </>
              ) : (
                <>
                  <i className="fas fa-file-export"></i> Gerar Relatório
                </>
              )}
            </button>
          </div>
        </div>

        <div className="reports-dashboard">
          <div className="report-generator">
            <h2>Novo Relatório</h2>
            <div className="generator-options">
              <div className="option-group">
                <label>Tipo de Dados</label>
                <div className="options-row">
                  <button 
                    className={`option-btn ${reportType === 'temperature' ? 'active' : ''}`} 
                    onClick={() => setReportType('temperature')}
                  >
                    <i className="fas fa-temperature-high"></i> Temperatura
                  </button>
                  <button 
                    className={`option-btn ${reportType === 'alerts' ? 'active' : ''}`} 
                    onClick={() => setReportType('alerts')}
                  >
                    <i className="fas fa-exclamation-triangle"></i> Alertas
                  </button>
                  <button 
                    className={`option-btn ${reportType === 'all' ? 'active' : ''}`} 
                    onClick={() => setReportType('all')}
                  >
                    <i className="fas fa-chart-pie"></i> Completo
                  </button>
                </div>
              </div>
              
              <div className="option-group">
                <label>Período</label>
                <div className="options-row">
                  <button 
                    className={`option-btn ${reportPeriod === 'day' ? 'active' : ''}`} 
                    onClick={() => setReportPeriod('day')}
                  >
                    <i className="fas fa-calendar-day"></i> Diário
                  </button>
                  <button 
                    className={`option-btn ${reportPeriod === 'week' ? 'active' : ''}`} 
                    onClick={() => setReportPeriod('week')}
                  >
                    <i className="fas fa-calendar-week"></i> Semanal
                  </button>
                  <button 
                    className={`option-btn ${reportPeriod === 'month' ? 'active' : ''}`} 
                    onClick={() => setReportPeriod('month')}
                  >
                    <i className="fas fa-calendar-alt"></i> Mensal
                  </button>
                </div>
              </div>
              
              <div className="option-group">
                <label>Formato</label>
                <div className="options-row">
                  <button className="option-btn active">
                    <i className="fas fa-file-pdf"></i> PDF
                  </button>
                  <button className="option-btn">
                    <i className="fas fa-file-excel"></i> Excel
                  </button>
                  <button className="option-btn">
                    <i className="fas fa-file-csv"></i> CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="report-preview">
              <h3>Pré-visualização</h3>
              <div className="preview-chart">
                <Plot
                  data={getChartData().data}
                  layout={getChartData().layout}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>

          <div className="reports-history">
            <h2>Relatórios Gerados</h2>
            <div className="reports-list">
              {reports.length === 0 ? (
                <div className="no-reports">
                  <i className="fas fa-file-alt"></i>
                  <p>Nenhum relatório encontrado</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="report-item">
                    <div className="report-icon">
                      {report.format === 'pdf' ? (
                        <i className="fas fa-file-pdf"></i>
                      ) : report.format === 'excel' ? (
                        <i className="fas fa-file-excel"></i>
                      ) : (
                        <i className="fas fa-file-csv"></i>
                      )}
                    </div>
                    <div className="report-content">
                      <div className="report-name">{report.name}</div>
                      <div className="report-details">
                        <span className="report-date">
                          <i className="far fa-calendar-alt"></i> {report.date}
                        </span>
                        <span className="report-type">
                          {report.type === 'temperature' ? (
                            <><i className="fas fa-temperature-high"></i> Temperatura</>
                          ) : report.type === 'alerts' ? (
                            <><i className="fas fa-exclamation-triangle"></i> Alertas</>
                          ) : (
                            <><i className="fas fa-chart-pie"></i> Completo</>
                          )}
                        </span>
                        <span className="report-period">
                          {report.period === 'day' ? (
                            <><i className="fas fa-calendar-day"></i> Diário</>
                          ) : report.period === 'week' ? (
                            <><i className="fas fa-calendar-week"></i> Semanal</>
                          ) : (
                            <><i className="fas fa-calendar-alt"></i> Mensal</>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="report-actions">
                      <button className="report-action-btn">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="report-action-btn">
                        <i className="fas fa-share-alt"></i>
                      </button>
                      <button className="report-action-btn">
                        <i className="fas fa-trash-alt"></i>
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

export default Reports;