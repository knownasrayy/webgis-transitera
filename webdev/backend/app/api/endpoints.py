from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any

from app.schemas.tod import (
    StationId,
    StationSummary,
    StationTODScoreResponse,
    NJOPPremiumResponse,
    ScenarioSimulationRequest,
    ScenarioSimulationResponse,
    TODDimensionScores
)
from app.schemas.ai import AIQueryRequest, AIResponse
from app.data.stations_data import STATIONS_DATA, get_all_h3_features, get_all_survey_features
from app.data.mapid_client import fetch_survey_geojson
from app.ai.gemini_proxy import process_ai_query

router = APIRouter()

@router.get("/stations", response_model=List[StationSummary])
async def list_stations():
    """
    Mengambil ringkasan 5 simpul stasiun transit utama SRRL Surabaya.
    """
    summaries = []
    for s_id, s in STATIONS_DATA.items():
        summaries.append(StationSummary(
            id=s["id"],
            name=s["name"],
            latitude=s["latitude"],
            longitude=s["longitude"],
            tod_readiness_score=s["tod_readiness_score"],
            typology=s["typology"],
            weakest_dimension=s["weakest_dimension"],
            strongest_dimension=s["strongest_dimension"],
            status=s["status"]
        ))
    return summaries

@router.get("/tod-score/{station_id}", response_model=StationTODScoreResponse)
async def get_station_tod_score(station_id: StationId):
    """
    Mengambil detail skor 5D TOD, benchmark koridor, dan rekomendasi per stasiun.
    """
    data = STATIONS_DATA.get(station_id.value)
    if not data:
        raise HTTPException(status_code=404, detail=f"Stasiun '{station_id}' tidak ditemukan")
        
    return StationTODScoreResponse(
        station_id=data["id"],
        station_name=data["name"],
        tod_readiness_score=data["tod_readiness_score"],
        scores=TODDimensionScores(**data["scores"]),
        benchmark_scores=TODDimensionScores(**data["benchmark_scores"]),
        typology=data["typology"],
        weakest_dimension=data["weakest_dimension"],
        strongest_dimension=data["strongest_dimension"],
        h3_indexes=[f"8965e{station_id.value[:3]}{i:03d}ffff" for i in range(19)],
        policy_recommendations=data["policy_recommendations"]
    )

@router.get("/h3-grid")
async def get_h3_grid(
    station: Optional[str] = Query(None, description="Filter berdasarkan stasiun"),
    min_score: Optional[float] = Query(None, ge=0, le=100)
):
    """
    Mengambil GeoJSON FeatureCollection sel H3 (resolusi 9) dengan skor 5D TOD & NJOP.
    """
    geo_data = get_all_h3_features()
    
    if station:
        filtered = [f for f in geo_data["features"] if f["properties"]["station_cluster"] == station.lower()]
        geo_data["features"] = filtered
        
    if min_score is not None:
        filtered = [f for f in geo_data["features"] if f["properties"]["tod_readiness_score"] >= min_score]
        geo_data["features"] = filtered
        
    return geo_data

@router.get("/njop-premium/{station_id}", response_model=NJOPPremiumResponse)
async def get_njop_premium(station_id: StationId):
    """
    Mengambil estimasi premium nilai lahan (%ΔNJOP) berbasis Spatial Durbin Model.
    """
    data = STATIONS_DATA.get(station_id.value)
    if not data:
        raise HTTPException(status_code=404, detail="Stasiun tidak ditemukan")
        
    njop = data["njop_premium"]
    return NJOPPremiumResponse(
        station_id=data["id"],
        station_name=data["name"],
        avg_njop_premium_pct=njop["avg_njop_premium_pct"],
        ci_lower_pct=njop["ci_lower_pct"],
        ci_upper_pct=njop["ci_upper_pct"],
        affected_h3_count=njop["affected_h3_count"],
        r_squared=njop["r_squared"],
        direct_effect_pct=njop["direct_effect_pct"],
        spillover_effect_pct=njop["spillover_effect_pct"]
    )

@router.get("/survey-points")
async def get_survey_points(
    survey_type: Optional[str] = Query(None, description="activity | mission"),
    mission_subtype: Optional[str] = Query(None, description="properti_go | struk_go | menu_go"),
    station: Optional[str] = None
):
    """
    Mengambil GeoJSON titik hasil survei lapangan `#PakSibukGa` dari GEO MAPID REST API.
    """
    # Surabaya Bounding Box
    SURABAYA_POLYGON = [
        [
            [112.55, -7.36],
            [112.80, -7.36],
            [112.80, -7.18],
            [112.55, -7.18],
            [112.55, -7.36]
        ]
    ]
    
    data = fetch_survey_geojson(polygon_coords=SURABAYA_POLYGON, hashtag="PakSibukGa")
    features = data.get("features", [])
    
    if survey_type:
        features = [f for f in features if f.get("properties", {}).get("survey_type") == survey_type]
    if mission_subtype:
        features = [f for f in features if f.get("properties", {}).get("mission_subtype") == mission_subtype]
    if station:
        features = [f for f in features if f.get("properties", {}).get("station_cluster") == station.lower()]
        
    data["features"] = features
    return data

@router.post("/simulate", response_model=ScenarioSimulationResponse)
async def simulate_scenario(request: ScenarioSimulationRequest):
    """
    Mensimulasikan skenario intervensi what-if terhadap skor TOD dan %ΔNJOP.
    """
    st_data = STATIONS_DATA.get(request.target_station.value, STATIONS_DATA["waru"])
    base_score = st_data["tod_readiness_score"]
    base_njop = st_data["njop_premium"]["avg_njop_premium_pct"]
    
    delta_score = 7.5 if request.intervention_type == "feeder_extension" else 5.2
    delta_njop = 3.2 if request.intervention_type == "feeder_extension" else 2.1
    
    return ScenarioSimulationResponse(
        scenario_id=request.scenario_id,
        target_station=request.target_station,
        baseline_tod_score=base_score,
        simulated_tod_score=round(base_score + delta_score, 1),
        delta_tod_score=delta_score,
        baseline_njop_premium_pct=base_njop,
        simulated_njop_premium_pct=round(base_njop + delta_njop, 1),
        delta_njop_premium_pct=delta_njop,
        dimension_impacts={
            "distance_to_transit": +12.0,
            "destination_accessibility": +6.5,
            "diversity": +4.0,
            "design": +8.5,
            "density": +2.0
        },
        summary_narrative=(
            f"Intervensi {request.intervention_type.replace('_', ' ')} pada simpul {st_data['name']} "
            f"meningkatkan kesiapan TOD dari {base_score} ke {round(base_score + delta_score, 1)} "
            f"dan mendorong tambahan apresiasi nilai lahan sebesar +{delta_njop}%."
        )
    )

@router.post("/ai/query", response_model=AIResponse)
async def ai_query(request: AIQueryRequest):
    """
    Proxy endpoint Asisten Spasial AI (Google Gemini via JSON Function Calling).
    """
    return await process_ai_query(request)
