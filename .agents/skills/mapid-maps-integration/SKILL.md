---
name: mapid-maps-integration
description: Comprehensive integration guide for MAPID MAPS Basemaps (Street 3D/2D, Street 2D, Dark, Light, Satellite across GL Style, TileJSON, WMTS, XYZ formats in MapLibre GL JS), MAPID Data Catalog ingestion, and GEO MAPID REST API survey synchronization.
---

# MAPID MAPS & GEO MAPID API Integration Guide (TransitERA)

Panduan teknis resmi integrasi basemap **MAPID MAPS**, katalog data spasial **MAPID Data Catalog**, dan REST API sinkronisasi data survei **GEO MAPID** untuk platform **TransitERA**.

---

## 1. Katalog & Spesifikasi Lengkap Basemap MAPID MAPS

MAPID MAPS menyediakan 5 style basemap resmi dengan dukungan multi-format (**GL Style**, **TileJSON**, **WMTS**, dan **XYZ**):

### 1.1 Daftar Style & Endpoint Detail:

| Style & Nama | Pengidentifikasi | Format Endpoint URL | Rekomendasi Penggunaan |
| :--- | :--- | :--- | :--- |
| **Dark Mapid** *(Dark mode)* | `dark` | • **GL Style:** `https://basemap.mapid.io/styles/dark/style.json?key={API_KEY}`<br>• **TileJSON:** `https://basemap.mapid.io/styles/512/dark.json?key={API_KEY}`<br>• **WMTS:** `https://basemap.mapid.io/styles/dark/wmts.xml?key={API_KEY}`<br>• **XYZ:** `https://basemap.mapid.io/styles/dark/512/{z}/{x}/{y}.png?key={API_KEY}` | **Tema Utama WebGIS:** Kontras maksimal untuk visualisasi layer cerah (H3 Choropleth TOD Score, %ΔNJOP, Heatmap). |
| **Street Mapid** *(Default: 3D & 2D building)* | `basic` | • **GL Style:** `https://basemap.mapid.io/styles/basic/style.json?key={API_KEY}`<br>• **TileJSON:** `https://basemap.mapid.io/styles/512/basic.json?key={API_KEY}`<br>• **WMTS:** `https://basemap.mapid.io/styles/basic/wmts.xml?key={API_KEY}`<br>• **XYZ:** `https://basemap.mapid.io/styles/basic/512/{z}/{x}/{y}.png?key={API_KEY}` | Navigasi perkotaan, gedung 3D, dan pemetaan rute feeder. |
| **Street Mapid (2D only)** *(2D building only style)* | `street-2d-building` | • **GL Style:** `https://basemap.mapid.io/styles/street-2d-building/style.json?key={API_KEY}`<br>• **TileJSON:** `https://basemap.mapid.io/styles/512/street-2d-building.json?key={API_KEY}`<br>• **WMTS:** `https://basemap.mapid.io/styles/street-2d-building/wmts.xml?key={API_KEY}`<br>• **XYZ:** `https://basemap.mapid.io/styles/street-2d-building/512/{z}/{x}/{y}.png?key={API_KEY}` | Mode *performance / lightweight* untuk perangkat mobile atau render layer masif. |
| **Light Mapid** *(Light mode style)* | `light` | • **GL Style:** `https://basemap.mapid.io/styles/light/style.json?key={API_KEY}`<br>• **TileJSON:** `https://basemap.mapid.io/styles/512/light.json?key={API_KEY}`<br>• **WMTS:** `https://basemap.mapid.io/styles/light/wmts.xml?key={API_KEY}`<br>• **XYZ:** `https://basemap.mapid.io/styles/light/512/{z}/{x}/{y}.png?key={API_KEY}` | Tampilan bersih untuk presentasi, infografik, dan ekspor laporan formal. |
| **Satellite** *(High-res satellite style)* | `satellite` | • **GL Style:** `https://basemap.mapid.io/styles/satellite/style.json?key={API_KEY}`<br>• **TileJSON:** `https://basemap.mapid.io/styles/512/satellite.json?key={API_KEY}`<br>• **WMTS:** `https://basemap.mapid.io/styles/satellite/wmts.xml?key={API_KEY}`<br>• **XYZ:** `https://basemap.mapid.io/styles/satellite/512/{z}/{x}/{y}.png?key={API_KEY}` | Verifikasi visual tutupan lahan, koridor rel kereta SRRL, dan kondisi fisik lapangan. |

---

### 1.2 Implementasi MapLibre GL JS di Next.js:

```typescript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPID_KEY = process.env.NEXT_PUBLIC_MAPID_API_KEY;

export const BASEMAP_STYLES = {
  dark: `https://basemap.mapid.io/styles/dark/style.json?key=${MAPID_KEY}`,
  street: `https://basemap.mapid.io/styles/basic/style.json?key=${MAPID_KEY}`,
  'street-2d': `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${MAPID_KEY}`,
  light: `https://basemap.mapid.io/styles/light/style.json?key=${MAPID_KEY}`,
  satellite: `https://basemap.mapid.io/styles/satellite/style.json?key=${MAPID_KEY}`
};

export function initMap(container: HTMLElement, styleKey: keyof typeof BASEMAP_STYLES = 'dark'): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: BASEMAP_STYLES[styleKey],
    center: [112.7521, -7.2654], // Surabaya City Center (Gubeng)
    zoom: 13.2,
    pitch: 0,
    bearing: 0
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  return map;
}

