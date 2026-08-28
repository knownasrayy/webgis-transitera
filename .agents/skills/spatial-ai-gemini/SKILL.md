---
name: spatial-ai-gemini
description: Standardized development guide for building the Spatial AI Assistant in TransitERA WebGIS using Google Gemini API Function Calling, FastAPI proxy backend, structured outputs, spatial query mapping, token optimization, and RAG over survey narratives.
---

# Spatial AI Gemini Assistant Guide (TransitERA)

Panduan ini mengatur implementasi **Spatial AI Assistant** berbasis **Google Gemini API** pada platform **TransitERA WebGIS**, mengacu pada arahan teknis Coaching 2 (Mas Mahrus) dan Coaching 3 (Pak Sena - Juri MAPID).

---

## 1. Prinsip Arsitektur Utama

```
+------------------------------------------------------------------------+
|                         FRONTEND (Next.js)                              |
|  - Input teks / Curated Quick Prompts                                  |
|  - Render Chat Bubble (text_response)                                  |
|  - Eksekusi MapLibre Actions (json_response: filter, zoom, highlight)  |
+-----------------------------------+------------------------------------+
                                    | HTTPS POST /api/ai/query
                                    v
+------------------------------------------------------------------------+
|                        BACKEND (FastAPI Proxy)                          |
|  - Ambil prompt & user context (viewport bbox, active layers)          |
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

### Aturan Wajib Arsitektur & Keamanan:
1. **API Key Isolation**: `GEMINI_API_KEY` **WAJIB** disimpan di `.env` server backend (FastAPI) atau Next.js API Routes. **Dilarang keras** mengekspos token di client-side.
2. **Dual-Output Response**: Output backend selalu memisahkan format data:
   * `text_response`: Narasi human-readable & rekomendasi kebijakan untuk pengguna.
   * `json_response`: Perintah terstruktur untuk manipulasi visual peta di MapLibre GL JS.
3. **Parameter Generator, Bukan Kalkulator Geometri**: AI hanya bertugas mengekstrak parameter (nama stasiun, radius buffer, jenis filter). Perhitungan koordinat dan manipulasi spasial dieksekusi oleh PostGIS / Turf.js.
4. **Token Optimization**: Jangan pernah mengirimkan *raw GeoJSON* masif ke prompt Gemini. Kirim hanya metadata ringkas atau minta Gemini menghasilkan query filter.

---

## 2. Definisi Skema JSON Function Calling

Daftar tools yang didaftarkan ke Gemini API:

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
        "description": "Memfilter tampilan layer peta berdasarkan kriteria tertentu (misal titik survei Menu Go, Struk Go, atau Activity).",
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

## 3. Format Output Standar Backend

Setiap endpoint `/api/ai/query` mengembalikan JSON response dengan format konsisten:

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

## 4. Guardrails & Validasi Spasial

### Validasi Bounding Box Surabaya:
Frontend dan Backend wajib memastikan koordinat berada dalam batas Metropolitan Surabaya:
```python
SURABAYA_BBOX = {
    "min_lon": 112.55,
    "max_lon": 112.85,
    "min_lat": -7.38,
    "max_lat": -7.18
}

def validate_coordinates(lon: float, lat: float) -> bool:
    return (SURABAYA_BBOX["min_lon"] <= lon <= SURABAYA_BBOX["max_lon"] and
            SURABAYA_BBOX["min_lat"] <= lat <= SURABAYA_BBOX["max_lat"])
```

---

## 5. Daftar Curated Prompts (UI Quick Buttons)

Sediakan tombol *quick prompt* pada chat panel antarmuka untuk memudahkan juri dan pengguna:

1. *"Tampilkan skor TOD di sekitar Stasiun Gubeng"*
2. *"Bandingkan skor TOD Gubeng dan Wonokromo"*
3. *"Apa dimensi TOD terlemah di Stasiun Pasar Turi?"*
4. *"Berapa estimasi kenaikan nilai tanah di sekitar Waru?"*
5. *"Tampilkan lokasi warung makan ramai di dekat stasiun"*
6. *"Jika feeder WiraWiri diperpanjang ke Waru, apa dampaknya?"*
7. *"Di mana lokasi terbaik untuk buka kedai kopi dekat stasiun?"*
