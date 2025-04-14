import React, { useState } from 'react';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    temperatureUnit: 'celsius',
    criticalLimit: 35,
    warningLimit: 30
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1 className="title-divider">Configurações</h1>
        <div className="header-actions">
          <button className="button">
            <i className="fas fa-undo"></i> Restaurar Padrões
          </button>
          <button className="button primary">
            <i className="fas fa-save"></i> Salvar Alterações
          </button>
        </div>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button className="settings-nav-item active">
              <i className="fas fa-sliders-h"></i> Geral
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-bell"></i> Notificações
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-thermometer-half"></i> Sensores
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-video"></i> Câmera
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-file-alt"></i> Relatórios
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-user-cog"></i> Usuários
            </button>
            <button className="settings-nav-item">
              <i className="fas fa-shield-alt"></i> Segurança
            </button>
          </div>
        </div>
        
        <div className="settings-content">
          <div className="content-card">
            <h2><i className="fas fa-sliders-h"></i> Configurações Gerais</h2>
            
            <form className="settings-form">
              <div className="form-group">
                <label>Tema</label>
                <select 
                  name="theme" 
                  value={generalSettings.theme}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Unidade de Temperatura</label>
                <select 
                  name="temperatureUnit" 
                  value={generalSettings.temperatureUnit}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Limite de Alerta (°C)</label>
                <input 
                  type="number" 
                  name="warningLimit"
                  value={generalSettings.warningLimit}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Limite Crítico (°C)</label>
                <input 
                  type="number" 
                  name="criticalLimit"
                  value={generalSettings.criticalLimit}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="notifications" 
                  name="notifications"
                  checked={generalSettings.notifications}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="notifications" className="form-check-label">
                  Habilitar Notificações
                </label>
              </div>
              
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="autoRefresh" 
                  name="autoRefresh"
                  checked={generalSettings.autoRefresh}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label htmlFor="autoRefresh" className="form-check-label">
                  Atualização Automática
                </label>
              </div>
              
              {generalSettings.autoRefresh && (
                <div className="form-group indent">
                  <label>Intervalo de Atualização (segundos)</label>
                  <input 
                    type="number" 
                    name="refreshInterval"
                    value={generalSettings.refreshInterval}
                    onChange={handleChange}
                    className="form-control"
                    min="10"
                    max="300"
                  />
                </div>
              )}
            </form>
          </div>
          
          <div className="content-card">
            <h2><i className="fas fa-cog"></i> Configurações Avançadas</h2>
            <p className="text-muted">
              Estas configurações afetam o desempenho do sistema e devem ser alteradas apenas por usuários avançados.
            </p>
            
            <div className="advanced-settings disabled">
              <div className="form-group">
                <label>Sensibilidade dos Sensores</label>
                <select className="form-control" disabled>
                  <option>Padrão</option>
                  <option>Alta</option>
                  <option>Baixa</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Modelo de Previsão</label>
                <select className="form-control" disabled>
                  <option>Padrão (ARIMA)</option>
                  <option>Linear</option>
                  <option>Profundo (LSTM)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Intervalo de Amostragem (segundos)</label>
                <input type="number" className="form-control" value="5" disabled />
              </div>
              
              <div className="lock-message">
                <i className="fas fa-lock"></i> Entre como administrador para modificar estas configurações
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;