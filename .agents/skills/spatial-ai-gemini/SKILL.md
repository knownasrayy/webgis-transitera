---
name: spatial-ai-gemini
description: Standardized development guide for building the User-Facing Spatial AI Assistant in TransitERA WebGIS using Google Gemini API Function Calling, FastAPI proxy backend, structured dual-outputs, 4 AI patterns (Function Router, Query Filter, Dynamic Web Scraper, Parameter Builder), token optimization, and RAG over survey narratives.
---

# Spatial AI Gemini Assistant Guide (TransitERA)

Panduan teknis resmi implementasi **Spatial AI Assistant** berbasis **Google Gemini API** pada platform **TransitERA WebGIS**, mengadopsi prinsip arsitektur dari **Coaching 2 (Mas Mahrus - Tech Lead MAPID)** dan arahan industri **Coaching 3 (Pak Sena - Juri MAPID)**.

---

## 1. Prinsip Arsitektur Utama & Ekspektasi Juri

```
+------------------------------------------------------------------------+
|                         FRONTEND (Next.js 15)                          |
|  - Input teks / Curated Quick Prompts (Shortcuts)                      |
|  - Render Chat Bubble (text_response)                                  |
|  - Eksekusi MapLibre Actions (json_response: filter, zoom, highlight)  |
+-----------------------------------+------------------------------------+
                                    | HTTPS POST /api/ai/query
                                    v
+------------------------------------------------------------------------+
|                        BACKEND (FastAPI Proxy)                          |
|  - Terima prompt & user context (viewport bbox, active layers)          |
|  - Panggil Gemini API via JSON Function Calling (Strict Schema)        |
|  - Eksekusi kueri PostGIS / H3 query builder secara lokal              |
|  - Bentuk dual output: text_response + json_response                   |
+-------------------+-------------------------------+--------------------+
                    |                               |
                    v                               v
    +-------------------------------+   +-----------------------+
    | Google Gemini API (Free Tier) |   | PostgreSQL + PostGIS  |
    | - Intent classification       |   | - H3 Grid Index       |
    | - Parameter extraction        |   | - TOD Scores (AHP)    |
    | - Function name routing       |   | - Survey Activity RAG |
    +-------------------------------+   +-----------------------+
```

### Aturan Wajib Arsitektur & Keamanan (Coaching 2):
1. **AI User-Facing (Front-end Interaktif) adalah Prioritas Utama**: Juri menilai bagaimana AI berinteraksi langsung dengan pengguna dan memanipulasi peta, bukan sekadar preprocessing data offline.
2. **API Key Isolation**: `GEMINI_API_KEY` **WAJIB** disimpan di environment variable backend (`.env`). Dilarang keras mengekspos token di client-side.
3. **Pemisahan Dual-Output (Wajib)**:
   $$\text{AI Response} = \begin{cases} \mathbf{JSON\ Response} & \text{(Data terstruktur untuk manipulasi peta \& eksekusi fungsi)} \\ \mathbf{Text\ Response} & \text{(Penjelasan naratif/konfirmasi human-readable kepada user)} \end{cases}$$
4. **Parameter Generator, Bukan Kalkulator Geometri**: AI bertugas mengekstrak parameter (nama stasiun, radius buffer, filter). Perhitungan koordinat dan manipulasi spasial dieksekusi oleh PostGIS / Turf.js untuk mencegah halusinasi geometri.
5. **Token Optimization**: Jangan pernah melempar *raw GeoJSON* masif ke prompt Gemini. Minta Gemini menghasilkan kriteria query filter yang dieksekusi lokal di database.

---

## 2. Empat Pola Penerapan AI WebGIS (Mas Mahrus)

### Pola 1: AI sebagai *Function Router* (Trigger Function by Name)
- **Konsep:** Menggunakan AI sebagai shortcut pengganti navigasi UI yang kompleks. User mengetik instruksi bahasa alami, AI memilih fungsi spasial yang tepat.
- **Contoh:** *"Tampilkan skor TOD stasiun Gubeng"* $\rightarrow$ memicu fungsi `get_tod_score(station="gubeng")`.
- **Kelebihan:** Sangat stabil dan deterministik karena kalkulasi dijalankan oleh engine WebGIS.

### Pola 2: AI untuk *Filtering* & Manipulasi Data Spasial
- **Konsep:** AI menerjemahkan bahasa alami menjadi parameter penyaring atribut data tabel / GeoJSON.
- **Contoh:** *"Tampilkan warung kuliner yang ramai di dekat stasiun"* $\rightarrow$ AI menghasilkan filter `{"kategori": "kuliner", "kondisi": "ramai"}`.

### Pola 3: Integrasi *Web Search API* untuk Data Eksternal Dinamis
- **Konsep:** Menggabungkan LLM dengan web search API untuk memperkaya konteks data secara real-time.
- **Guardrail:** Wajib validasi koordinat di frontend untuk menangani koordinat `null` atau `[0, 0]`.

### Pola 4: *Parameter Builder* untuk Geometri Spasial
- **Konsep:** AI mengekstrak parameter inti ($lat, long, radius$), kemudian library geospasial (*Turf.js*, *h3-js*, atau *Shapely*) menggambar geometrinya secara presisi.

---

## 3. Definisi Skema JSON Function Calling

Daftar tools yang didaftarkan ke Gemini API di FastAPI backend:

