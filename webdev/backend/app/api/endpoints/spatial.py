from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import random

from app.core.h3_engine import generate_h3_grid_around_point, create_h3_feature_collection
from app.analytics.ahp_calculator import AHPCalculator
from app.analytics.sdm_regression import SDMRegressor

router = APIRouter()
ahp_calc = AHPCalculator()
sdm_model = SDMRegressor()

# Base stations coordinates for reference (will be moved to DB later)
STATIONS_COORDS = {
    'gubeng': (-7.2654, 112.7521),
    'pasar-turi': (-7.2458, 112.7314),
    'wonokromo': (-7.3014, 112.7383),
    'waru': (-7.3486, 112.7297),
    'surabaya-kota': (-7.2415, 112.7419)
}

def validate_study_area(lat: float, lng: float):
    """
    SEC-F2: Validasi bounding box wilayah studi (Surabaya/Gerbangkertosusila).
    Tolak koordinat [0,0] atau yang di luar wilayah secara eksplisit.
    """
    if lat == 0.0 and lng == 0.0:
        raise HTTPException(status_code=400, detail="Invalid coordinates: [0,0] is not allowed")
    
    # Rough bounding box for Surabaya / GKS region
    MIN_LAT, MAX_LAT = -7.6, -7.0
    MIN_LNG, MAX_LNG = 112.5, 113.0
    
    if not (MIN_LAT <= lat <= MAX_LAT and MIN_LNG <= lng <= MAX_LNG):
        raise HTTPException(status_code=400, detail="Coordinates out of study area bounds")

@router.get("/api/v1/h3-grid")
async def get_h3_grid(
    station_id: Optional[str] = Query('gubeng', description="Station ID to generate grid around"),
    resolution: int = Query(9, description="H3 resolution (8 or 9)")
):
    """
    Returns a GeoJSON FeatureCollection of H3 hexagons representing the TOD grid
    for a given station. Computes AHP TOD score and NJOP premium for each grid cell.
    """
    if station_id not in STATIONS_COORDS:
        raise HTTPException(status_code=404, detail="Station not found")
        
    lat, lng = STATIONS_COORDS[station_id]
    validate_study_area(lat, lng)
    
    # 1. Generate H3 Grid (approx 1.5 - 2km radius)
    h3_indices = generate_h3_grid_around_point(lat, lng, radius_km=1.5, resolution=resolution)
    
    # Pairwise comparison matrix for 5D (example logic, adjust per stakeholder config)
    # Order: Density, Diversity, Design, Destination, Distance
    ahp_matrix = [
        [1.0, 2.0, 3.0, 2.0, 0.5],
        [0.5, 1.0, 2.0, 1.0, 0.33],
        [0.33, 0.5, 1.0, 0.5, 0.25],
        [0.5, 1.0, 2.0, 1.0, 0.33],
        [2.0, 3.0, 4.0, 3.0, 1.0]
    ]
    
    weights_res = ahp_calc.calculate_weights(ahp_matrix)
    weights = weights_res['weights']
    
    # Generate mock properties for each grid cell using the AHP weights and SDM
    properties_map = {}
    for h3_idx in h3_indices:
        # Simulate base metrics for this cell
        density = random.uniform(40, 100)
        diversity = random.uniform(30, 95)
        design = random.uniform(50, 100)
        destination = random.uniform(20, 80)
        distance = random.uniform(60, 100)  # closer to center = higher score
        
        scores_5d = {
            'density': density,
            'diversity': diversity,
            'design': design,
            'destination': destination,
            'distance': distance
        }
        
        # Calculate final TOD score using AHP weights
        tod_score = ahp_calc.calculate_tod_score(scores_5d, weights)
        
        # Determine typology based on scores
        if tod_score > 75 and diversity > 70:
            typology = "Commercial Transit Hub"
        elif tod_score > 60:
            typology = "Mixed-Use Residential Area"
        elif distance > 50:
            typology = "Low-Accessibility Feeder Zone"
        else:
            typology = "Transit-Adjacent Development"
            
        # Predict premium using SDM
        # Simulating distance decay: Randomizing distance from 0 to 1500m
        distance_to_station_m = random.uniform(100, 1500) 
        njop_premium = sdm_model.predict_premium(tod_score, distance_to_station_m)
        
        properties_map[h3_idx] = {
            "station_name": station_id.replace('-', ' ').title(),
            "tod_readiness_score": round(tod_score, 1),
            "predicted_njop_premium_pct": njop_premium,
            "typology": typology
        }
        
    feature_collection = create_h3_feature_collection(h3_indices, properties_map)
    
    return feature_collection
