import os
import logging
import random
import requests

logger = logging.getLogger(__name__)

MAPID_API_KEY = os.getenv("MAPID_API_KEY", "")
# GEO MAPID Competition endpoint (POST, polygon + hashtag filter)
ENDPOINT = "https://server.mapid.io/web/competition/"


def fetch_survey_geojson(polygon_coords: list, hashtag: str = "PakSibukGa") -> dict:
    """
    Mengambil data survei kompetisi dari GEO MAPID REST API dengan pagination otomatis.
    Mengembalikan GeoJSON FeatureCollection dict langsung (tanpa geopandas).

    Trade-off dari refactor ini:
      + Jauh lebih ringan: tidak ada GDAL/geopandas dependency → Docker build ~5 menit lebih cepat
      + Tidak ada eval() security vulnerability
      - Kehilangan operasi spasial berbasis GeoDataFrame; jika di masa depan dibutuhkan
        (misal: spatial join ke H3 grid), perlu ditambahkan kembali atau gunakan shapely saja.
    """
    if not MAPID_API_KEY:
        logger.warning("MAPID_API_KEY tidak diset — menggunakan data dummy survey.")
        return {"type": "FeatureCollection", "features": _generate_dummy_survey_data()}

    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": MAPID_API_KEY,
    }

    all_features = []
    offset = 0

    while True:
        payload = {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": polygon_coords,
            },
            "offset": offset,
            "hashtag": [hashtag],
        }

        try:
            logger.info(f"Fetching MAPID survey data (offset={offset}, hashtag={hashtag!r})…")
            resp = requests.post(ENDPOINT, json=payload, headers=headers, timeout=30)

            if resp.status_code == 401 or resp.status_code == 403:
                logger.error(
                    f"MAPID API auth error {resp.status_code} — periksa MAPID_API_KEY di .env. "
                    f"Menggunakan data dummy."
                )
                break
            elif resp.status_code == 404:
                logger.warning(
                    "MAPID API 404: Kemungkinan data survei belum diinput ke platform GEO MAPID, "
                    "atau hashtag '#PakSibukGa' belum terdaftar pada akun ini. "
                    "Menggunakan data dummy lokal."
                )
                break

            resp.raise_for_status()
            data = resp.json()
        except requests.exceptions.Timeout:
            logger.error("MAPID API timeout (>30s) — menggunakan data dummy.")
            break
        except requests.exceptions.RequestException as e:
            logger.error(f"MAPID API request gagal: {e}")
            break

        features = data.get("features", [])
        all_features.extend(features)

        if not features or not data.get("hasMore", False):
            break

        offset += len(features)

    if not all_features:
        logger.info("MAPID API tidak mengembalikan fitur — menggunakan data dummy survey.")
        all_features = _generate_dummy_survey_data()

    return {"type": "FeatureCollection", "features": all_features}


def _generate_dummy_survey_data() -> list:
    """Men-generate data survei dummy di sekitar 5 stasiun utama untuk mode offline/testing."""
    stations = {
        "gubeng":     [-7.2654, 112.7521],
        "pasar_turi": [-7.2478, 112.7306],
        "semut":      [-7.2372, 112.7431],
        "wonokromo":  [-7.3014, 112.7383],
        "waru":       [-7.3519, 112.7297],
    }

    rng = random.Random(42)  # Seeded untuk hasil deterministik (reproducible)
    features = []

    for st_id, (base_lat, base_lon) in stations.items():
        for i in range(20):
            lat = base_lat + (rng.random() - 0.5) * 0.015
            lon = base_lon + (rng.random() - 0.5) * 0.015

            survey_type = rng.choice(["activity", "mission"])
            mission_subtype = (
                rng.choice(["properti_go", "struk_go", "menu_go"])
                if survey_type == "mission"
                else None
            )

            if survey_type == "activity":
                desc = rng.choice([
                    "Trotoar berlubang",
                    "PKL memakan bahu jalan",
                    "Fasilitas halte memadai",
                    "Tidak ada zebra cross",
                ])
            elif mission_subtype == "properti_go":
                desc = rng.choice(["Ruko Disewakan 50jt/th", "Tanah Kosong Dijual"])
            elif mission_subtype == "struk_go":
                desc = rng.choice(["Indomaret (Rp. 25.000)", "Kopi Kenangan (Rp. 45.000)"])
            else:
                desc = rng.choice(["Menu Warteg (Rp. 15.000)", "Menu Mie Gacoan"])

            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
                "properties": {
                    "hashtag": ["PakSibukGa"],
                    "survey_type": survey_type,
                    "mission_subtype": mission_subtype,
                    "station_cluster": st_id,
                    "description": desc,
                    "user": f"surveyor_{rng.randint(1, 5)}",
                },
            })

    return features
