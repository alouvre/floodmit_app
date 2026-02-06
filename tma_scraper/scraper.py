import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client

# 1. Ambil kredensial dari environment variable
url_sb = os.environ.get("SUPABASE_URL")
key_sb = os.environ.get("SUPABASE_KEY")

if not url_sb or not key_sb:
    print("❌ Error: API Key atau URL Supabase tidak ditemukan di Environment Variables!")
    exit(1)

supabase: Client = create_client(url_sb, key_sb)

# 2. Proses Scraping
target_url = "https://poskobanjir.dsdadki.web.id/"
try:
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(target_url, headers=headers, timeout=30)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    # Bidik tabel berdasarkan ID
    table = soup.find('table', {'id': 'ContentPlaceHolder1_CtrlDataTinggiAir_GridListPintuAir_DXMainTable'})
    
    if not table:
        print("❌ Error: Tabel data tidak ditemukan di halaman website.")
        exit(1)

    rows = table.find_all('tr', id=lambda x: x and 'DXDataRow' in x)
    print(f"✅ Ditemukan {len(rows)} baris data. Memulai proses simpan...")

    # 3. Loop dan Kirim ke Supabase
    for row in rows:
        cols = row.find_all('td')
        if len(cols) >= 8: # Pastikan kolom cukup
            lokasi_pengamatan = cols[1].text.strip()
            sungai = cols[2].text.strip()
            
            # Kolom TMA
            tinggi_text = cols[3].find('span').text.strip()
            tinggi_air = int(tinggi_text) if tinggi_text.isdigit() else 0
            
            # Deteksi Tren (Col 4)
            img_tren = cols[4].find('img')['src'] if cols[4].find('img') else ""
            tren = "Naik" if "up" in img_tren else "Turun" if "down" in img_tren else "Stabil"
            
            # Kolom Tanggal (Col 5) & Jam (Col 6)
            tanggal = cols[5].find('span').text.strip()
            jam = cols[6].find('span').text.strip()
            waktu_pengamatan = f"{tanggal} {jam}" # Contoh: "06/02/2026 18:00"
            
            # Deteksi Status (Col 7)
            status_src = cols[7].find('img')['src'] if cols[7].find('img') else ""
            status = "Normal"
            if "siaga1" in status_src: status = "Siaga 1"
            elif "siaga2" in status_src: status = "Siaga 2"
            elif "siaga3" in status_src: status = "Siaga 3"

            # Data Object
            data_to_save = {
                "lokasi": lokasi_pengamatan,
                "sungai": sungai,
                "tma_cm": tinggi_air,
                "tanggal_jam": waktu_pengamatan,
                "status": status,
                "tren": tren
            }
            
            try:
                # Simpan ke Supabase
                supabase.table("water_level_history").insert(data_to_save).execute()
                print(f"✔️ Berhasil simpan: {lokasi_pengamatan} ({sungai}) - {tinggi_air}cm - {waktu_pengamatan}")
            except Exception as e:
                print(f"⚠️ Gagal simpan {lokasi_pengamatan}. Error: {e}")

except Exception as e:
    print(f"❌ Terjadi kesalahan fatal: {e}")