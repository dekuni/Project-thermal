// frontend/src/components/Notifications.js
import React, { useState, useEffect } from 'react';
import { getNotifications, clearNotifications } from '../services/api';
import SystemStatus from './SystemStatus';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(filter);
      setNotifications(response.data.notifications);
      setTotalNotifications(response.data.total_notifications);
      setCurrentTime(response.data.current_time);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await clearNotifications();
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchNotifications();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [filter, autoRefresh]);

  return (
    <div className="column">
      <h2>Notificações Recentes</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />{' '}
          Atualização automática
        </label>
        <button className="button" onClick={fetchNotifications}>Atualizar</button>
        <button className="button" onClick={handleClearNotifications}>Limpar tudo</button>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            backgroundColor: '#1E1E2F',
            color: '#B0B0B0',
            border: '1px solid #333',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <option value="Todas">Todas</option>
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Error">Error</option>
          <option value="Temperature">Temperature</option>
        </select>
      </div>
      <div style={{ fontSize: '12px', color: '#777', marginBottom: '10px' }}>
        Última atualização: {currentTime} | Total: {totalNotifications} notificações
      </div>
      <div
        style={{
          border: '1px solid #333',
          borderRadius: '5px',
          marginTop: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'scroll',
            backgroundColor: '#111',
            padding: '10px',
          }}
          className="notification-list"
        >
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification, index) => (
                <div key={index}>
                  <div className={`feed-item ${notification.level}`}>
                    <div className="feed-header">
                      <div className="feed-time">{notification.timestamp}</div>
                      <div className={`feed-content ${notification.level}`}>
                        {notification.level === 'info' && '✅'}
                        {notification.level === 'warning' && '⚠️'}
                        {notification.level === 'error' && '❌'}
                        {notification.level === 'temperature' && '🌡️'}{' '}
                        {notification.message}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <div className="feed-spacer"></div>}
                </div>
              ))}
              <div className="feed-counter">
                Exibindo {notifications.length} de {totalNotifications} notificações
              </div>
            </>
          ) : (
            <div className="no-notifications">Nenhuma notificação disponível</div>
          )}
        </div>
      </div>
      <SystemStatus />
    </div>
  );
};

export default Notifications;