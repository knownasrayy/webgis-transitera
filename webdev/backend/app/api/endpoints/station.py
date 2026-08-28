from fastapi import APIRouter, HTTPException

router = APIRouter()

STATION_SUMMARIES = {
    'gubeng': {
        "id": "gubeng",
        "name": "Stasiun Surabaya Gubeng",
        "tod_readiness_score": 84.5,
        "radar_data": [
            {"subject": "Density", "A": 90, "fullMark": 100},
            {"subject": "Diversity", "A": 85, "fullMark": 100},
            {"subject": "Design", "A": 75, "fullMark": 100},
            {"subject": "Destination", "A": 80, "fullMark": 100},
            {"subject": "Distance", "A": 95, "fullMark": 100}
        ],
        "walkability_index": {
            "score": 56,
            "status": "FAIR",
            "description": "High density of POIs within 1km",
            "metrics": {
                "Trotoar Coverage": "62%",
                "Tactile Paving": "43%"
            }
        },
        "recommendations": [
            "Perluasan jalur pedestrian berkanopi di koridor timur menuju Jalan Dharmahusada.",
            "Penambahan integrasi halte feeder WiraWiri rute FD07 langsung di lobby stasiun.",
            "Penerapan insentif lantai bangunan (FAR bonus) untuk hunian vertikal terjangkau dalam radius 400m."
        ]
    },
    'pasar-turi': {
        "id": "pasar-turi",
        "name": "Stasiun Surabaya Pasar Turi",
        "tod_readiness_score": 72.8,
        "radar_data": [
            {"subject": "Density", "A": 85, "fullMark": 100},
            {"subject": "Diversity", "A": 95, "fullMark": 100},
            {"subject": "Design", "A": 50, "fullMark": 100},
            {"subject": "Destination", "A": 88, "fullMark": 100},
            {"subject": "Distance", "A": 60, "fullMark": 100}
        ],
        "walkability_index": {
            "score": 42,
            "status": "POOR",
            "description": "High commercial density but poor pedestrian safety",
            "metrics": {
                "Trotoar Coverage": "45%",
                "Tactile Paving": "12%"
            }
        },
        "recommendations": [
            "Revitalisasi total jalur pejalan kaki di jalan raya sekitar Pasar Turi.",
            "Penertiban PKL untuk membebaskan trotoar bagi pejalan kaki.",
            "Pembangunan jembatan penyeberangan orang (JPO) yang terhubung langsung ke pusat grosir."
        ]
    }
}

@router.get("/api/v1/station-summary")
async def get_station_summary(station_id: str):
    """
    Returns dashboard analytics and radar chart data for a specific station.
    """
    if station_id not in STATION_SUMMARIES:
        # Fallback for stations not yet fully modeled in this mock
        return STATION_SUMMARIES['gubeng']
        
    return STATION_SUMMARIES[station_id]
