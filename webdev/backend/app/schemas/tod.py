from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional, Dict, Any

class StationId(str, Enum):
    GUBENG = "gubeng"
    PASAR_TURI = "pasar_turi"
    SEMUT = "semut"
    WONOKROMO = "wonokromo"
    WARU = "waru"

class TODDimensionScores(BaseModel):
    density: float = Field(..., ge=0, le=100, description="Kepadatan penduduk & intensitas ruang")
    diversity: float = Field(..., ge=0, le=100, description="Percampuran guna lahan & variasi usaha")
    design: float = Field(..., ge=0, le=100, description="Kualitas jalur pedestrian & kenyamanan pejalan kaki")
    destination_accessibility: float = Field(..., ge=0, le=100, description="Aksesibilitas ke POI penting 15 menit")
    distance_to_transit: float = Field(..., ge=0, le=100, description="Kedekatan fisik & konektivitas jaringan ke stasiun/feeder")

class StationSummary(BaseModel):
    id: StationId
    name: str
    latitude: float
    longitude: float
    tod_readiness_score: float = Field(..., ge=0, le=100)
    typology: str
    weakest_dimension: str
    strongest_dimension: str
    status: str

class StationTODScoreResponse(BaseModel):
    station_id: StationId
    station_name: str
    tod_readiness_score: float = Field(..., ge=0, le=100)
    scores: TODDimensionScores
    benchmark_scores: TODDimensionScores
    typology: str
    weakest_dimension: str
    strongest_dimension: str
    h3_indexes: List[str]
    policy_recommendations: List[str]

class NJOPPremiumResponse(BaseModel):
    station_id: StationId
    station_name: str
    avg_njop_premium_pct: float
    ci_lower_pct: float
    ci_upper_pct: float
    affected_h3_count: int
    r_squared: float
    direct_effect_pct: float
    spillover_effect_pct: float

class ScenarioSimulationRequest(BaseModel):
    scenario_id: str
    target_station: StationId
    intervention_type: str = Field(..., description="feeder_extension | pedestrian_upgrade | mixed_use_rezoning")
    parameters: Optional[Dict[str, Any]] = None

class ScenarioSimulationResponse(BaseModel):
    scenario_id: str
    target_station: StationId
    baseline_tod_score: float
    simulated_tod_score: float
    delta_tod_score: float
    baseline_njop_premium_pct: float
    simulated_njop_premium_pct: float
    delta_njop_premium_pct: float
    dimension_impacts: Dict[str, float]
    summary_narrative: str
