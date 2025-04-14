import requests
from requests.auth import HTTPDigestAuth
import json
import logging
import csv
from datetime import datetime
import os
import time

# Configuração de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configurações da câmera
CAMERA_IP = "192.168.2.115"
USERNAME = "admin"
PASSWORD = "Lotus@407"
TEMPERATURE_URL = f"http://{CAMERA_IP}/ISAPI/Thermal/channels/2/thermometry/realTimethermometry/rules?format=json"
CSV_FILE = "thermal_data_API.csv"

# Função para inicializar o CSV
def initialize_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["datetime", "max_temperature", "min_temperature", "avg_temperature", "is_anomaly"])

# Função para escrever uma linha no CSV
def write_to_csv(data):
    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            data["datetime"],
            data["max_temperature"],
            data["min_temperature"],
            data["avg_temperature"],
            data["is_anomaly"]
        ])

def read_temperature_stream():
    # Inicializa o CSV
    initialize_csv()

    while True:  # Loop infinito para reconexão
        try:
            logging.info("Connecting to real-time thermometry stream...")
            response = requests.get(
                TEMPERATURE_URL,
                auth=HTTPDigestAuth(USERNAME, PASSWORD),
                stream=True,
                timeout=(5, 60)
            )

            if response.status_code != 200:
                logging.error(f"Failed to connect: {response.status_code} - {response.text}")
                time.sleep(10)  # Espera 10 segundos antes de tentar reconectar
                continue

            logging.info("Connected successfully. Waiting for data...")

            buffer = ""
            boundary = "--boundary"
            for chunk in response.iter_content(chunk_size=512, decode_unicode=True):
                if chunk:
                    buffer += chunk.decode('utf-8', errors='ignore')

                    while True:
                        boundary_start_idx = buffer.find(boundary)
                        if boundary_start_idx == -1:
                            break

                        boundary_end_idx = buffer.find(boundary, boundary_start_idx + len(boundary))
                        if boundary_end_idx == -1:
                            break

                        part = buffer[boundary_start_idx + len(boundary):boundary_end_idx].strip()
                        buffer = buffer[boundary_end_idx:]

                        json_start_idx = part.find("{")
                        if json_start_idx == -1:
                            continue

                        json_str = part[json_start_idx:].strip()
                        if not json_str:
                            continue

                        try:
                            data = json.loads(json_str)
                            thermometry_list = data.get("ThermometryUploadList", {}).get("ThermometryUpload", [])
                            for upload in thermometry_list:
                                line_poly = upload.get("LinePolygonThermCfg", {})
                                max_temp = float(line_poly.get("MaxTemperature", "N/A"))
                                min_temp = float(line_poly.get("MinTemperature", "N/A"))
                                avg_temp = float(line_poly.get("AverageTemperature", "N/A"))
                                timestamp = upload.get("absTime", None)

                                if timestamp is not None:
                                    dt = datetime.fromtimestamp(timestamp)
                                    dt_str = dt.strftime("%Y-%m-%d %H:%M:%S")
                                else:
                                    dt_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                                is_anomaly = max_temp > 25 if max_temp != "N/A" else False

                                logging.info(f"Timestamp {timestamp}: Max: {max_temp}°C, Min: {min_temp}°C, Avg: {avg_temp}°C, Anomaly: {is_anomaly}")

                                csv_data = {
                                    "datetime": dt_str,
                                    "max_temperature": max_temp,
                                    "min_temperature": min_temp,
                                    "avg_temperature": avg_temp,
                                    "is_anomaly": is_anomaly
                                }
                                write_to_csv(csv_data)

                        except json.JSONDecodeError as e:
                            logging.error(f"Error parsing JSON: {e} - JSON string: {json_str}")
                        except Exception as e:
                            logging.error(f"Unexpected error: {e}")

        except Exception as e:
            logging.error(f"Error reading stream: {e}")
            time.sleep(10)  # Espera 10 segundos antes de tentar reconectar

if __name__ == "__main__":
    read_temperature_stream()