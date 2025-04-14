import pandas as pd
import sys
import json
from datetime import datetime, timedelta

def process_data(csv_path):
    try:
        data = pd.read_csv(csv_path)

        if data.empty:
            return {"status": "success", "data": []}

        # Conversões de tipo
        data['datetime'] = pd.to_datetime(data['datetime'])
        data['max_temperature'] = data['max_temperature'].astype(float)
        data['min_temperature'] = data['min_temperature'].astype(float)
        data['avg_temperature'] = data['avg_temperature'].astype(float)
        data['is_anomaly'] = data['is_anomaly'].astype(bool)

        # Filtrar últimas 12 horas
        now = datetime.now()
        time_limit = now - timedelta(hours=12)
        data = data[data['datetime'] >= time_limit]

        # Conversão para string após o filtro
        data['datetime'] = data['datetime'].astype(str)

        result = data[['datetime', 'max_temperature', 'min_temperature', 'avg_temperature', 'is_anomaly']]
        return {"status": "success", "data": result.to_dict(orient='records')}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({
            "status": "error",
            "message": "Uso correto: python process_temperature.py <csv_path>"
        }), file=sys.stderr)
        sys.exit(1)

    csv_path = sys.argv[1]
    result = process_data(csv_path)
    print(json.dumps(result))  # JSON único e estruturado
