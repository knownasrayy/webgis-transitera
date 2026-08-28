# TransitERA Spatial AI Function Calling Tool Declarations
SPATIAL_TOOLS = [
    {
        "name": "get_tod_score",
        "description": "Mengambil skor kesiapan TOD 5D, radar chart, dan tipologi kawasan pada simpul stasiun tertentu di Surabaya.",
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
                "station_a": {
                    "type": "string",
                    "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "ID stasiun pertama"
                },
                "station_b": {
                    "type": "string",
                    "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "ID stasiun kedua"
                }
            },
            "required": ["station_a", "station_b"]
        }
    },
    {
        "name": "get_weakest_dimension",
        "description": "Mengidentifikasi dimensi indikator 5D TOD terlemah pada stasiun untuk rekomendasi kebijakan perbaikan infrastruktur.",
        "parameters": {
            "type": "object",
            "properties": {
                "station_id": {
                    "type": "string",
                    "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "ID stasiun transit"
                }
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
                "station_id": {
                    "type": "string",
                    "enum": ["gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "ID stasiun transit"
                }
            },
            "required": ["station_id"]
        }
    },
    {
        "name": "filter_layer",
        "description": "Memfilter tampilan layer peta berdasarkan kriteria tertentu (misal titik survei Menu Go ramai, Struk Go, atau Activity).",
        "parameters": {
            "type": "object",
            "properties": {
                "target_layer": {
                    "type": "string",
                    "enum": ["h3_tod_score", "h3_njop_premium", "survey_activity", "survey_mission_menu", "survey_mission_properti", "survey_mission_struk"],
                    "description": "Nama layer yang ingin difilter"
                },
                "kondisi": {
                    "type": "string",
                    "description": "Kondisi atau kata kunci filter (contoh: 'ramai', 'rusak')"
                }
            },
            "required": ["target_layer"]
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
                    "enum": ["extend_feeder_waru", "add_feeder_semut", "dedicated_pedestrian_gubeng", "pasar_turi_integration"],
                    "description": "ID skenario intervensi yang disimulasikan."
                }
            },
            "required": ["scenario_id"]
        }
    },
    {
        "name": "site_recommendation",
        "description": "Memberikan rekomendasi sel H3 terbaik untuk pembukaan usaha UMKM kuliner atau komersial berdasarkan proksi daya beli (Struk Go) dan keramaian (Menu Go).",
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
                    "enum": ["all", "gubeng", "pasar_turi", "semut", "wonokromo", "waru"],
                    "description": "Filter kawasan stasiun tertentu"
                }
            },
            "required": ["business_type"]
        }
    }
]
