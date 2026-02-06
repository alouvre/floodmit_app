floodguard/
├── ai_engine/ # (Struktur data/model yang Anda buat sebelumnya)
│ ├── data/ # Raw, Processed, External
│ │ ├── raw/
│ │ │ ├── meteo_hourly_2024_2025.csv
│ │ │ └── pda_jakarta_2024_2025.csv
│ │ ├── processed/
│ │ │ └── final_dataset_train.csv
│ │ └── external/ # Data pendukung (koordinat, info pintu air)
│ │ └── stations_metadata.json
│ ├── notebooks/ # Eksplorasi LSTM/RNN
| │ ├── 01_scraping_meteo.ipynb
| │ ├── 02_scraping_pda_govt.ipynb
| │ ├── 03_data_cleaning_merging.ipynb
| │ └── 04_model_training_lstm.ipynb
│ ├── src/ # Scraper, Processor, Predictor
| │ ├── scraper.py # Fungsi untuk ambil data OpenMeteo & Web Govt
| │ ├── processor.py # Fungsi untuk cleaning & feature engineering
| │ └── model_predictor.py # Arsitektur model AI (LSTM/RNN)
│ └── models/ # SavedModel (.h5)
│
├── backend_api/ # (Folder app/ Anda sebelumnya)
│ ├── main.py # FastAPI/Flask sebagai jembatan AI ke Mobile
│ ├── services/ # Logika NLP Urgency Scoring & Speech-to-Text
│ └── requirements.txt # Library Python
│
├── mobile_app/ # (Struktur React Native Modular)
│ ├── src/
│ │ ├── api/ # Konsumsi API dari backend_api
│ │ ├── components/ # Atoms, Molecules, Organisms
│ │ ├── hooks/ # useGeofencing, useFloodStatus
│ │ ├── screens/ # AdminDashboard, UserMap, EmergencyReport
│ │ └── navigation/ # Stack & Tab Navigation
│ └── package.json # Library React Native
│
└── README.md # Dokumentasi seluruh sistem