```python
SPATIAL_TOOLS = [
    {
        "name": "get_tod_score",
        "description": "Mengambil skor kesiapan TOD 5D dan tipologi kawasan pada simpul stasiun tertentu di Surabaya.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_id": {
                    "type": "string",
                    "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "ID simpul stasiun transit SRRL."
                }
            },
            "required": ["station_id"]
        }
    },
    {
        "name": "compare_stations",
        "description": "Membandingkan skor kesiapan TOD 5 dimensi antara dua stasiun transit.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_a": {"type": "string", "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]},
                "station_b": {"type": "string", "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]}
            },
            "required": ["station_a", "station_b"]
        }
    },
    {
        "name": "get_weakest_dimension",
        "description": "Mengidentifikasi dimensi indikator 5D TOD terlemah pada stasiun untuk rekomendasi kebijakan perbaikan.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_id": {"type": "string", "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]}
            },
            "required": ["station_id"]
        }
    },
    {
        "name": "get_njop_premium",
        "description": "Mengambil estimasi kenaikan nilai tanah (%ΔNJOP) berbasis Spatial Durbin Model di sekitar simpul transit.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_id": {"type": "string", "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"]}
            },
            "required": ["station_id"]
        }
    },
    {
        "name": "filter_layer",
        "description": "Memfilter tampilan layer peta berdasarkan kriteria tertentu (Menu Go, Struk Go, Properti Go, atau Activity).",
        "parameters": {
            "type": "object",
            "properties": {
                "target_layer": {
                    "type": "string",
                    "enum": ["h3_tod_score", "h3_njop_premium", "survey_activity", "survey_mission_menu", "survey_mission_properti"]
                },
                "criteria": {
                    "type": "object",
                    "description": "Key-value filter criteria, misal {'kondisi': 'ramai', 'min_score': 70}"
                }
            },
            "required": ["target_layer", "criteria"]
        }
    },
    {
        "name": "simulate_scenario",
        "description": "Mensimulasikan dampak skenario perluasan koridor feeder WiraWiri/Suroboyo Bus terhadap skor TOD dan %ΔNJOP.",
        "parameters": {
            "type": "object",
            "properties": {
                "scenario_id": {
                    "type": "string",
                    "enum": ["extend_feeder_waru", "add_feeder_semut", "dedicated_pedestrian_gubeng"],
                    "description": "ID skenario intervensi yang disimulasikan."
                }
            },
            "required": ["scenario_id"]
        }
    },
    {
        "name": "site_recommendation",
        "description": "Memberikan rekomendasi sel H3 terbaik untuk pembukaan usaha UMKM kuliner berdasarkan proksi daya beli (Struk Go) dan keramaian (Menu Go).",
        "parameters": {
            "type": "object",
            "properties": {
                "business_type": {
                    "type": "string",
                    "enum": ["coffee_shop", "warung_makan", "retail_minimarket"],
                    "description": "Kategori usaha yang ingin dibuka."
                },
                "target_station": {
                    "type": "string",
                    "enum": ["all", "gubeng", "pasar_turi", "semut", "wonokromo", "waru"]
                }
            },
            "required": ["business_type"]
        }
    }
]
```

---

## 4. Format Output Standar Backend (`/api/ai/query`)

```json
{
  "status": "success",
  "data": {
    "action": "highlight_and_zoom",
    "target_layer": "h3_tod_score",
    "target_station": "wonokromo",
    "view_state": {
      "center": [112.738, -7.301],
      "zoom": 14.5,
      "pitch": 30
    },
    "filter_query": {
      "station_id": "wonokromo",
      "h3_indexes": ["8865e23659fffff", "8865e2365bfffff"]
    },
    "chart_payload": {
      "type": "radar_5d",
      "scores": {
        "density": 82.5,
        "diversity": 74.0,
        "design": 58.2,
        "destination_accessibility": 79.1,
        "distance_to_transit": 88.0
      },
      "overall_tod_score": 76.4
    },
    "text_response": "Kawasan Stasiun Wonokromo memiliki **TOD Readiness Score sebesar 76,4 (Kategori: Baik)**. Dimensi terkuat adalah *Distance to Transit* (88,0), sedangkan dimensi terlemah adalah *Design* (58,2) akibat kualitas trotoar pejalan kaki yang belum merata di koridor timur stasiun. Direkomendasikan penambahan jalur pedestrian berkanopi dan penertiban parkir liar di radius 400m."
  }
}
```

---

## 5. Guardrails & Validasi Spasial

### Validasi Bounding Box Surabaya:
Frontend dan Backend wajib memastikan koordinat berada dalam batas Metropolitan Surabaya:
```python
SURABAYA_BBOX = {
    "min_lon": 112.55,
    "max_lon": 112.90,
    "min_lat": -7.45,
    "max_lat": -7.15
}

def validate_coordinates(lon: float, lat: float) -> bool:
    return (SURABAYA_BBOX["min_lon"] <= lon <= SURABAYA_BBOX["max_lon"] and
            SURABAYA_BBOX["min_lat"] <= lat <= SURABAYA_BBOX["max_lat"])
```

---

## 6. Curated Prompts (UI Quick Shortcuts)

Sediakan tombol *quick prompt* pada chat panel antarmuka untuk memudahkan juri dan pengguna:

1. *"Tampilkan skor TOD di sekitar Stasiun Gubeng"*
2. *"Bandingkan skor TOD Gubeng dan Wonokromo"*
3. *"Apa dimensi TOD terlemah di Stasiun Pasar Turi?"*
4. *"Berapa estimasi kenaikan nilai tanah di sekitar Wonokromo?"*
5. *"Tampilkan lokasi warung makan ramai di dekat stasiun"*
6. *"Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?"*
7. *"Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?"*
