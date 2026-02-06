from supabase import create_client, Client
import os

# Ambil kredensial dari environment variable (diset di GitHub Secrets)
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# Test input satu data dummy
# def test_insert():
#     data = {
#         "lokasi": "P.A. Marina Ancol",
#         "sungai": "Laut",
#         "tma_cm": 205,
#         "status": "Siaga 3",
#         "tren": "Naik",
#         "waktu_pengamatan": "06/02/2026 15:00"
#     }
    
#     response = supabase.table("water_level_history").insert(data).execute()
#     print("Berhasil!")

# test_insert()