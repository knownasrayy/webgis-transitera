from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class AIQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=2, max_length=1000, description="Kueri bahasa alami dari pengguna")
    active_station: Optional[str] = None
    active_layer: Optional[str] = None
    viewport_bbox: Optional[List[float]] = None # [min_lon, min_lat, max_lon, max_lat]

class ViewState(BaseModel):
    center: List[float] = Field(..., description="[longitude, latitude]")
    zoom: float
    pitch: Optional[float] = 0
    bearing: Optional[float] = 0

class ChartPayload(BaseModel):
    type: str # "radar_5d", "bar_comparison", "scenario_impact"
    title: Optional[str] = None
    data: Any

class AIData(BaseModel):
    action: str = Field(..., description="highlight_and_zoom | filter_layer | compare_stations | show_scenario | site_recommendation | default_narrative")
    target_layer: Optional[str] = None
    target_station: Optional[str] = None
    view_state: Optional[ViewState] = None
    filter_query: Optional[Dict[str, Any]] = None
    chart_payload: Optional[ChartPayload] = None
    text_response: str = Field(..., description="Narasi insight dan rekomendasi yang mudah dipahami")
    function_called: Optional[str] = None
    function_args: Optional[Dict[str, Any]] = None

class AIResponse(BaseModel):
    status: str = "success"
    data: AIData
