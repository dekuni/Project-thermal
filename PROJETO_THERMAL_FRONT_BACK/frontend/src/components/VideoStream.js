// frontend/src/components/VideoStream.js
import React, { useState, useEffect, useRef } from 'react';
import { startStream, stopStream, getStreamStatus } from '../services/api';
import JSMpeg from '@cycjimmy/jsmpeg-player';

const VideoStream = () => {
  const [status, setStatus] = useState('Desconectado');
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const initializePlayer = () => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = new JSMpeg.Player('ws://localhost:5000', {
        canvas: videoRef.current,
        autoplay: true,
        audio: false,
        loop: true
      });
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await getStreamStatus();
      setStatus(response.data.status);
    } catch (error) {
      setStatus('Erro ao obter status');
    }
  };

  const handleStartStream = async () => {
    try {
      await startStream();
      setStreaming(true);
      fetchStatus();
      initializePlayer();
    } catch (error) {
      console.error('Erro ao iniciar o stream:', error);
    }
  };

  const handleStopStream = async () => {
    try {
      await stopStream();
      setStreaming(false);
      fetchStatus();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    } catch (error) {
      console.error('Erro ao parar o stream:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="column">
      <h2>Câmera Térmica (Tempo Real)</h2>
      <div>
        <button className="button" onClick={handleStartStream}>Iniciar Stream</button>
        <button className="button" onClick={handleStopStream}>Parar Stream</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        Status: <strong>{status}</strong>
      </div>
      <div style={{ marginTop: '10px' }}>
        {streaming ? (
          <canvas
            ref={videoRef}
            style={{ width: '100%', border: '2px solid #00C4FF', borderRadius: '5px' }}
          />
        ) : (
          <div
            style={{
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              padding: '100px',
              fontSize: '24px',
              border: '2px solid #00C4FF',
              borderRadius: '5px',
            }}
          >
            Sem transmissão
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStream;