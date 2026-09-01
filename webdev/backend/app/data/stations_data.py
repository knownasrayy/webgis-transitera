import math
from typing import Dict, Any, List

from app.spatial.h3_grid import generate_station_h3_cluster

STATIONS_DATA: Dict[str, Dict[str, Any]] = {
    "gubeng": {
        "id": "gubeng",
        "name": "Stasiun Surabaya Gubeng",
        "latitude": -7.2654,
        "longitude": 112.7521,
        "tod_readiness_score": 84.5,
        "scores": {
            "density": 88.0,
            "diversity": 85.5,
            "design": 78.0,
            "destination_accessibility": 90.0,
            "distance_to_transit": 81.5
        },
        "benchmark_scores": {
            "density": 77.0,
            "diversity": 76.5,
            "design": 62.5,
            "destination_accessibility": 79.5,
            "distance_to_transit": 78.0
        },
        "typology": "Commercial Transit Hub",
        "weakest_dimension": "Design",
        "strongest_dimension": "Destination Accessibility",
        "status": "Sangat Siap (Tier 1)",
        "njop_premium": {
            "avg_njop_premium_pct": 14.8,
            "ci_lower_pct": 11.2,
            "ci_upper_pct": 18.4,
            "affected_h3_count": 19,
            "r_squared": 0.78,
            "direct_effect_pct": 10.2,
            "spillover_effect_pct": 4.6
        },
        "policy_recommendations": [
            "Perluasan jalur pedestrian berkanopi di koridor timur menuju Jalan Dharmahusada.",
            "Penambahan integrasi halte feeder WiraWiri rute FD07 langsung di lobby stasiun.",
            "Penerapan insentif lantai bangunan (FAR bonus) untuk hunian vertikal terjangkau dalam radius 400m."
        ]
    },
    "pasar_turi": {
        "id": "pasar_turi",
        "name": "Stasiun Pasar Turi",
        "latitude": -7.2478,
        "longitude": 112.7306,
        "tod_readiness_score": 79.2,
        "scores": {
            "density": 82.0,
            "diversity": 86.0,
            "design": 65.5,
            "destination_accessibility": 83.0,
            "distance_to_transit": 79.5
        },
        "benchmark_scores": {
            "density": 77.0,
            "diversity": 76.5,
            "design": 62.5,
            "destination_accessibility": 79.5,
            "distance_to_transit": 78.0
        },
        "typology": "Commercial Transit Hub",
        "weakest_dimension": "Design",
        "strongest_dimension": "Diversity",
        "status": "Siap (Tier 2)",
        "njop_premium": {
            "avg_njop_premium_pct": 12.3,
            "ci_lower_pct": 9.1,
            "ci_upper_pct": 15.5,
            "affected_h3_count": 19,
            "r_squared": 0.74,
            "direct_effect_pct": 8.5,
            "spillover_effect_pct": 3.8
        },
        "policy_recommendations": [
            "Penataan relokasi kantong parkir liar dan PKL yang meluber di Jalan Semarang.",
            "Peningkatan kualitas trotoar dengan tactile paving standar disabilitas menuju Pasar Turi Baru.",
            "Penyediaan integrasi antarmoda terpadu Suroboyo Bus Koridor 3."
        ]
    },
    "semut": {
        "id": "semut",
        "name": "Stasiun Surabaya Kota (Semut)",
        "latitude": -7.2372,
        "longitude": 112.7431,
        "tod_readiness_score": 71.0,
        "scores": {
            "density": 74.0,
            "diversity": 78.0,
            "design": 60.0,
            "destination_accessibility": 75.0,
            "distance_to_transit": 68.0
        },
        "benchmark_scores": {
            "density": 77.0,
            "diversity": 76.5,
            "design": 62.5,
            "destination_accessibility": 79.5,
            "distance_to_transit": 78.0
        },
        "typology": "Mixed-Use Heritage Core",
        "weakest_dimension": "Distance to Transit",
        "strongest_dimension": "Diversity",
        "status": "Cukup Siap (Tier 2)",
        "njop_premium": {
            "avg_njop_premium_pct": 9.7,
            "ci_lower_pct": 6.8,
            "ci_upper_pct": 12.6,
            "affected_h3_count": 19,
            "r_squared": 0.69,
            "direct_effect_pct": 6.8,
            "spillover_effect_pct": 2.9
        },
        "policy_recommendations": [
            "Revitalisasi koridor heritage kawasan pecinan Kya-Kya dan Jembatan Merah terhubung ke stasiun.",
            "Penambahan titik feeder WiraWiri untuk menghubungkan kawasan bisnis pergudangan.",
            "Perbaikan drainase jalan untuk mengeliminasi genangan saat musim hujan tinggi."
        ]
    },
    "wonokromo": {
        "id": "wonokromo",
        "name": "Stasiun Wonokromo",
        "latitude": -7.3014,
        "longitude": 112.7383,
        "tod_readiness_score": 76.4,
        "scores": {
            "density": 82.5,
            "diversity": 74.0,
            "design": 58.2,
            "destination_accessibility": 79.1,
            "distance_to_transit": 88.0
        },
        "benchmark_scores": {
            "density": 77.0,
            "diversity": 76.5,
            "design": 62.5,
            "destination_accessibility": 79.5,
            "distance_to_transit": 78.0
        },
        "typology": "Mixed-Use Residential Area",
        "weakest_dimension": "Design",
        "strongest_dimension": "Distance to Transit",
        "status": "Siap (Tier 2)",
        "njop_premium": {
            "avg_njop_premium_pct": 11.5,
            "ci_lower_pct": 8.4,
            "ci_upper_pct": 14.6,
            "affected_h3_count": 19,
            "r_squared": 0.72,
            "direct_effect_pct": 8.1,
            "spillover_effect_pct": 3.4
        },
        "policy_recommendations": [
            "Peningkatan kualitas trotoar timur stasiun menuju DTC (Darmo Trade Center) dan frontage Ahmad Yani.",
            "Pembangunan JPO modern atau penyeberangan sebidang ramah pejalan kaki.",
            "Penataan terminal angkutan mikrolet terintegrasi dengan gate stasiun."
        ]
    },
    "waru": {
        "id": "waru",
        "name": "Stasiun Waru",
        "latitude": -7.3519,
        "longitude": 112.7297,
        "tod_readiness_score": 68.3,
        "scores": {
            "density": 70.0,
            "diversity": 65.0,
            "design": 52.0,
            "destination_accessibility": 71.5,
            "distance_to_transit": 83.0
        },
        "benchmark_scores": {
            "density": 77.0,
            "diversity": 76.5,
            "design": 62.5,
            "destination_accessibility": 79.5,
            "distance_to_transit": 78.0
        },
        "typology": "Low-Accessibility Feeder Zone",
        "weakest_dimension": "Design",
        "strongest_dimension": "Distance to Transit",
        "status": "Butuh Peningkatan (Tier 3)",
        "njop_premium": {
            "avg_njop_premium_pct": 8.2,
            "ci_lower_pct": 5.5,
            "ci_upper_pct": 10.9,
            "affected_h3_count": 19,
            "r_squared": 0.65,
            "direct_effect_pct": 5.9,
            "spillover_effect_pct": 2.3
        },
        "policy_recommendations": [
            "Pembangunan trotoar primer yang saat ini terputus dalam radius 200 meter dari stasiun ke Terminal Purabaya.",
            "Ekspansi koridor feeder WiraWiri rute selatan Sidoarjo-Surabaya.",
            "Pencegahan titik genangan banjir berkala di persimpangan Bundaran Waru."
        ]
    }
}

