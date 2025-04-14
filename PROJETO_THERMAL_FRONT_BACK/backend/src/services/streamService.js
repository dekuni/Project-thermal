// backend/src/services/streamService.js
const { spawn } = require('child_process');
const WebSocket = require('ws');

class StreamService {
    constructor() {
        this.ffmpegProcess = null;
        this.status = {
            isActive: false,
            startTime: null,
            resolution: '800x600',
            fps: 30
        };
    }

    async startStream(wss) {
        if (this.ffmpegProcess) {
            return {
                status: 'success',
                message: 'Stream já está ativo',
                data: { 
                    isActive: true,
                    wsUrl: 'ws://localhost:5000'
                }
            };
        }

        try {
            const rtspUrl = 'rtsp://admin:Lotus@407@192.168.2.115:554/Streaming/Channels/2';
            const ffmpegArgs = [
                '-i', rtspUrl,
                '-f', 'mpegts',
                '-codec:v', 'mpeg1video',
                '-s', '800x600',
                '-b:v', '1000k',
                '-bf', '0',
                '-r', '30',
                'pipe:1'
            ];

            this.ffmpegProcess = spawn('ffmpeg', ffmpegArgs);
            console.log('FFMPEG processo iniciado');

            this.ffmpegProcess.stdout.on('data', (data) => {
                if (wss && wss.clients) {
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    });
                }
            });

            this.ffmpegProcess.stderr.on('data', (data) => {
                console.log(`FFMPEG Log: ${data.toString()}`);
            });

            this.ffmpegProcess.on('error', (error) => {
                console.error('Erro no processo FFMPEG:', error);
                this.status.isActive = false;
            });

            this.ffmpegProcess.on('close', (code) => {
                console.log(`FFMPEG processo fechado com código ${code}`);
                this.status.isActive = false;
                this.ffmpegProcess = null;
            });

            this.status.isActive = true;
            this.status.startTime = new Date();

            return {
                status: 'success',
                message: 'Stream iniciado com sucesso',
                data: {
                    isActive: true,
                    wsUrl: 'ws://localhost:5000'
                }
            };

        } catch (error) {
            console.error('Erro ao iniciar stream:', error);
            this.status.isActive = false;
            return {
                status: 'error',
                message: 'Falha ao iniciar stream',
                error: error.message
            };
        }
    }

    async stopStream() {
        if (this.ffmpegProcess) {
            this.ffmpegProcess.kill();
            this.ffmpegProcess = null;
        }

        this.status.isActive = false;
        this.status.startTime = null;

        return {
            status: 'success',
            message: 'Stream parado com sucesso',
            data: { isActive: false }
        };
    }

    async getStatus() {
        return {
            status: 'success',
            data: {
                ...this.status,
                isActive: !!this.ffmpegProcess
            }
        };
    }
}

// Exportar uma instância do serviço
module.exports = new StreamService();