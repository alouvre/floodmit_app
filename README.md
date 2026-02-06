Platform monitoring banjir terintegrasi yang menggabungkan automated web scraping, manajemen data berbasis cloud, dan aplikasi mobile untuk memberikan informasi Tinggi Muka Air (TMA) secara real-time kepada masyarakat Jakarta.

🏗️ Arsitektur Sistem

Sistem ini terdiri dari beberapa modul utama yang bekerja secara sinkron:

- mobile_app/: Aplikasi berbasis React Native (Expo) untuk visualisasi data, statistik TMA, dan pelaporan darurat oleh pengguna.
- tma_scrapper/: Bot Python yang melakukan scraping data dari situs Posko Banjir Jakarta setiap jam menggunakan GitHub Actions.
- backend_api/: Layanan backend (Node.js/Supabase) untuk manajemen autentikasi dan integrasi database
- ai_engine/: Modul analisis data (opsional/pengembangan) untuk prediksi potensi banjir.

📁 Struktur Direktori

floodmit/
├── .github/workflows/ # Konfigurasi otomatisasi CI/CD & Scraper
├── ai_engine/ # Analisis data & Machine Learning
├── backend_api/ # API Service & Logic
├── mobile_app/ # Source code aplikasi React Native
├── tma_scrapper/ # Script Python Scraper & Requirements
└── README.md # Dokumentasi Utama
