const { spawn } = require('child_process');

class ThermalService {
    constructor() {
        this.csvFilePath = 'C:\\Users\\marco\\Desktop\\Project_thermal_front_back\\Thermal_API\\thermal_data_API.csv';
        this.pythonScriptPath = 'C:\\Users\\marco\\Desktop\\Project_thermal_front_back\\Thermal_API\\process_temperature.py';
        this.pythonInterpreter = 'C:\\Users\\marco\\Desktop\\Project_thermal_front_back\\Thermal_API\\venv\\Scripts\\python.exe';
    }

    async getThermalHistory() {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn(this.pythonInterpreter, [
                this.pythonScriptPath,
                this.csvFilePath
            ]);

            let output = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Erro ao executar script Python:', errorOutput);
                    return reject(new Error(`Falha ao processar os dados: ${errorOutput}`));
                }

                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (error) {
                    console.error('Erro ao parsear saída do Python:', error);
                    reject(new Error('Erro ao processar os dados retornados'));
                }
            });
        });
    }

    async getThermalStatus() {
        return this.getThermalHistory();
    }
}

module.exports = new ThermalService();
