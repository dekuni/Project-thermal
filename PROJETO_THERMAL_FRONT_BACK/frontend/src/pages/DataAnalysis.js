import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import ClipLoader from 'react-spinners/ClipLoader';
import { getThermalHistory } from '../services/api'; // Importar a função de api.js

const DataAnalysis = () => {
  const [thermalHistory, setThermalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current: 0,
    max: 0,
    min: 0,
    anomalies: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const historyResponse = await getThermalHistory(86400); // 24 horas em segundos
        console.log('Resposta completa:', historyResponse);
        if (historyResponse?.status === 'success' && historyResponse.data && historyResponse.data.length > 0) {
          const processedData = historyResponse.data.map((item) => {
            console.log('Item bruto:', item);
            return {
              ...item,
              datetime: new Date(item.datetime.replace(' ', 'T')),
              max_temperature: parseFloat(item.max_temperature),
              min_temperature: parseFloat(item.min_temperature),
              avg_temperature: parseFloat(item.avg_temperature),
              is_anomaly: item.is_anomaly === true || item.is_anomaly === 'true',
            };
          });

          const sortedData = processedData.sort((a, b) => a.datetime - b.datetime);
          console.log('Dados processados:', sortedData);
          setThermalHistory(sortedData);

          if (sortedData.length > 0) {
            const lastItem = sortedData[sortedData.length - 1];
            setStats({
              current: lastItem.avg_temperature.toFixed(1),
              max: Math.max(...sortedData.map((item) => item.max_temperature)).toFixed(1),
              min: Math.min(...sortedData.map((item) => item.min_temperature)).toFixed(1),
              anomalies: sortedData.filter((item) => item.is_anomaly).length,
            });
          } else {
            setStats({
              current: 0,
              max: 0,
              min: 0,
              anomalies: 0,
            });
          }
        } else {
          console.warn('Nenhum dado recebido da API.');
          setThermalHistory([]);
          setStats({
            current: 0,
            max: 0,
            min: 0,
            anomalies: 0,
          });
        }
      } catch (error) {
        console.error('Erro ao processar dados:', error);
        setThermalHistory([]);
        setStats({
          current: 0,
          max: 0,
          min: 0,
          anomalies: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAnalysisGraphData = () => {
    if (!thermalHistory || thermalHistory.length === 0) {
      console.warn('thermalHistory está vazio. Retornando dados vazios para o gráfico.');
      return { data: [], timeRange: null };
    }

    const groupedData = {};
    thermalHistory.forEach((item) => {
      const date = new Date(item.datetime);
      date.setMinutes(0, 0, 0);
      const timeKey = date.getTime();

      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          datetime: date,
          max_temperature: item.max_temperature,
          min_temperature: item.min_temperature,
          avg_temperature: item.avg_temperature,
          is_anomaly: item.is_anomaly,
          count: 1,
        };
      } else {
        const current = groupedData[timeKey];
        current.max_temperature = Math.max(current.max_temperature, item.max_temperature);
        current.min_temperature = Math.min(current.min_temperature, item.min_temperature);
        current.avg_temperature =
          (current.avg_temperature * current.count + item.avg_temperature) / (current.count + 1);
        current.count += 1;
        current.is_anomaly = current.is_anomaly || item.is_anomaly;
      }
    });

    const processedData = Object.values(groupedData)
      .sort((a, b) => a.datetime - b.datetime)
      .slice(-24);

    const formatDateTime = (datetime) => {
      return datetime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const graphData = [
      {
        x: processedData.map((item) => formatDateTime(item.datetime)),
        y: processedData.map((item) => item.max_temperature),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperatura Máxima',
        line: { color: '#ff5555', width: 2 },
        marker: { size: 6 },
      },
      {
        x: processedData.map((item) => formatDateTime(item.datetime)),
        y: processedData.map((item) => item.min_temperature),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperatura Mínima',
        line: { color: '#4682B4', width: 2 },
        marker: { size: 6 },
      },
      {
        x: processedData.map((item) => formatDateTime(item.datetime)),
        y: processedData.map((item) => item.avg_temperature),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperatura Média',
        line: { color: '#00e2c8', width: 2 },
        marker: { size: 6 },
      },
      {
        x: processedData.map((item) => formatDateTime(item.datetime)),
        y: Array(processedData.length).fill(35),
        type: 'scatter',
        mode: 'lines',
        name: 'Limite Crítico',
        line: { color: '#FF5555', width: 2, dash: 'dash' },
      },
      {
        x: processedData.map((item) => formatDateTime(item.datetime)),
        y: Array(processedData.length).fill(30),
        type: 'scatter',
        mode: 'lines',
        name: 'Limite de Alerta',
        line: { color: '#FFA500', width: 2, dash: 'dash' },
      },
    ];

    return {
      data: graphData,
      timeRange:
        processedData.length > 0
          ? {
              start: processedData[0].datetime,
              end: processedData[processedData.length - 1].datetime,
            }
          : null,
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#00e2c8" size={50} />
        <p className="loading-text">Carregando dados...</p>
      </div>
    );
  }

  const { data: graphData } = getAnalysisGraphData();

  return (
    <div className="main-content">
      <div className="column">
        <h1 className="title-divider">Análise de Dados</h1>
        <div className="content-wrapper">
          <div className="main-column">
            <h2>Análise Detalhada de Temperatura</h2>
            <div className="analysis-chart-container">
              <Plot
                data={graphData}
                layout={{
                  autosize: true,
                  height: 600,
                  plot_bgcolor: '#1a1a1a',
                  paper_bgcolor: '#1a1a1a',
                  font: { color: '#b0b0b0' },
                  xaxis: {
                    title: 'Hora',
                    showgrid: true,
                    gridcolor: 'rgba(255, 255, 255, 0.1)',
                    tickfont: { color: '#b0b0b0' },
                    tickangle: -45,
                    nticks: 24,
                    tickformat: '%H:%M',
                  },
                  yaxis: {
                    title: 'Temperatura (°C)',
                    showgrid: true,
                    gridcolor: 'rgba(255, 255, 255, 0.1)',
                    tickfont: { color: '#b0b0b0' },
                    range: [0, 50],
                  },
                  margin: { l: 50, r: 20, t: 40, b: 80 },
                  showlegend: true,
                  legend: {
                    x: 0,
                    y: 1.1,
                    orientation: 'h',
                    font: { color: '#b0b0b0' },
                  },
                }}
                config={{
                  responsive: true,
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <div className="right-column">
            <h2>📊 Estatísticas</h2>
            <div className="stats-box">
              <div className="metric-card">
                <div className="metric-label">Temperatura Atual</div>
                <div className="metric-value">
                  {stats.current}°C
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Máxima (24h)</div>
                <div className="metric-value">
                  {stats.max}°C
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Mínima (24h)</div>
                <div className="metric-value">
                  {stats.min}°C
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Anomalias Detectadas (24h)</div>
                <div
                  className="metric-value"
                  style={{
                    color: stats.anomalies > 0 ? '#FFA500' : '#00e2c8',
                  }}
                >
                  {stats.anomalies}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;