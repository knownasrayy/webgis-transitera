---
name: mapid-maps-integration
description: Integration guide for MAPID MAPS Basemaps (Street, Dark, Satellite in MapLibre GL JS) and GEO MAPID REST API data fetching with authentication, polygon bounding boxes, and pagination.
---

# MAPID MAPS & GEO MAPID API Integration Guide (TransitERA)

Panduan teknis resmi integrasi basemap **MAPID MAPS** dan REST API sinkronisasi data survei **GEO MAPID** untuk platform **TransitERA**.

---

## 1. Konfigurasi Basemap Wajib MAPID MAPS

Seluruh peta pada antarmuka TransitERA **WAJIB** menggunakan basemap resmi MAPID MAPS via library **MapLibre GL JS**:

### URL Style Endpoints:
* **Street Style**: `https://p2basemap.mapid.io/styles/street/style.json?key={MAPID_API_KEY}`
* **Dark Style**: `https://p2basemap.mapid.io/styles/dark/style.json?key={MAPID_API_KEY}`
* **Satellite Style**: `https://p2basemap.mapid.io/styles/satellite/style.json?key={MAPID_API_KEY}`

### Implementasi React / MapLibre GL JS:
```typescript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export const BASEMAP_STYLES = {
  street: `https://p2basemap.mapid.io/styles/street/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`,
  dark: `https://p2basemap.mapid.io/styles/dark/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`,
  satellite: `https://p2basemap.mapid.io/styles/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPID_API_KEY}`
};

export function initMap(container: HTMLElement, styleKey: keyof typeof BASEMAP_STYLES = 'street'): maplibregl.Map {
  const map = new maplibregl.Map({
    container,
    style: BASEMAP_STYLES[styleKey],
    center: [112.7521, -7.2575], // Surabaya City Center (Gubeng)
    zoom: 13,
    pitch: 0,
    bearing: 0
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

  return map;
}
```

---

## 2. Integrasi GEO MAPID REST API (Data Survei Lapangan)

Untuk mengambil data titik survei primer (*Activity* `#PakSibukGa` dan *Mission* Properti/Struk/Menu Go):

* **Base Endpoint**: `https://server.mapid.io/web/competition/`
* **Method**: `POST`
* **Headers**:
  * `Content-Type`: `application/json`
  * `X-API-KEY`: `{MAPID_API_KEY}` *(Diambil dari environment variables)*

### Struktur Request Body:
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

### Python Helper Pipeline untuk Sinkronisasi Data:
```python
import os
import requests
import geopandas as gpd

MAPID_API_KEY = os.getenv("MAPID_API_KEY")
ENDPOINT = "https://server.mapid.io/web/competition/"

def fetch_all_survey_data(polygon_coords: list, hashtag: str = "PakSibukGa") -> gpd.GeoDataFrame:
    """Mengambil seluruh data survei kompetisi dengan penanganan pagination otomatis."""
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
            "hashtag": [hashtag]
        }
        
        response = requests.post(ENDPOINT, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        features = data.get("features", [])
        all_features.extend(features)
        
        has_more = data.get("hasMore", False)
        offset += len(features)
        
        # Break jika tidak ada data tambahan
        if not features:
            break
            
    geojson_data = {
        "type": "FeatureCollection",
        "features": all_features
    }
    
    return gpd.GeoDataFrame.from_features(geojson_data, crs="EPSG:4326")
```

---

## 3. Best Practices & Ketentuan Operasional

1. **Jadwal Maintenance Server**: Hindari penarikan data masif atau sinkronisasi terjadwal pada rentang **16:00 – 17:00 WIB** setiap hari (periode *maintenance & database backup* rutin server MAPID).
2. **Caching Strategy**: Data hasil fetch disimpan di PostgreSQL/PostGIS lokal dan di-cache di Redis agar antarmuka WebGIS tetap responsif tanpa membebani limit API MAPID.
3. **Limit Pagination**:
   * Data **Mission**: Maksimal 100 fitur per batch request (`offset` berbasis 100).
   * Data **Activity**: Maksimal 60 fitur per batch request.
