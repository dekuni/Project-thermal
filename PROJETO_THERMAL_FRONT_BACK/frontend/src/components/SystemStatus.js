// frontend/src/components/SystemStatus.js
import React, { useState, useEffect } from 'react';
import { getSystemStatus } from '../services/api';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    operational: true,
    network: true,
    camera_connected: false,
    storage_free: 75,
    last_update: '',
  });

  const fetchStatus = async () => {
    try {
      const response = await getSystemStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Erro ao buscar status do sistema:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Status do Sistema</h3>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: status.operational ? '#00cc00' : '#ff5555', marginRight: '8px' }}>●</span>
        <span>Sistema {status.operational ? 'operacional' : 'com problemas'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: status.network ? '#00cc00' : '#ff5555', marginRight: '8px' }}>●</span>
        <span>Conexão de rede {status.network ? 'estabelecida' : 'com problemas'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: status.camera_connected ? '#00cc00' : '#ff5555', marginRight: '8px' }}>●</span>
        <span>Câmera {status.camera_connected ? 'conectada' : 'desconectada'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#00cc00', marginRight: '8px' }}>●</span>
        <span>Armazenamento: {status.storage_free}% livre</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ color: '#00cc00', marginRight: '8px' }}>○</span>
        <span>Atualizado: {status.last_update}</span>
      </div>
    </div>
  );
};

export default SystemStatus;