# Mapping dari dimension name ke key dalam scores dict
_DIMENSION_KEY_MAP: Dict[str, str] = {
    "Density": "density",
    "Diversity": "diversity",
    "Design": "design",
    "Destination Accessibility": "destination_accessibility",
    "Distance to Transit": "distance_to_transit",
}


def get_weakest_dimension_score(station: Dict[str, Any]) -> float:
    """Mengembalikan skor numerik dari dimensi terlemah stasiun secara dinamis."""
    weakest = station.get("weakest_dimension", "Design")
    key = _DIMENSION_KEY_MAP.get(weakest, "design")
    return station["scores"].get(key, 0.0)


def get_all_h3_features() -> Dict[str, Any]:
    """Pre-generate GeoJSON FeatureCollection seluruh sel H3 dari semua stasiun."""
    features = []
    for s_id, s_data in STATIONS_DATA.items():
        cluster_features = generate_station_h3_cluster(
            station_id=s_id,
            station_name=s_data["name"],
            center_lon=s_data["longitude"],
            center_lat=s_data["latitude"],
            base_tod_score=s_data["tod_readiness_score"],
            base_njop_premium=s_data["njop_premium"]["avg_njop_premium_pct"],
            typology=s_data["typology"]
        )
        features.extend(cluster_features)
    return {"type": "FeatureCollection", "features": features}