// Ganti basemap dinamis tanpa menghapus custom layers
export function switchBasemap(map: maplibregl.Map, styleKey: keyof typeof BASEMAP_STYLES) {
  map.setStyle(BASEMAP_STYLES[styleKey], { diff: true });
}
```

---

## 2. Integrasi GEO MAPID REST API (Data Survei Lapangan)

Untuk mengambil data titik survei primer (*Activity* dengan tagar `#PakSibukGa` dan *Mission* Properti/Struk/Menu Go):

* **Base Endpoint**: `https://server.mapid.io/web/competition/`
* **HTTP Method**: `POST`
* **Request Headers**:
  * `Content-Type`: `application/json`
  * `X-API-KEY`: `{MAPID_API_KEY}` *(Dihasilkan dari Dashboard GEO MAPID, disimpan di `.env`)*

### 2.1 Struktur Request Body (GeoJSON Polygon BBox & Filter):
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [112.70, -7.36],
        [112.80, -7.36],
        [112.80, -7.20],
        [112.70, -7.20],
        [112.70, -7.36]
      ]
    ]
  },
  "offset": 0,
  "hashtag": ["PakSibukGa"]
}
```

### 2.2 Spesifikasi Data & Batasan Pagination:
1. **Data Activity (Community Maps - Wajib)**:
   - Data semiterstruktur berisi foto, narasi deskriptif, koordinat GPS, dan tagar wajib `#PakSibukGa`.
   - Batas respon: Maksimal **60 fitur** per batch request.
2. **Data Mission (Properti Go, Struk Go, Menu Go - Opsional)**:
   - Data terstruktur formulir terstandarisasi.
   - Batas respon: Maksimal **100 fitur** per batch request (`offset` bertambah kelipatan 100 ketika `hasMore: true`).

### 2.3 Python ETL Helper Pipeline:
```python
import os
import time
import requests
import geopandas as gpd
from datetime import datetime

MAPID_API_KEY = os.getenv("MAPID_API_KEY")
COMPETITION_ENDPOINT = "https://server.mapid.io/web/competition/"

def is_maintenance_time() -> bool:
    """Cek apakah saat ini berada dalam rentang maintenance rutin server MAPID (16:00 - 17:00 WIB)."""
    now = datetime.now()
    return now.hour == 16

def fetch_all_survey_data(polygon_coords: list, hashtag: str = "PakSibukGa", max_retries: int = 3) -> gpd.GeoDataFrame:
    if is_maintenance_time():
        print("⚠️ Warning: Rentang maintenance server MAPID (16:00-17:00 WIB). Gunakan local cache jika memungkinkan.")

    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": MAPID_API_KEY
    }
    
    all_features = []
    offset = 0
    has_more = True
    
    while has_more:
        payload = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": polygon_coords
            },
            "offset": offset,
            "hashtag": [hashtag] if hashtag else []
        }
        
        success = False
        for attempt in range(max_retries):
            try:
                response = requests.post(COMPETITION_ENDPOINT, json=payload, headers=headers, timeout=30)
                response.raise_for_status()
                data = response.json()
                
                features = data.get("features", [])
                all_features.extend(features)
                
                has_more = data.get("hasMore", False)
                offset += len(features)
                success = True
                break
            except requests.exceptions.RequestException as e:
                time.sleep(2 ** attempt)  # Exponential backoff
                if attempt == max_retries - 1:
                    print(f"❌ Gagal mengambil batch offset {offset}: {e}")
                    has_more = False
        
        if not success or not features:
            break
            
    geojson_data = {
        "type": "FeatureCollection",
        "features": all_features
    }
    
    if not all_features:
        return gpd.GeoDataFrame(geometry=[], crs="EPSG:4326")
        
    return gpd.GeoDataFrame.from_features(geojson_data, crs="EPSG:4326")
```

---

## 3. Pemanfaatan MAPID Data Catalog (163 Datasets)

| Tema Katalog | Dataset Spesifik | Peran dalam Model TransitERA |
| :--- | :--- | :--- |
| **Social** | Demografi & Kepadatan Penduduk | Variabel *Density* (Bobot AHP 5D) |
| **Economy** | People Spending & Transaksi | Proksi aktivitas ekonomi lokal & validasi Struk Go |
| **Nature & Env** | Nighttime Light (NTL 2023) | Indikator intensitas aktivitas nokturnal per sel H3 |
| **Nature & Env** | Land Surface Temp (LST) & UHI | Variabel kontrol lingkungan (*disamenity factor*) pada SDM |
| **Nature & Env** | Wilayah Risiko Banjir | Variabel kontrol genangan air pada model regresi nilai lahan |
| **Transportation** | Jaringan Rel KAI & Halte | Variabel simpul transit & *Distance to Transit* |
| **Economy & Tourism** | POI Perdagangan, Pendidikan, Kuliner | Variabel *Destination Accessibility* & *Diversity* |

---

## 4. Best Practices & Ketentuan Operasional

1. **Jadwal Maintenance Server**: Dilarang melakukan penarikan data masif terjadwal pada rentang **16:00 – 17:00 WIB** setiap hari.
2. **Local Caching (PostGIS & Redis)**: Seluruh data survei dan katalog yang telah ditarik wajib disimpan di PostgreSQL/PostGIS lokal dan di-cache di Redis agar aplikasi cepat dan tidak membebani limit kuota API.
3. **Data Protection (PII Sanitization)**: Seluruh atribut personal (nama surveyor, plat nomor kendaraan, nomor kontak pada struk) wajib disanitasi sebelum data disajikan ke layer publik.
