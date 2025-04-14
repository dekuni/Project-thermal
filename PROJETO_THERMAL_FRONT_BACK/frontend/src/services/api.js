import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajustado para porta 5000
});

export const startStream = () => api.get('/stream/start_stream');
export const stopStream = () => api.get('/stream/stop_stream');
export const getStreamStatus = () => api.get('/stream/status');
export const getNotifications = (filter) => api.get(`/notifications/notifications${filter ? `?filter=${filter}` : ''}`);
export const clearNotifications = () => api.post('/notifications/clear_notifications');
export const getSystemStatus = () => api.get('/notifications/system_status');

export const getAlertById = (id) => api.get(`/alerts/${id}`);
export const resolveAlert = (id) => api.post(`/alerts/${id}/resolve`);
export const clearAllAlerts = () => api.post('/alerts/clear');

export const startThermalReading = () => api.post('/thermal/start');
export const stopThermalReading = () => api.post('/thermal/stop');

export const getThermalHistory = async (seconds = 86400) => {
    try {
        const response = await api.get(`/thermal/history/${seconds}`);
        const sortedData = response.data.data.sort((a, b) => 
            new Date(b.datetime) - new Date(a.datetime)
        );
        return { status: response.data.status, data: sortedData };
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
};

export const getThermalStatus = async () => {
    try {
        const response = await api.get('/thermal/status');
        return response.data.data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
};

export const getGraphData = async () => {
    try {
        const response = await api.get('/thermal/graph-data');
        return response.data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
};

export const getAlerts = async () => {
    try {
        const response = await api.get('/thermal/alerts');
        return response.data;
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
};