def get_all_survey_features() -> Dict[str, Any]:
    """Menghasilkan mock survey points (Activity & Mission) per stasiun untuk fallback lokal."""
    sample_categories = [
        {"cat": "Pedestrian & Walkability", "type": "activity", "sub": None, "icon": "walk",
         "desc": "Trotoar lebar dengan tactile paving namun terdapat lubang dekat halte."},
        {"cat": "Transit Integration", "type": "activity", "sub": None, "icon": "bus",
         "desc": "Titik drop-off ojek online teratur dekat pintu utara stasiun."},
        {"cat": "Disamenity & Obstacle", "type": "activity", "sub": None, "icon": "alert",
         "desc": "PKL memakan 60% badan trotoar pejalan kaki jam sibuk sore."},
        {"cat": "User Dynamics", "type": "activity", "sub": None, "icon": "users",
         "desc": "Antrean penumpang feeder WiraWiri padat pukul 07.15 WIB."},
        {"cat": "Menu Go", "type": "mission", "sub": "menu_go", "icon": "coffee",
         "desc": "Kedai Kopi Komuter - Menu Rp 18.000 - Rp 32.000. Kondisi ramai."},
        {"cat": "Struk Go", "type": "mission", "sub": "struk_go", "icon": "receipt",
         "desc": "Minimarket Stasiun - Rata-rata transaksi Rp 38.500 per pelanggan."},
        {"cat": "Properti Go", "type": "mission", "sub": "properti_go", "icon": "home",
         "desc": "Ruko 2 Lantai Disewakan - Rp 65 Juta/tahun radius 300m dari stasiun."}
    ]

    features = []
    point_id = 1
    for s_id, s_data in STATIONS_DATA.items():
        base_lon = s_data["longitude"]
        base_lat = s_data["latitude"]

        for i in range(12):
            cat_info = sample_categories[i % len(sample_categories)]
            angle = (i * 30) * math.pi / 180.0
            radius_deg = 0.002 + (i % 4) * 0.0015
            pt_lon = round(base_lon + radius_deg * 1.2 * math.cos(angle), 6)
            pt_lat = round(base_lat + radius_deg * math.sin(angle), 6)

            features.append({
                "type": "Feature",
                "id": f"survey_{point_id:04d}",
                "properties": {
                    "id": f"survey_{point_id:04d}",
                    "station_cluster": s_id,
                    "station_name": s_data["name"],
                    "category": cat_info["cat"],
                    "survey_type": cat_info["type"],
                    "mission_subtype": cat_info["sub"],
                    "hashtag": "#PakSibukGa",
                    "name": f"{cat_info['cat']} - {s_data['name']} #{point_id}",
                    "description": cat_info["desc"],
                    "condition": "Cukup Baik" if i % 2 == 0 else "Perlu Perbaikan",
                    "spending_amount": 35000 + (i * 4500) if cat_info["sub"] == "struk_go" else None,
                    "menu_price_range": "Rp 15.000 - Rp 35.000" if cat_info["sub"] == "menu_go" else None,
                    "property_price": 65000000 + (i * 10000000) if cat_info["sub"] == "properti_go" else None,
                    "transaction_type": "sewa" if i % 2 == 0 else "jual",
                    "surveyed_at": "2026-08-16T14:30:00+07:00",
                    "photo_url": "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&auto=format&fit=crop&q=60"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [pt_lon, pt_lat]
                }
            })
            point_id += 1

    return {"type": "FeatureCollection", "features": features}
