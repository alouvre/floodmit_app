import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import os
import time
from datetime import datetime, timedelta

# 1. Setup API Client dengan Cache dan Retry agar lebih aman
cache_session = requests_cache.CachedSession('.cache', expire_after=-1)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

def fetch_monthly_meteo(lat, lon, start_dt, end_dt):
    url = "https://archive-api.open-meteo.com/v1/archive"
    hourly_vars = [ "precipitation",                # Index 0
                    "rain",                         # Index 1
                    "soil_moisture_0_to_7cm",       # Index 2
                    "soil_moisture_7_to_28cm",      # Index 3
                    "soil_moisture_28_to_100cm",    # Index 4
                    "soil_moisture_100_to_255cm",   # Index 5
                    "surface_pressure",             # Index 6
                    "relative_humidity_2m",         # Index 7
        ],
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_dt,
        "end_date": end_dt,
        "hourly": hourly_vars,
        "timezone": "Asia/Jakarta"
    }
    responses = openmeteo.weather_api(url, params=params)
    
    response = responses[0]
    print(f"Coordinates: {response.Latitude()}°N {response.Longitude()}°E")
    print(f"Elevation: {response.Elevation()} m asl")
    print(f"Timezone difference to GMT+0: {response.UtcOffsetSeconds()}s")

    hourly = response.Hourly()
    # Pastikan index Variable sesuai dengan urutan di params['hourly']
    data = {
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True).tz_convert('Asia/Jakarta'),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True).tz_convert('Asia/Jakarta'),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive='left'
        ),
        "total_precipitation": hourly.Variables(0).ValuesAsNumpy(),
        "rain_only": hourly.Variables(1).ValuesAsNumpy(),
        "soil_moisture_0_7cm": hourly.Variables(2).ValuesAsNumpy(),
        "soil_moisture_7_28cm": hourly.Variables(3).ValuesAsNumpy(),
        "soil_moisture_28_100cm": hourly.Variables(4).ValuesAsNumpy(),
        "soil_moisture_100_255cm": hourly.Variables(5).ValuesAsNumpy(),
        "surface_pressure": hourly.Variables(6).ValuesAsNumpy(),
        "humidity": hourly.Variables(7).ValuesAsNumpy(),
    }
    return pd.DataFrame(data)

# --- KONFIGURASI UTAMA ---
LATITUDE = -6.2146  # Jakarta
LONGITUDE = 106.8451
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 12, 31)
SAVE_PATH = "data/raw/"

# Buat folder jika belum ada
os.makedirs(SAVE_PATH, exist_ok=True)

current_date = START_DATE
while current_date < END_DATE:
    # Tentukan akhir bulan ini
    next_date = current_date + timedelta(days=30)
    if next_date > END_DATE:
        next_date = END_DATE
    
    str_start = current_date.strftime('%Y-%m-%d')
    str_end = next_date.strftime('%Y-%m-%d')
    
    file_name = f"{SAVE_PATH}meteo_jakarta_{str_start}.csv"
    
    # Cek apakah file sudah ada agar tidak scrap ulang (Idempotency)
    if os.path.exists(file_name):
        print(f"Skipping: {str_start} (File sudah ada)")
    else:
        print(f"Downloading: {str_start} to {str_end}...")
        try:
            df_monthly = fetch_monthly_meteo(LATITUDE, LONGITUDE, str_start, str_end)
            df_monthly.to_csv(file_name, index=False)
            print(f"Successfully saved {file_name}")
            # Jeda 2 detik antar request agar tidak kena ban
            time.sleep(5)
        except Exception as e:
            print(f"Error pada {str_start}: {e}")
    
    # Lanjut ke bulan berikutnya
    current_date = next_date + timedelta(days=1)

print("\n--- SEMUA DATA BERHASIL DIUNDUH ---")